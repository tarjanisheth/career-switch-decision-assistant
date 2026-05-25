def generate_scenarios(financial, professional, personal, overall):

    runway = financial["runway_months"]
    success_prob = professional["success_probability_percent"]
    stability = personal["personal_stability_score"]

    # --- SCENARIO PROBABILITY MODEL ---

    # Best case probability increases with success probability + stability
    best_case_prob = (success_prob * 0.6) + (stability * 0.4)

    # Worst case probability increases if financial risk is high
    if financial["financial_risk_level"] == "High Risk":
        worst_case_prob = 50
    elif financial["financial_risk_level"] == "Moderate Risk":
        worst_case_prob = 30
    else:
        worst_case_prob = 15

    # Realistic case fills the remaining probability
    realistic_case_prob = 100 - (best_case_prob * 0.5) - worst_case_prob

    # Normalize
    total = best_case_prob + realistic_case_prob + worst_case_prob
    best_case_prob = round((best_case_prob / total) * 100, 2)
    realistic_case_prob = round((realistic_case_prob / total) * 100, 2)
    worst_case_prob = round((worst_case_prob / total) * 100, 2)

    # --- TIMELINE SIMULATION ---

    timeline = {
        "3_months": {
            "financial_pressure": "High" if runway < 6 else "Manageable",
            "career_progress": "Uncertain"
        },
        "6_months": {
            "financial_pressure": "Critical" if runway < 6 else "Stable",
            "career_progress": "Improving" if success_prob > 60 else "Struggling"
        },
        "12_months": {
            "financial_status": "Recovered" if success_prob > 70 else "Dependent on savings",
            "career_direction": "Established" if success_prob > 70 else "Re-evaluation likely"
        }
    }

    return {
        "scenario_probabilities": {
            "best_case_percent": best_case_prob,
            "realistic_case_percent": realistic_case_prob,
            "worst_case_percent": worst_case_prob
        },
        "timeline_projection": timeline
    }
