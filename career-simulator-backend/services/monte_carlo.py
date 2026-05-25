import random


def run_monte_carlo(financial, professional, personal, iterations=1000):

    success_prob = professional["success_probability_percent"] / 100

    monthly_expense = (
        financial["raw_monthly_net_after_quit"]
    )

    initial_savings = (
        financial["raw_runway_months"]
    )

    # Convert runway back to approximate savings
    # runway = savings / monthly_burn
    # so savings = runway * monthly_burn
    if financial["raw_monthly_net_after_quit"] < 0 and financial["raw_runway_months"] != "Infinite":
        monthly_burn = abs(financial["raw_monthly_net_after_quit"])
        estimated_savings = financial["raw_runway_months"] * monthly_burn
    else:
        estimated_savings = 999999999

    success_count = 0
    collapse_count = 0
    survival_count = 0

    for _ in range(iterations):

        savings = estimated_savings
        income_started = False

        # Random month when income might begin
        income_start_month = random.randint(1, 12)

        for month in range(1, 13):

            # Deduct monthly burn if no income yet
            if not income_started:
                savings += financial["raw_monthly_net_after_quit"]

            # Check for success
            if month == income_start_month:
                if random.random() < success_prob:
                    income_started = True
                    success_count += 1

            # Financial collapse condition
            if savings <= 0:
                collapse_count += 1
                break

        if savings > 0:
            survival_count += 1

    return {
        "simulations_run": iterations,
        "success_rate_percent": round((success_count / iterations) * 100, 2),
        "financial_collapse_risk_percent": round((collapse_count / iterations) * 100, 2),
        "survival_without_collapse_percent": round((survival_count / iterations) * 100, 2)
    }
