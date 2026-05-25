import { useState } from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

const initialFormData = {
  financial: {
    monthly_salary: "",
    monthly_expenses: "",
    current_savings: "",
    other_monthly_income: "",
    monthly_debt_payment: "",
    dependents_count: "",
    cost_of_living_level: "",
  },
  professional: {
    years_experience: "",
    market_demand_level: "",
    expected_months_before_income: "",
    career_switch_type: "",
  },
  personal: {
    risk_tolerance_score: 5,
    burnout_level: 5,
    emotional_resilience_score: 5,
    family_support_level: "",
  },
};

function App() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (section, field, value) => {
    if (
      ["monthly_salary", "monthly_expenses", "current_savings",
       "other_monthly_income", "monthly_debt_payment",
       "dependents_count", "years_experience",
       "expected_months_before_income"].includes(field)
    ) {
      if (value < 0) return;
    }

    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const validateStep1 = () => {
    const {
      monthly_salary,
      monthly_expenses,
      current_savings,
      other_monthly_income,
      monthly_debt_payment,
      dependents_count,
      cost_of_living_level,
    } = formData.financial;

    if (
      monthly_salary === "" ||
      monthly_expenses === "" ||
      current_savings === "" ||
      other_monthly_income === "" ||
      monthly_debt_payment === "" ||
      dependents_count === "" ||
      !cost_of_living_level
    ) {
      setErrors({ step1: "All financial fields are required." });
      return false;
    }

    return true;
  };

  const validateStep2 = () => {
    const {
      years_experience,
      market_demand_level,
      expected_months_before_income,
      career_switch_type,
    } = formData.professional;

    if (
      !years_experience ||
      !market_demand_level ||
      !expected_months_before_income ||
      !career_switch_type
    ) {
      setErrors({ step2: "All professional fields are required." });
      return false;
    }

    return true;
  };

  const validateStep3 = () => {
    if (!formData.personal.family_support_level) {
      setErrors({ step3: "Please select family support level." });
      return false;
    }

    return true;
  };

  const runSimulation = async () => {
    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/simulate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            financial: {
              monthly_salary: Number(formData.financial.monthly_salary),
              monthly_expenses: Number(formData.financial.monthly_expenses),
              current_savings: Number(formData.financial.current_savings),
              other_monthly_income: Number(formData.financial.other_monthly_income),
              monthly_debt_payment: Number(formData.financial.monthly_debt_payment),
              dependents_count: Number(formData.financial.dependents_count),
              cost_of_living_level: formData.financial.cost_of_living_level,
            },
            professional: {
              years_experience: Number(formData.professional.years_experience),
              market_demand_level: formData.professional.market_demand_level,
              expected_months_before_income: Number(
                formData.professional.expected_months_before_income
              ),
              career_switch_type: formData.professional.career_switch_type,
            },
            personal: {
              risk_tolerance_score: Number(formData.personal.risk_tolerance_score),
              burnout_level: Number(formData.personal.burnout_level),
              emotional_resilience_score: Number(
                formData.personal.emotional_resilience_score
              ),
              family_support_level: formData.personal.family_support_level,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Simulation failed");
      }

      const data = await response.json();
      setResult(data);
      setStep(4);
    } catch (error) {
      setErrors({
        step3: "Something went wrong while analyzing. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetApp = () => {
    setStep(1);
    setResult(null);
    setErrors({});
    setFormData(initialFormData);
  };

  return (
    <div className="container">
      <h1 className="main-title">Career Switch Decision Assistant</h1>
      <p className="subtitle">
        Evaluate whether quitting your current job for a career switch is realistically safe.
      </p>

      {step === 1 && (
        <div className="card">
          <h2>Step 1: Financial Situation</h2>

          <input
            type="number"
            min="0"
            placeholder="Monthly Salary"
            value={formData.financial.monthly_salary}
            onChange={(e) =>
              handleChange("financial", "monthly_salary", e.target.value)
            }
          />

          <input
            type="number"
            min="0"
            placeholder="Monthly Expenses"
            value={formData.financial.monthly_expenses}
            onChange={(e) =>
              handleChange("financial", "monthly_expenses", e.target.value)
            }
          />

          <input
            type="number"
            min="0"
            placeholder="Current Savings"
            value={formData.financial.current_savings}
            onChange={(e) =>
              handleChange("financial", "current_savings", e.target.value)
            }
          />

          <input
            type="number"
            min="0"
            placeholder="Other Monthly Income"
            value={formData.financial.other_monthly_income}
            onChange={(e) =>
              handleChange("financial", "other_monthly_income", e.target.value)
            }
          />

          <input
            type="number"
            min="0"
            placeholder="Monthly Debt Payment"
            value={formData.financial.monthly_debt_payment}
            onChange={(e) =>
              handleChange("financial", "monthly_debt_payment", e.target.value)
            }
          />

          <input
            type="number"
            min="0"
            placeholder="Number of Dependents"
            value={formData.financial.dependents_count}
            onChange={(e) =>
              handleChange("financial", "dependents_count", e.target.value)
            }
          />

          <div className="select-wrapper">
            <select
              value={formData.financial.cost_of_living_level}
              onChange={(e) =>
                handleChange("financial", "cost_of_living_level", e.target.value)
              }
            >
              <option value="">Select Cost of Living</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {errors.step1 && <p className="error">{errors.step1}</p>}

          <button
            onClick={() => {
              if (validateStep1()) {
                setErrors({});
                setStep(2);
              }
            }}
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="card">
          <h2>Step 2: Career Reality Check</h2>

          <input
            type="number"
            min="0"
            placeholder="Years Experience in New Field"
            value={formData.professional.years_experience}
            onChange={(e) =>
              handleChange("professional", "years_experience", e.target.value)
            }
          />

          <div className="select-wrapper">
            <select
              value={formData.professional.market_demand_level}
              onChange={(e) =>
                handleChange("professional", "market_demand_level", e.target.value)
              }
            >
              <option value="">Select Market Demand</option>
              <option value="very_high">Very High Demand</option>
              <option value="growing">Growing</option>
              <option value="stable">Stable</option>
              <option value="saturated">Saturated</option>
              <option value="declining">Declining</option>
            </select>
          </div>

          <input
            type="number"
            min="0"
            placeholder="Months Before Income"
            value={formData.professional.expected_months_before_income}
            onChange={(e) =>
              handleChange(
                "professional",
                "expected_months_before_income",
                e.target.value
              )
            }
          />

          <div className="select-wrapper">
            <select
              value={formData.professional.career_switch_type}
              onChange={(e) =>
                handleChange("professional", "career_switch_type", e.target.value)
              }
            >
              <option value="">Select Switch Type</option>
              <option value="same_field">Same Field</option>
              <option value="adjacent_field">Adjacent Field</option>
              <option value="new_field">New Field</option>
            </select>
          </div>

          {errors.step2 && <p className="error">{errors.step2}</p>}

          <button
            onClick={() => {
              if (validateStep2()) {
                setErrors({});
                setStep(3);
              }
            }}
          >
            Next
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="card">
          <h2>Step 3: Personal Readiness</h2>

          <label>Risk Tolerance: {formData.personal.risk_tolerance_score}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.personal.risk_tolerance_score}
            onChange={(e) =>
              handleChange("personal", "risk_tolerance_score", e.target.value)
            }
          />

          <label>Burnout Level: {formData.personal.burnout_level}</label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.personal.burnout_level}
            onChange={(e) =>
              handleChange("personal", "burnout_level", e.target.value)
            }
          />

          <label>
            Emotional Resilience: {formData.personal.emotional_resilience_score}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.personal.emotional_resilience_score}
            onChange={(e) =>
              handleChange(
                "personal",
                "emotional_resilience_score",
                e.target.value
              )
            }
          />

          <div className="select-wrapper">
            <select
              value={formData.personal.family_support_level}
              onChange={(e) =>
                handleChange("personal", "family_support_level", e.target.value)
              }
            >
              <option value="">Select Family Support</option>
              <option value="none">None</option>
              <option value="partial">Partial</option>
              <option value="strong">Strong</option>
            </select>
          </div>

          {errors.step3 && <p className="error">{errors.step3}</p>}

          <button
            onClick={() => {
              if (validateStep3()) {
                runSimulation();
              }
            }}
          >
            {loading ? "Analyzing..." : "Analyze My Career Switch"}
          </button>
        </div>
      )}

      {step === 4 && result && (
        <div className="result-wrapper">
          <div className="graph-container">
            <ReactFlow
              nodes={[
                {
                  id: "start",
                  position: { x: 250, y: 0 },
                  data: { label: "IF YOU QUIT TODAY" },
                  style: {
                    padding: 20,
                    borderRadius: 16,
                    background: "#7c3aed",
                    color: "white",
                    fontWeight: 600,
                    width: 260,
                    textAlign: "center",
                  },
                },
                {
                  id: "financial",
                  position: { x: 0, y: 150 },
                  data: {
                    label: result.financial_analysis?.financial_risk_level,
                  },
                  style: {
                    padding: 20,
                    borderRadius: 16,
                    background: "#ede9fe",
                    width: 260,
                    textAlign: "center",
                  },
                },
                {
                  id: "professional",
                  position: { x: 250, y: 150 },
                  data: {
                    label: result.professional_analysis?.professional_risk_level,
                  },
                  style: {
                    padding: 20,
                    borderRadius: 16,
                    background: "#ddd6fe",
                    width: 260,
                    textAlign: "center",
                  },
                },
                {
                  id: "personal",
                  position: { x: 500, y: 150 },
                  data: {
                    label: result.personal_analysis?.personal_risk_profile,
                  },
                  style: {
                    padding: 20,
                    borderRadius: 16,
                    background: "#ede9fe",
                    width: 260,
                    textAlign: "center",
                  },
                },
                {
                  id: "final",
                  position: { x: 180, y: 320 },
                  data: {
                    label: result.decision_summary?.recommendation,
                  },
                  style: {
                    padding: 24,
                    borderRadius: 18,
                    background: "#a78bfa",
                    color: "#111827",
                    fontWeight: 600,
                    width: 600,
                    textAlign: "center",
                    lineHeight: "1.5",
                  },
                },
              ]}
              edges={[
                { id: "e1", source: "start", target: "financial" },
                { id: "e2", source: "start", target: "professional" },
                { id: "e3", source: "start", target: "personal" },
                { id: "e4", source: "financial", target: "final" },
                { id: "e5", source: "professional", target: "final" },
                { id: "e6", source: "personal", target: "final" },
              ]}
              fitView
            />
          </div>

          <button className="start-over" onClick={resetApp}>
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}

export default App;