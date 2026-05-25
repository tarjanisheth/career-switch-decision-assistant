def calculate_overall_decision_risk(financial, professional, personal):

    risk_score = 0

    # Financial weight
    if financial["financial_risk_level"] == "High Risk":
        risk_score += 40
    elif financial["financial_risk_level"] == "Moderate Risk":
        risk_score += 20

    # Professional weight
    if professional["professional_risk_level"] == "High Risk":
        risk_score += 30
    elif professional["professional_risk_level"] == "Moderate Risk":
        risk_score += 15

    # Personal weight
    if personal["personal_risk_profile"] == "Emotionally Fragile":
        risk_score += 20
    elif personal["personal_risk_profile"] == "Moderate Stability":
        risk_score += 10

    # Final classification
    if risk_score > 60:
        overall = "High Overall Risk"
    elif risk_score > 30:
        overall = "Moderate Overall Risk"
    else:
        overall = "Low Overall Risk"

    return {
        "overall_risk_score": risk_score,
        "overall_decision_risk": overall
    }
