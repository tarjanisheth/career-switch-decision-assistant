def calculate_financial_metrics(financial_data):
    # ── CURRENT NET (while employed) ──
    monthly_net_current = (
        financial_data.monthly_salary
        + financial_data.other_monthly_income
        - financial_data.monthly_expenses
        - financial_data.monthly_debt_payment
    )

    # ── POST-QUIT NET (salary gone, other income stays) ──
    post_quit_monthly_net = (
        financial_data.other_monthly_income
        - financial_data.monthly_expenses
        - financial_data.monthly_debt_payment
    )

    # ── COST OF LIVING MULTIPLIER ──
    # Adjusts burn rate upward for higher cost cities (Mumbai/Delhi vs tier-2)
    cost_multiplier = {
        "low": 1.0,
        "medium": 1.2,
        "high": 1.5
    }.get(financial_data.cost_of_living_level, 1.2)

    # ── MONTHLY BURN RATE ──
    # Only applies if post-quit net is negative (spending > passive income)
    if post_quit_monthly_net < 0:
        monthly_burn = abs(post_quit_monthly_net) * cost_multiplier
    else:
        # Passive income covers expenses — no burn
        monthly_burn = 0

    # ── RAW RUNWAY ──
    if monthly_burn > 0:
        raw_runway = financial_data.current_savings / monthly_burn
    else:
        raw_runway = float("inf")

    # ── DEPENDENT PENALTY ──
    # Each dependent reduces effective runway by 1 month (safety buffer for family obligations)
    dependent_penalty = financial_data.dependents_count * 1.0
    adjusted_runway = max(0, raw_runway - dependent_penalty) if raw_runway != float("inf") else float("inf")

    # ── FINANCIAL SCORE (0–100) ──
    # Granular scoring based on adjusted runway
    if adjusted_runway == float("inf"):
        financial_score = 95
        risk_level = "Very Safe"
    elif adjusted_runway >= 12:
        financial_score = 90
        risk_level = "Low Risk"
    elif adjusted_runway >= 9:
        financial_score = 78
        risk_level = "Low Risk"
    elif adjusted_runway >= 6:
        financial_score = 65
        risk_level = "Low Risk"
    elif adjusted_runway >= 4:
        financial_score = 48
        risk_level = "Moderate Risk"
    elif adjusted_runway >= 2:
        financial_score = 28
        risk_level = "High Risk"
    else:
        financial_score = 12
        risk_level = "High Risk"

    return {
        "monthly_net_current": round(monthly_net_current, 2),
        "monthly_net_after_quit": round(post_quit_monthly_net, 2),
        "runway_months": round(adjusted_runway, 1) if adjusted_runway != float("inf") else "Infinite",
        "financial_risk_level": risk_level,
        "financial_score": financial_score,
        # Raw values used by monte carlo and decision model
        "raw_monthly_net_after_quit": post_quit_monthly_net,
        "raw_runway_months": adjusted_runway,
        "raw_monthly_burn": monthly_burn,
        "dependents_count": financial_data.dependents_count,
        "dependent_penalty_months": dependent_penalty,
    }
