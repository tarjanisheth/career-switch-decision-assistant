import React, { useState } from "react";
import "./App.css";

function App() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [financial, setFinancial] = useState({
    monthly_salary: "",
    monthly_expenses: "",
    current_savings: "",
    emergency_fund: "",
    expected_salary_after_switch: "",
  });

  const [professional, setProfessional] = useState({
    job_satisfaction: 5,
    career_growth: 5,
    market_demand: 5,
    career_switch_readiness: 5,
  });

  const [personal, setPersonal] = useState({
    risk_tolerance: 5,
    burnout_level: 5,
    emotional_resilience: 5,
  });

  const handleFinancialChange = (e) => {
    setFinancial({
      ...financial,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfessionalChange = (e) => {
    setProfessional({
      ...professional,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handlePersonalChange = (e) => {
    setPersonal({
      ...personal,
      [e.target.name]: Number(e.target.value),
    });
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const response = await fetch(
        "https://career-simulator-backend.onrender.com/simulate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            financial: {
              monthly_salary: Number(financial.monthly_salary),
              monthly_expenses: Number(financial.monthly_expenses),
              current_savings: Number(financial.current_savings),
              emergency_fund: Number(financial.emergency_fund),
              expected_salary_after_switch: Number(
                financial.expected_salary_after_switch
              ),
            },
            professional,
            personal,
          }),
        }
      );

      const data = await response.json();
      setResult(data);
      setStep(4);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while analyzing.");
    } finally {
      setLoading(false);
    }
  };

  const renderFinancialStep = () => (
    <div className="card">
      <h2>Step 1: Financial Situation</h2>

      <input
        type="number"
        name="monthly_salary"
        placeholder="Monthly Salary"
        value={financial.monthly_salary}
        onChange={handleFinancialChange}
      />

      <input
        type="number"
        name="monthly_expenses"
        placeholder="Monthly Expenses"
        value={financial.monthly_expenses}
        onChange={handleFinancialChange}
      />

      <input
        type="number"
        name="current_savings"
        placeholder="Current Savings"
        value={financial.current_savings}
        onChange={handleFinancialChange}
      />

      <input
        type="number"
        name="emergency_fund"
        placeholder="Emergency Fund"
        value={financial.emergency_fund}
        onChange={handleFinancialChange}
      />

      <input
        type="number"
        name="expected_salary_after_switch"
        placeholder="Expected Salary After Switch"
        value={financial.expected_salary_after_switch}
        onChange={handleFinancialChange}
      />

      <button onClick={() => setStep(2)}>Next</button>
    </div>
  );

  const renderProfessionalStep = () => (
    <div className="card">
      <h2>Step 2: Professional Readiness</h2>

      <label>Job Satisfaction: {professional.job_satisfaction}</label>
      <input
        type="range"
        min="1"
        max="10"
        name="job_satisfaction"
        value={professional.job_satisfaction}
        onChange={handleProfessionalChange}
      />

      <label>Career Growth: {professional.career_growth}</label>
      <input
        type="range"
        min="1"
        max="10"
        name="career_growth"
        value={professional.career_growth}
        onChange={handleProfessionalChange}
      />

      <label>Market Demand: {professional.market_demand}</label>
      <input
        type="range"
        min="1"
        max="10"
        name="market_demand"
        value={professional.market_demand}
        onChange={handleProfessionalChange}
      />

      <label>
        Career Switch Readiness: {professional.career_switch_readiness}
      </label>
      <input
        type="range"
        min="1"
        max="10"
        name="career_switch_readiness"
        value={professional.career_switch_readiness}
        onChange={handleProfessionalChange}
      />

      <button onClick={() => setStep(3)}>Next</button>
    </div>
  );

  const renderPersonalStep = () => (
    <div className="card">
      <h2>Step 3: Personal Readiness</h2>

      <label>Risk Tolerance: {personal.risk_tolerance}</label>
      <input
        type="range"
        min="1"
        max="10"
        name="risk_tolerance"
        value={personal.risk_tolerance}
        onChange={handlePersonalChange}
      />

      <label>Burnout Level: {personal.burnout_level}</label>
      <input
        type="range"
        min="1"
        max="10"
        name="burnout_level"
        value={personal.burnout_level}
        onChange={handlePersonalChange}
      />

      <label>Emotional Resilience: {personal.emotional_resilience}</label>
      <input
        type="range"
        min="1"
        max="10"
        name="emotional_resilience"
        value={personal.emotional_resilience}
        onChange={handlePersonalChange}
      />

      <button onClick={handleSubmit}>
        {loading ? "Analyzing..." : "Analyze Decision"}
      </button>
    </div>
  );

  const renderResultStep = () => {
    const decision = result?.decision_summary;

    return (
      <div className="card result-card">
        <h1>{decision.recommendation}</h1>

        <p>{decision.summary}</p>

        <div className="metrics">
          <div className="metric-box">
            <h3>Confidence</h3>
            <p>{decision.confidence}%</p>
          </div>

          <div className="metric-box">
            <h3>Average Risk</h3>
            <p>{decision.average_risk_score}</p>
          </div>
        </div>

        <div className="section">
          <h2>Top Risk Factors</h2>
          <ul>
            {decision.top_risks.map((risk, index) => (
              <li key={index}>{risk}</li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h2>Recommended Action Plan</h2>
          <ul>
            {decision.action_plan.map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => {
            setStep(1);
            setResult(null);
          }}
        >
          Start New Analysis
        </button>
      </div>
    );
  };

  return (
    <div className="app">
      <h1>Career Switch Decision Assistant</h1>
      <p>
        This tool helps evaluate whether quitting your job for a career switch
        is a practical decision.
      </p>

      {step === 1 && renderFinancialStep()}
      {step === 2 && renderProfessionalStep()}
      {step === 3 && renderPersonalStep()}
      {step === 4 && renderResultStep()}
    </div>
  );
}

export default App;