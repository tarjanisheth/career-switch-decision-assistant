def calculate_financial_metrics(financial_data):
    monthly_net = (
        financial_data.monthly_salary
        + financial_data.other_monthly_income
        - financial_data.monthly_expenses
        - financial_data.monthly_debt_payment
    )

    post_quit_monthly_net = (
        financial_data.other_monthly_income
        - financial_data.monthly_expenses
        - financial_data.monthly_debt_payment
    )

    dependent_penalty = financial_data.dependents_count * 0.5

    cost_multiplier = {
        "low": 1,
        "medium": 1.2,
        "high": 1.5
    }

    adjusted_burn = abs(post_quit_monthly_net) * cost_multiplier.get(
        financial_data.cost_of_living_level, 1.2
    )

    if adjusted_burn > 0:
        runway_months = financial_data.current_savings / adjusted_burn
    else:
        runway_months = float("inf")

    runway_months = max(0, runway_months - dependent_penalty)

    if runway_months == float("inf"):
        risk_level = "Very Safe"
        financial_score = 95
    elif runway_months < 3:
        risk_level = "High Risk"
        financial_score = 20
    elif runway_months < 6:
        risk_level = "Moderate Risk"
        financial_score = 50
    else:
        risk_level = "Low Risk"
        financial_score = 80

    return {
        "monthly_net_current": monthly_net,
        "monthly_net_after_quit": post_quit_monthly_net,
        "runway_months": round(runway_months, 2)
        if runway_months != float("inf")
        else "Infinite",
        "financial_risk_level": risk_level,
        "financial_score": financial_score,
        "raw_monthly_net_after_quit": post_quit_monthly_net,
        "raw_runway_months": runway_months,
    }