def calculate_overall_decision_risk(financial, professional, personal):
    financial_score = financial["financial_score"]           # 0–100
    professional_score = professional["professional_score"]  # 0–100
    personal_score = personal["personal_stability_score"]    # 0–100

    savings_runway = financial["raw_runway_months"] if financial["raw_runway_months"] != float("inf") else 999
    dependents_count = financial.get("dependents_count", 0)

    # ── OVERALL RISK SCORE (0 = safe, 100 = very risky) ──
    avg_readiness = (financial_score + professional_score + personal_score) / 3
    avg_risk = round(max(0, min(100, 100 - avg_readiness)), 2)

    # ── READINESS SCORE (shown to user as overall confidence) ──
    readiness_score = round(avg_readiness, 1)

    # ── DETERMINE SITUATION ──
    if dependents_count > 0 and savings_runway < 6:
        archetype = "Supporting a Family on a Short Runway"
        archetype_description = (
            "You have people depending on your income, and your savings would only last a few months if you quit today. "
            "That combination makes an immediate exit genuinely risky — not impossible, but it needs a plan. "
            "The goal is to line up your next income source before you walk out the door."
        )
        recommended_strategy = "Stay employed while actively building toward the switch"

    elif financial_score < 40 and personal_score < 40:
        archetype = "Burned Out and Running Low on Savings"
        archetype_description = (
            "You are exhausted and want out — that is completely understandable. But your savings are thin, "
            "and quitting right now would likely swap job stress for money stress within a few weeks. "
            "The move here is to protect your mental health while buying yourself a little more financial breathing room."
        )
        recommended_strategy = "Reduce effort at current job while upskilling on the side"

    elif professional_score < 35 and financial_score >= 65:
        archetype = "Good Savings, but Not Quite Ready for the New Field"
        archetype_description = (
            "You have the financial cushion to make this work, which is a real advantage. "
            "The gap right now is on the professional side — your experience or market fit in the new field "
            "is still thin, which means the job search could take longer than you expect. "
            "Use the runway you have to close that gap before you quit."
        )
        recommended_strategy = "Invest your runway time into building skills and a portfolio"

    elif financial_score >= 65 and professional_score >= 60:
        archetype = "Ready to Make the Move"
        archetype_description = (
            "Your finances are solid and your professional readiness is strong. "
            "You are in a genuinely good position to make this switch in a structured way. "
            "This does not mean rush — it means you have the foundation to do it right."
        )
        recommended_strategy = "Plan a clean exit with a clear start date"

    else:
        archetype = "On the Right Track, but Not Quite There Yet"
        archetype_description = (
            "You have decent savings and some readiness, but a few gaps still need attention before you pull the trigger. "
            "You are closer than you think — a few focused months of preparation could move you into a much stronger position."
        )
        recommended_strategy = "Set a target exit date and work backward from it"

    # ── GENERATE THREE DECISION PATHS ──
    paths = []

    # ── PATH A: Quit Now ──
    leap_days = round(savings_runway * 30) if savings_runway != 999 else None
    leap_risk = "High" if savings_runway < 4 else ("Moderate" if savings_runway < 8 else "Low")
    leap_stress = "Very High" if savings_runway < 3 else ("High" if savings_runway < 6 else "Moderate")

    if leap_days:
        leap_narrative = (
            f"If you quit today, your savings cover roughly {leap_days} days of expenses. "
            "You will feel immediate relief from leaving your current job, but the clock starts ticking. "
            f"You need to secure income before that window closes"
            + (f", and with {dependents_count} dependent(s) relying on you, the pressure is real." if dependents_count > 0 else ".")
        )
    else:
        leap_narrative = (
            "Your passive income covers your expenses, so quitting today carries no financial collapse risk. "
            "The focus shifts entirely to landing the right role in your new field."
        )

    paths.append({
        "id": "leap",
        "name": "Path A: Quit Now",
        "tagline": "Leave your job today and focus 100% on the switch.",
        "risk": leap_risk,
        "stress": leap_stress,
        "narrative": leap_narrative,
        "steps": [
            "Take 3–5 days off to decompress before starting the job search.",
            "Treat the search like a full-time job — 6–8 hours a day of applying, learning, and networking.",
            "If no offer arrives within 60 days, pivot to freelance or contract work in the adjacent field.",
        ],
        "pros": [
            "Full mental bandwidth goes into the career switch",
            "Immediate relief from burnout",
        ],
        "cons": [
            "Financial pressure builds quickly if the search takes longer than expected",
            "Desperation can lead to accepting the wrong offer",
        ],
    })

    # ── PATH B: Stay and Build ──
    paths.append({
        "id": "bridge",
        "name": "Path B: Stay and Build",
        "tagline": "Keep your salary while quietly preparing for the switch.",
        "risk": "Low",
        "stress": "Medium",
        "narrative": (
            "You stay employed but mentally check out of going above and beyond. "
            "Strict boundaries — no overtime, log off on time — free up 10–15 hours a week. "
            "You use that time to upskill, build a portfolio, and apply. "
            "You only resign once you have a concrete offer or your first freelance client."
        ),
        "steps": [
            "Set a firm daily cutoff time and stop taking on extra work.",
            "Dedicate 2 hours every weekday evening (or weekend mornings) to learning and applying.",
            "Target your first freelance project or part-time gig in the new field within 60 days.",
            "Resign only after you have signed something — not just a verbal promise.",
        ],
        "pros": [
            "Zero financial risk — savings stay untouched",
            "You can afford to be selective about the first offer",
        ],
        "cons": [
            "Requires sustained discipline over several months",
            "Slower transition — typically 4–8 months",
        ],
    })

    # ── PATH C: Save More, Then Leave ──
    # How many months to save before quitting to reach a 6-month runway
    if savings_runway < 6 and savings_runway != 999:
        monthly_net_current = financial.get("monthly_net_current", 0)
        monthly_burn = financial.get("raw_monthly_burn", 1)
        if monthly_net_current > 0 and monthly_burn > 0:
            # Months needed to save enough to reach 6-month runway
            savings_gap = max(0, (6 * monthly_burn) - (savings_runway * monthly_burn))
            target_months = max(2, round(savings_gap / monthly_net_current))
        else:
            target_months = 3
    else:
        # Already have 6+ months — use this path to build to 9 months (extra buffer)
        target_months = 3

    target_months = min(target_months, 12)  # cap at 12 months

    paths.append({
        "id": "builder",
        "name": "Path C: Save More, Then Leave",
        "tagline": f"Stay for {target_months} more months, save hard, then quit with confidence.",
        "risk": "Low",
        "stress": "Low-Medium",
        "narrative": (
            f"You set a firm resignation date {target_months} months from today and treat it as a countdown. "
            "Every spare rupee goes into a dedicated transition fund. "
            "Knowing there is a fixed end date makes the current job much easier to tolerate — "
            "you are not stuck, you are just finishing a sprint."
        ),
        "steps": [
            "Open a separate savings account labelled 'Career Switch Fund'.",
            "Automate a fixed transfer into it on every salary day.",
            "Cut non-essential subscriptions and discretionary spending for this period.",
            f"Resign on your pre-set date {target_months} months from now — no extensions.",
        ],
        "pros": [
            "Leaves with a solid financial cushion — far less pressure during the search",
            "The countdown date reduces day-to-day burnout",
        ],
        "cons": [
            f"You have to stay in your current role for {target_months} more months",
            "Requires discipline not to push the date back",
        ],
    })

    return {
        "archetype": archetype,
        "archetype_description": archetype_description,
        "recommended_strategy": recommended_strategy,
        "readiness_score": readiness_score,
        "average_risk_score": avg_risk,
        "paths": paths,
        # kept for top_risks display
        "top_risks": _build_top_risks(savings_runway, dependents_count, professional_score, financial_score),
    }


def _build_top_risks(savings_runway, dependents_count, professional_score, financial_score):
    risks = []
    if savings_runway < 3:
        risks.append(f"Savings runway is critically low ({round(savings_runway, 1)} months).")
    if dependents_count > 0 and savings_runway < 6:
        risks.append(f"You have {dependents_count} dependent(s) — a 6-month runway is the minimum safe threshold.")
    if professional_score < 35:
        risks.append("Low professional readiness in the target field increases job search duration.")
    if financial_score < 30 and professional_score < 35:
        risks.append("Both financial and professional readiness are low — this is the highest-risk combination.")
    if not risks:
        risks.append("No critical risk factors identified.")
    return risks
