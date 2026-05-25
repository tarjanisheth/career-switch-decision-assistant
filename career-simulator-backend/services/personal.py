def calculate_personal_metrics(personal_data):

    # Burnout influence (higher burnout may increase quitting impulse)
    burnout_impact = personal_data.burnout_level * 1.5

    # Emotional resilience buffers risk
    resilience_buffer = personal_data.emotional_resilience_score * 2

    # Risk tolerance modifier
    risk_modifier = personal_data.risk_tolerance_score * 1.2

    # Family support factor
    support_weights = {
        "none": -10,
        "partial": 0,
        "strong": 10
    }

    support_factor = support_weights.get(personal_data.family_support_level, 0)

    # Personal stability score
    stability_score = resilience_buffer + risk_modifier + support_factor - burnout_impact

    # Normalize score
    stability_score = max(0, min(100, stability_score))

    if stability_score < 30:
        risk_level = "Emotionally Fragile"
    elif stability_score < 60:
        risk_level = "Moderate Stability"
    else:
        risk_level = "High Stability"

    return {
        "personal_stability_score": round(stability_score, 2),
        "personal_risk_profile": risk_level
    }
