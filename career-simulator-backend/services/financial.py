def calculate_financial_metrics(financial_data):
    # Monthly net burn
    monthly_net = (
        financial_data.monthly_salary
        + financial_data.other_monthly_income
        - financial_data.monthly_expenses
        - financial_data.monthly_debt_payment
    )

    # If quitting job, salary becomes 0
    post_quit_monthly_net = (
        financial_data.other_monthly_income
        - financial_data.monthly_expenses
        - financial_data.monthly_debt_payment
    )

    # Financial runway
    if post_quit_monthly_net < 0:
        runway_months = financial_data.current_savings / abs(post_quit_monthly_net)
    else:
        runway_months = float("inf")

    # Risk Level Classification + Score
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
        "runway_months": round(runway_months, 2) if runway_months != float("inf") else "Infinite",
        "financial_risk_level": risk_level,
        "financial_score": financial_score,

        # 🔥 THESE ARE REQUIRED FOR MONTE CARLO
        "raw_monthly_net_after_quit": post_quit_monthly_net,
        "raw_runway_months": runway_months,
    }
