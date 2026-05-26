import random


def run_monte_carlo(financial, professional, personal, iterations=1000):
    """
    Simulates 1,000 independent career transition scenarios.

    Each iteration models one possible version of the user's transition:
    - Job search length is randomised around the user's estimate (±50%)
    - Whether they actually land the job is probabilistic (based on professional score)
    - Monthly spending varies ±15% to simulate real-life variance
    - Savings deplete each month until income starts or money runs out

    Outputs three plain numbers + a one-sentence verdict.
    """

    success_prob = professional["success_probability_percent"] / 100
    expected_months = max(1, min(professional["expected_months_before_income"], 24))

    # Monthly burn: how much savings decrease each month after quitting
    monthly_burn = financial["raw_monthly_burn"]  # already adjusted for cost of living

    # Starting savings
    if monthly_burn > 0 and financial["raw_runway_months"] != float("inf"):
        # Reconstruct from adjusted runway × burn (avoids floating point drift)
        starting_savings = financial["raw_runway_months"] * monthly_burn
    else:
        # Passive income covers expenses — savings are untouched
        starting_savings = financial.get("current_savings", 999_999_999)

    success_count = 0    # landed job AND savings didn't run out first
    collapse_count = 0   # savings hit ₹0 before income arrived
    landing_months = []  # track when jobs were landed (for average)

    for _ in range(iterations):
        savings = starting_savings

        # Randomise actual job search duration around user's estimate
        low = max(1, round(expected_months * 0.5))
        high = min(24, round(expected_months * 1.5))
        if low == high:
            actual_search_months = low
        else:
            actual_search_months = random.randint(low, high)

        # Did this simulation result in a job offer?
        got_job = random.random() < success_prob

        collapsed = False
        income_started = False

        for month in range(1, actual_search_months + 1):
            if not income_started:
                # Spending varies ±15% each month (rent, food, transport fluctuations)
                variance = random.uniform(-0.15, 0.15)
                this_month_burn = monthly_burn * (1 + variance)
                savings -= this_month_burn

                if savings <= 0:
                    collapse_count += 1
                    collapsed = True
                    break

            # Job lands at the end of the search period
            if month == actual_search_months and got_job:
                income_started = True
                success_count += 1
                landing_months.append(month)
                break

    success_pct = round((success_count / iterations) * 100, 1)
    collapse_pct = round((collapse_count / iterations) * 100, 1)
    survival_pct = round(((iterations - collapse_count) / iterations) * 100, 1)
    avg_landing = round(sum(landing_months) / len(landing_months)) if landing_months else None

    # ── PLAIN VERDICT ──
    if monthly_burn == 0:
        verdict = (
            "Your passive income covers your expenses, so your savings are safe regardless of how long the search takes. "
            "The main risk here is professional — landing the job, not running out of money."
        )
    elif success_pct >= 70:
        verdict = (
            f"In {success_pct}% of simulations, you landed a job before your savings ran out. "
            "The odds are in your favour, but having a backup plan for month 3+ is still smart."
        )
    elif success_pct >= 40:
        verdict = (
            f"About {success_pct}% of simulations ended successfully. "
            "Your outcome is genuinely uncertain — it will depend on how aggressively you search and how quickly the market responds."
        )
    else:
        verdict = (
            f"Only {success_pct}% of simulations ended with income secured before savings ran out. "
            "Extending your runway by 2–3 months before quitting would significantly shift these odds."
        )

    return {
        "simulations_run": iterations,
        "success_rate_percent": success_pct,
        "financial_collapse_risk_percent": collapse_pct,
        "survival_without_collapse_percent": survival_pct,
        "avg_months_to_land_job": avg_landing,
        "plain_verdict": verdict,
    }
