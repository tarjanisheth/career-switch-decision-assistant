def calculate_overall_decision_risk(financial, professional, personal):
    risk_score = 0

    if financial["financial_risk_level"] == "High Risk":
        risk_score += 40
    elif financial["financial_risk_level"] == "Moderate Risk":
        risk_score += 20

    if professional["professional_risk_level"] == "High Risk":
        risk_score += 30
    elif professional["professional_risk_level"] == "Moderate Risk":
        risk_score += 15

    if personal["personal_risk_profile"] == "Emotionally Fragile":
        risk_score += 20
    elif personal["personal_risk_profile"] == "Moderate Stability":
        risk_score += 10

    if risk_score > 60:
        overall = "High Overall Risk"
        recommendation = (
            "This career switch currently appears high risk. Financial instability, "
            "professional uncertainty, or emotional readiness concerns should be addressed first."
        )
    elif risk_score > 30:
        overall = "Moderate Overall Risk"
        recommendation = (
            "Your profile shows potential, but some risk factors need strengthening before making a transition."
        )
    else:
        overall = "Low Overall Risk"
        recommendation = (
            "Your financial, professional, and personal indicators suggest this career transition is realistically achievable with proper planning."
        )

    return {
        "overall_risk_score": risk_score,
        "overall_decision_risk": overall,
        "recommendation": recommendation
    }