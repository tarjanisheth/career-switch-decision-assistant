def calculate_professional_metrics(professional_data):
    """
    Calculates professional readiness score (0–100).

    Formula logic:
    - Base score starts at 30 (everyone has some baseline chance)
    - Experience adds up to 40 points (caps at 5 years — beyond that, market demand matters more)
    - Market demand adds/subtracts up to 20 points
    - Switch difficulty reduces the score (new field is hardest)
    - Expected timeline penalty: if user expects income in 1 month but is switching to a new field, that's unrealistic
    """

    # ── EXPERIENCE SCORE (0–40 points) ──
    # Caps at 5 years. 0 years = 0 pts, 5+ years = 40 pts
    experience_score = min(professional_data.years_experience / 5, 1.0) * 40

    # ── MARKET DEMAND SCORE (–20 to +20 points) ──
    demand_bonus = {
        "very_high": 20,
        "growing": 10,
        "stable": 0,
        "saturated": -10,
        "declining": -20,
    }.get(professional_data.market_demand_level, 0)

    # ── SWITCH DIFFICULTY PENALTY (0–25 points deducted) ──
    switch_penalty = {
        "same_field": 0,
        "adjacent_field": 12,
        "new_field": 25,
    }.get(professional_data.career_switch_type, 25)

    # ── BASE + COMPONENTS ──
    raw_score = 30 + experience_score + demand_bonus - switch_penalty

    # ── TIMELINE REALISM CHECK ──
    # If someone expects income in < 2 months but is switching to a new field, penalise
    expected_months = professional_data.expected_months_before_income
    if expected_months < 2 and professional_data.career_switch_type == "new_field":
        raw_score -= 10  # unrealistic expectation penalty
    elif expected_months > 12:
        raw_score -= 5   # very long timeline suggests low confidence

    professional_score = max(0, min(100, raw_score))

    # ── SUCCESS PROBABILITY ──
    # Separate from score — this is used by Monte Carlo
    # Weighted: experience (50%) + demand (30%) + switch ease (20%)
    exp_factor = min(professional_data.years_experience / 5, 1.0)
    demand_factor = {
        "very_high": 1.0,
        "growing": 0.8,
        "stable": 0.6,
        "saturated": 0.35,
        "declining": 0.2,
    }.get(professional_data.market_demand_level, 0.6)
    switch_factor = {
        "same_field": 1.0,
        "adjacent_field": 0.7,
        "new_field": 0.45,
    }.get(professional_data.career_switch_type, 0.45)

    success_probability = (exp_factor * 0.5 + demand_factor * 0.3 + switch_factor * 0.2) * 100
    success_probability = max(5, min(95, success_probability))  # floor at 5%, cap at 95%

    # ── RISK CLASSIFICATION ──
    if professional_score < 35:
        risk_level = "High Professional Risk"
    elif professional_score < 60:
        risk_level = "Moderate Professional Risk"
    else:
        risk_level = "Low Professional Risk"

    return {
        "success_probability_percent": round(success_probability, 2),
        "professional_risk_level": risk_level,
        "professional_score": round(professional_score, 2),
        "expected_months_before_income": professional_data.expected_months_before_income,
    }
