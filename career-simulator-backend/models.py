from pydantic import BaseModel

class FinancialInput(BaseModel):
    monthly_salary: float
    monthly_expenses: float
    current_savings: float
    other_monthly_income: float
    monthly_debt_payment: float
    dependents_count: int
    cost_of_living_level: str  # low, medium, high


class ProfessionalInput(BaseModel):
    years_experience: float
    market_demand_level: str   # very_high, growing, stable, saturated, declining
    expected_months_before_income: float
    career_switch_type: str    # same_field, adjacent_field, new_field


class PersonalInput(BaseModel):
    risk_tolerance_score: int
    burnout_level: int
    emotional_resilience_score: int
    family_support_level: str  # none, partial, strong


class SimulationInput(BaseModel):
    financial: FinancialInput
    professional: ProfessionalInput
    personal: PersonalInput
