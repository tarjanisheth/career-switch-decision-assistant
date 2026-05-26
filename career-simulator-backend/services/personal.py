def calculate_personal_metrics(personal_data):
    """
    Calculates personal stability score (0–100).

    Components (all inputs are 1–10 sliders):
    - Emotional resilience: positive factor (up to 30 pts)
    - Risk tolerance: positive factor (up to 20 pts)
    - Family support: fixed bonus/penalty
    - Burnout: negative factor — high burnout reduces stability
      (but also signals urgency to leave, so it's not purely bad)

    Score interpretation:
    0–35  → Emotionally Fragile (needs support before switching)
    36–65 → Moderate Stability (can switch with a plan)
    66–100 → High Stability (mentally ready)
    """

    # Resilience: 1–10 → 3–30 pts
    resilience_pts = personal_data.emotional_resilience_score * 3.0

    # Risk tolerance: 1–10 → 1–20 pts
    risk_pts = personal_data.risk_tolerance_score * 2.0

    # Family support: fixed adjustment
    support_pts = {
        "none": -15,
        "partial": 0,
        "strong": 15,
    }.get(personal_data.family_support_level, 0)

    # Burnout: 1–10 → reduces stability by 0–25 pts
    # High burnout (10) = -25 pts, low burnout (1) = -2.5 pts
    burnout_penalty = personal_data.burnout_level * 2.5

    raw_score = resilience_pts + risk_pts + support_pts - burnout_penalty

    # Normalize to 0–100
    # Theoretical max: 30 + 20 + 15 - 2.5 = 62.5
    # Theoretical min: 3 + 2 - 15 - 25 = -35
    # Map [-35, 62.5] → [0, 100]
    SCORE_MIN = -35
    SCORE_MAX = 62.5
    stability_score = ((raw_score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * 100
    stability_score = max(0, min(100, stability_score))

    if stability_score < 36:
        risk_level = "Emotionally Fragile"
    elif stability_score < 66:
        risk_level = "Moderate Stability"
    else:
        risk_level = "High Stability"

    return {
        "personal_stability_score": round(stability_score, 2),
        "personal_risk_profile": risk_level,
    }
