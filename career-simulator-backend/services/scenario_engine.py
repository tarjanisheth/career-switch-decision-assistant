def generate_scenarios(financial, professional, personal, overall):
    """
    Generates three scenario probability estimates and a 12-month timeline projection.

    Scenario probabilities are derived from:
    - Professional success probability (how likely is the job search to succeed)
    - Personal stability score (how well the person handles the transition mentally)
    - Financial risk level (how much pressure the runway creates)
    """

    runway = financial["raw_runway_months"]
    success_prob = professional["success_probability_percent"]   # 0–100
    stability = personal["personal_stability_score"]             # 0–100

    # ── BEST CASE ──
    # Requires both professional readiness AND personal stability
    best_raw = (success_prob * 0.6) + (stability * 0.4)

    # ── WORST CASE ──
    # Driven primarily by financial pressure
    if financial["financial_risk_level"] == "High Risk":
        worst_raw = 40
    elif financial["financial_risk_level"] == "Moderate Risk":
        worst_raw = 22
    else:
        worst_raw = 10

    # ── REALISTIC CASE ──
    # Whatever is left — must be positive
    realistic_raw = max(5, 100 - best_raw - worst_raw)

    # ── NORMALISE to sum to 100% ──
    total = best_raw + realistic_raw + worst_raw
    best_pct = round((best_raw / total) * 100, 1)
    worst_pct = round((worst_raw / total) * 100, 1)
    realistic_pct = round(100 - best_pct - worst_pct, 1)  # avoids floating point drift

    # ── 12-MONTH TIMELINE PROJECTION ──
    timeline = {
        "3_months": {
            "financial_pressure": "High" if runway < 4 else ("Moderate" if runway < 7 else "Low"),
            "career_progress": "Early stage — building skills and applying" if success_prob < 50 else "Active applications and interviews",
        },
        "6_months": {
            "financial_pressure": "Critical" if runway < 6 else ("Moderate" if runway < 10 else "Stable"),
            "career_progress": "Struggling to break in" if success_prob < 40 else ("First offers likely" if success_prob >= 65 else "Progressing with effort"),
        },
        "12_months": {
            "financial_status": "Savings likely depleted" if runway < 8 else "Savings still available",
            "career_direction": "Re-evaluation likely needed" if success_prob < 40 else ("Established in new role" if success_prob >= 70 else "Transition in progress"),
        },
    }

    return {
        "scenario_probabilities": {
            "best_case_percent": best_pct,
            "realistic_case_percent": realistic_pct,
            "worst_case_percent": worst_pct,
        },
        "timeline_projection": timeline,
    }
