def calculate_professional_metrics(professional_data):

    # Demand weights
    demand_weights = {
        "very_high": 1.3,
        "growing": 1.1,
        "stable": 1.0,
        "saturated": 0.7,
        "declining": 0.5
    }

    # Switch difficulty
    switch_weights = {
        "same_field": 1,
        "adjacent_field": 1.4,
        "new_field": 2
    }

    demand_factor = demand_weights.get(professional_data.market_demand_level, 1)
    switch_difficulty = switch_weights.get(professional_data.career_switch_type, 2)

    # Experience factor
    experience_factor = professional_data.years_experience * 8

    raw_score = (experience_factor * demand_factor) / switch_difficulty

    success_probability = max(0, min(100, raw_score))

    # Risk classification
    if success_probability < 40:
        risk_level = "High Professional Risk"
    elif success_probability < 70:
        risk_level = "Moderate Professional Risk"
    else:
        risk_level = "Low Professional Risk"

    return {
        "success_probability_percent": round(success_probability, 2),
        "professional_risk_level": risk_level,
        "professional_score": round(success_probability, 2)
    }