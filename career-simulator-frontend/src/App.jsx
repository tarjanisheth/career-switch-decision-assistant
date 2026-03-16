import { useState } from "react";
import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

function App() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    financial: {
      monthly_salary: "",
      monthly_expenses: "",
      current_savings: "",
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
    },
  });

  const handleChange = (section, field, value) => {
    if (value < 0) return; // prevent negative
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const validateStep1 = () => {
    const { monthly_salary, monthly_expenses, current_savings } =
      formData.financial;
    if (!monthly_salary || !monthly_expenses || !current_savings) {
      setErrors({ step1: "All fields are required." });
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
      setErrors({ step2: "All fields are required." });
      return false;
    }
    return true;
  };

  const runSimulation = async () => {
    setLoading(true);
    setErrors({});

    const response = await fetch("http://127.0.0.1:8000/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        financial: {
          monthly_salary: Number(formData.financial.monthly_salary),
          monthly_expenses: Number(formData.financial.monthly_expenses),
          current_savings: Number(formData.financial.current_savings),
          other_monthly_income: 0,
          monthly_debt_payment: 0,
          dependents_count: 0,
          cost_of_living_level: "medium",
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
          family_support_level: "partial",
        },
      }),
    });

    const data = await response.json();
    setResult(data);
    setLoading(false);
    setStep(4);
  };

  return (
    <div className="container">
      <h1 className="main-title">Career Switch Decision Assistant</h1>
      <p className="subtitle">
        This tool evaluates what could realistically happen if you quit your job.
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

          <button onClick={runSimulation}>
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
              label:
                result.financial_analysis?.runway_months === "Infinite"
                  ? "You are financially secure even after quitting."
                  : result.financial_analysis?.runway_months < 3
                  ? "Your financial runway is very short. Risk is high."
                  : result.financial_analysis?.runway_months < 6
                  ? "Your savings provide moderate safety. Caution advised."
                  : "You have reasonable financial buffer for transition.",
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
              label:
                result.professional_analysis?.success_probability_percent >= 70
                  ? "You are strongly positioned in this field."
                  : result.professional_analysis?.success_probability_percent >=
                    50
                  ? "Your positioning is moderate. Strategic planning required."
                  : "Your positioning is currently weak. Skill strengthening recommended.",
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
              label:
                result.personal_analysis?.personal_stability_score >= 60
                  ? "You appear emotionally prepared for change."
                  : result.personal_analysis?.personal_stability_score >= 30
                  ? "You have moderate emotional stability."
                  : "Your emotional readiness may need strengthening.",
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
  position: { x: 250, y: 320 },
  data: {
    label: (() => {
      const runway = result.financial_analysis?.runway_months;
      const success =
        result.professional_analysis?.success_probability_percent;
      const stability =
        result.personal_analysis?.personal_stability_score;

      const strongMoney = runway === "Infinite" || runway >= 6;
      const weakMoney = runway !== "Infinite" && runway < 3;

      const strongCareer = success >= 65;
      const weakCareer = success < 50;

      const strongMind = stability >= 60;
      const weakMind = stability < 40;

      // ✅ ALL STRONG
      if (strongMoney && strongCareer && strongMind) {
        return "You are financially stable, professionally prepared, and mentally ready. With proper planning, you can consider making this move.";
      }

      // ❗ MONEY PROBLEM
      if (weakMoney) {
        return "Your savings are too low right now. Focus on building at least 6 months of expenses before quitting.";
      }

      // ❗ CAREER PROBLEM
      if (weakCareer) {
        return "You need more experience or stronger skills in the new field before leaving your current job.";
      }

      // ❗ MENTAL READINESS PROBLEM
      if (weakMind) {
        return "You may not be emotionally ready for the uncertainty of a career change. Strengthen your confidence and stability first.";
      }

      // MIXED CASE
      return "Some areas look ready, but others need work. Improve the weaker areas before making a final decision.";
    })(),
  },
  style: {
    padding: 26,
    borderRadius: 18,
    background: "#a78bfa",
    color: "#111827",
    fontWeight: 600,
    width: 460,
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

    <button
      className="start-over"
      onClick={() => {
        setStep(1);
        setResult(null);
      }}
    >
      Start Over
    </button>
  </div>
)}
    </div>
  );
}

export default App;