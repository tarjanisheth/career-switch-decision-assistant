def calculate_overall_decision_risk(financial, professional, personal):
    financial_score = financial["financial_risk_score"]
    professional_score = professional["professional_risk_score"]
    personal_score = personal["personal_risk_score"]

    avg_risk = (financial_score + professional_score + personal_score) / 3

    savings_runway = financial["savings_runway_months"]
    emergency_fund = financial["emergency_fund_months"]
    burnout = personal["burnout_level"]
    resilience = personal["emotional_resilience"]
    switch_readiness = professional["career_switch_readiness"]

    if avg_risk >= 75:
        recommendation = "DO NOT QUIT NOW"
        confidence = 90
        summary = (
            "Quitting immediately would expose you to significant financial, career, "
            "and emotional instability."
        )

    elif avg_risk >= 50:
        recommendation = "WAIT & PREPARE"
        confidence = 75
        summary = (
            "You show some readiness for transition, but important risks should be reduced first."
        )

    else:
        recommendation = "REASONABLE TO SWITCH"
        confidence = 85
        summary = (
            "Your profile suggests a manageable level of risk for a planned transition."
        )

    top_risks = []

    if savings_runway < 6:
        top_risks.append(
            f"Your savings can support you for only {round(savings_runway, 1)} months."
        )

    if emergency_fund < 6:
        top_risks.append(
            f"Your emergency fund covers only {round(emergency_fund, 1)} months."
        )

    if switch_readiness < 7:
        top_risks.append(
            "Your career switch readiness appears moderate or low."
        )

    if burnout >= 8:
        top_risks.append(
            "Your burnout level is critically high."
        )

    if resilience <= 4:
        top_risks.append(
            "Your emotional resilience appears low for a major transition."
        )

    if not top_risks:
        top_risks.append("No major critical risk factors detected.")

    action_plan = []

    if recommendation == "DO NOT QUIT NOW":
        action_plan = [
            "Build at least 6 months of financial runway.",
            "Improve career-switch readiness through skill building and applications.",
            "Reduce emotional stress before making a transition."
        ]

    elif recommendation == "WAIT & PREPARE":
        action_plan = [
            "Strengthen financial backup before resigning.",
            "Start applying/interviewing while staying employed.",
            "Re-evaluate after 30–60 days."
        ]

    else:
        action_plan = [
            "Plan your transition carefully.",
            "Maintain a financial safety buffer.",
            "Move forward with structured job search execution."
        ]

    return {
        "recommendation": recommendation,
        "confidence": confidence,
        "summary": summary,
        "top_risks": top_risks,
        "action_plan": action_plan,
        "average_risk_score": round(avg_risk, 2)
    }