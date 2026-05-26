import { useState } from "react";
import "./App.css";

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

// No currency formatting needed

function App() {
  const [step, setStep] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(initialFormData);
  const [activePathTab, setActivePathTab] = useState("bridge");

  const handleChange = (section, field, value) => {
    const numericFields = [
      "monthly_salary", "monthly_expenses", "current_savings",
      "other_monthly_income", "monthly_debt_payment",
      "dependents_count", "years_experience",
      "expected_months_before_income",
    ];
    if (numericFields.includes(field) && Number(value) < 0) return;

    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const validateStep1 = () => {
    const f = formData.financial;
    if (
      f.monthly_salary === "" || f.monthly_expenses === "" ||
      f.current_savings === "" || f.other_monthly_income === "" ||
      f.monthly_debt_payment === "" || f.dependents_count === "" ||
      !f.cost_of_living_level
    ) {
      setErrors({ step1: "All financial fields are required." });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const p = formData.professional;
    if (
      p.years_experience === "" || !p.market_demand_level ||
      p.expected_months_before_income === "" || !p.career_switch_type
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
      const baseUrl = import.meta.env.VITE_API_URL || "/api";
      const response = await fetch(`${baseUrl}/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
            expected_months_before_income: Number(formData.professional.expected_months_before_income),
            career_switch_type: formData.professional.career_switch_type,
          },
          personal: {
            risk_tolerance_score: Number(formData.personal.risk_tolerance_score),
            burnout_level: Number(formData.personal.burnout_level),
            emotional_resilience_score: Number(formData.personal.emotional_resilience_score),
            family_support_level: formData.personal.family_support_level,
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error("API error:", JSON.stringify(errData, null, 2));
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setStep(4);
    } catch (error) {
      console.error(error);
      setErrors({ step3: "Something went wrong while analysing. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const resetApp = () => {
    setStep(1);
    setResult(null);
    setErrors({});
    setFormData(initialFormData);
    setActivePathTab("bridge");
  };

  const riskColor = (level) => {
    if (!level) return "#a78bfa";
    const l = level.toLowerCase();
    if (l.includes("low") || l.includes("very safe") || l.includes("high stability")) return "#10b981";
    if (l.includes("moderate") || l.includes("medium")) return "#f59e0b";
    if (l.includes("high") || l.includes("critical") || l.includes("fragile")) return "#ef4444";
    return "#a78bfa";
  };

  return (
    <div className="container">
      <h1 className="main-title">Career Switch Decision Assistant</h1>
      <p className="subtitle">
        Find out whether quitting your job for a career switch is realistically safe — based on your actual numbers.
      </p>

      {/* ── STEP INDICATOR ── */}
      {step < 4 && (
        <div className="step-indicator">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`step-dot ${step === s ? "active" : step > s ? "done" : ""}`}>
              {step > s ? "✓" : s}
            </div>
          ))}
        </div>
      )}

      {/* ── STEP 1: FINANCIAL ── */}
      {step === 1 && (
        <div className="card">
          <h2>Step 1: Financial Situation</h2>

          <input id="monthly_salary" type="number" min="0"
            placeholder="Monthly Salary"
            value={formData.financial.monthly_salary}
            onChange={(e) => handleChange("financial", "monthly_salary", e.target.value)}
          />
          <input id="monthly_expenses" type="number" min="0"
            placeholder="Monthly Expenses"
            value={formData.financial.monthly_expenses}
            onChange={(e) => handleChange("financial", "monthly_expenses", e.target.value)}
          />
          <input id="current_savings" type="number" min="0"
            placeholder="Current Savings"
            value={formData.financial.current_savings}
            onChange={(e) => handleChange("financial", "current_savings", e.target.value)}
          />
          <input id="other_monthly_income" type="number" min="0"
            placeholder="Other Monthly Income — rent, freelance, etc."
            value={formData.financial.other_monthly_income}
            onChange={(e) => handleChange("financial", "other_monthly_income", e.target.value)}
          />
          <input id="monthly_debt_payment" type="number" min="0"
            placeholder="Monthly EMI / Debt Payment"
            value={formData.financial.monthly_debt_payment}
            onChange={(e) => handleChange("financial", "monthly_debt_payment", e.target.value)}
          />
          <input id="dependents_count" type="number" min="0"
            placeholder="Number of Dependents (spouse, parents, kids)"
            value={formData.financial.dependents_count}
            onChange={(e) => handleChange("financial", "dependents_count", e.target.value)}
          />

          <div className="select-wrapper">
            <select id="cost_of_living_level"
              value={formData.financial.cost_of_living_level}
              onChange={(e) => handleChange("financial", "cost_of_living_level", e.target.value)}
            >
              <option value="">Select City Cost of Living</option>
              <option value="low">Low — Tier 2/3 city</option>
              <option value="medium">Medium — Mid-size metro</option>
              <option value="high">High — Mumbai, Delhi, Bengaluru</option>
            </select>
          </div>

          {errors.step1 && <p className="error">{errors.step1}</p>}

          <button id="step1-next" onClick={() => { if (validateStep1()) { setErrors({}); setStep(2); } }}>
            Next →
          </button>
        </div>
      )}

      {/* ── STEP 2: PROFESSIONAL ── */}
      {step === 2 && (
        <div className="card">
          <h2>Step 2: Career Reality Check</h2>

          <input id="years_experience" type="number" min="0"
            placeholder="Years of Experience in the New Field"
            value={formData.professional.years_experience}
            onChange={(e) => handleChange("professional", "years_experience", e.target.value)}
          />

          <div className="select-wrapper">
            <select id="market_demand_level"
              value={formData.professional.market_demand_level}
              onChange={(e) => handleChange("professional", "market_demand_level", e.target.value)}
            >
              <option value="">Market Demand for the New Field</option>
              <option value="very_high">Very High — lots of open roles</option>
              <option value="growing">Growing — demand is increasing</option>
              <option value="stable">Stable — steady but competitive</option>
              <option value="saturated">Saturated — too many candidates</option>
              <option value="declining">Declining — shrinking market</option>
            </select>
          </div>

          <input id="expected_months_before_income" type="number" min="0"
            placeholder="How many months until your first income?"
            value={formData.professional.expected_months_before_income}
            onChange={(e) => handleChange("professional", "expected_months_before_income", e.target.value)}
          />

          <div className="select-wrapper">
            <select id="career_switch_type"
              value={formData.professional.career_switch_type}
              onChange={(e) => handleChange("professional", "career_switch_type", e.target.value)}
            >
              <option value="">Type of Career Switch</option>
              <option value="same_field">Same Field — same industry, different role</option>
              <option value="adjacent_field">Adjacent Field — related skills, new domain</option>
              <option value="new_field">New Field — completely different career</option>
            </select>
          </div>

          {errors.step2 && <p className="error">{errors.step2}</p>}

          <div className="btn-row">
            <button id="step2-back" className="btn-secondary" onClick={() => { setErrors({}); setStep(1); }}>
              ← Back
            </button>
            <button id="step2-next" onClick={() => { if (validateStep2()) { setErrors({}); setStep(3); } }}>
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 3: PERSONAL ── */}
      {step === 3 && (
        <div className="card">
          <h2>Step 3: Personal Readiness</h2>

          <div className="slider-group">
            <label>
              Risk Tolerance
              <span className="slider-val">{formData.personal.risk_tolerance_score}</span>
            </label>
            <input id="risk_tolerance_score" type="range" min="1" max="10"
              value={formData.personal.risk_tolerance_score}
              onChange={(e) => handleChange("personal", "risk_tolerance_score", e.target.value)}
            />
            <div className="slider-labels"><span>Very cautious</span><span>Comfortable with risk</span></div>
          </div>

          <div className="slider-group">
            <label>
              Burnout Level
              <span className="slider-val">{formData.personal.burnout_level}</span>
            </label>
            <input id="burnout_level" type="range" min="1" max="10"
              value={formData.personal.burnout_level}
              onChange={(e) => handleChange("personal", "burnout_level", e.target.value)}
            />
            <div className="slider-labels"><span>Doing fine</span><span>Completely drained</span></div>
          </div>

          <div className="slider-group">
            <label>
              Emotional Resilience
              <span className="slider-val">{formData.personal.emotional_resilience_score}</span>
            </label>
            <input id="emotional_resilience_score" type="range" min="1" max="10"
              value={formData.personal.emotional_resilience_score}
              onChange={(e) => handleChange("personal", "emotional_resilience_score", e.target.value)}
            />
            <div className="slider-labels"><span>Easily overwhelmed</span><span>Handles pressure well</span></div>
          </div>

          <div className="select-wrapper">
            <select id="family_support_level"
              value={formData.personal.family_support_level}
              onChange={(e) => handleChange("personal", "family_support_level", e.target.value)}
            >
              <option value="">Family Support During the Switch</option>
              <option value="none">None — on my own</option>
              <option value="partial">Partial — some understanding</option>
              <option value="strong">Strong — fully supportive</option>
            </select>
          </div>

          {errors.step3 && <p className="error">{errors.step3}</p>}

          <div className="btn-row">
            <button id="step3-back" className="btn-secondary" onClick={() => { setErrors({}); setStep(2); }}>
              ← Back
            </button>
            <button id="analyze-btn"
              onClick={() => { if (validateStep3()) runSimulation(); }}
              disabled={loading}
            >
              {loading ? "Analysing…" : "Analyse My Career Switch"}
            </button>
          </div>
        </div>
      )}

      {/* ── STEP 4: RESULTS ── */}
      {step === 4 && result && (() => {
        if (result.error) {
          return (
            <div className="result-wrapper">
              <div className="card error-card">
                <h2>⚠️ Analysis Error</h2>
                <p className="subtitle" style={{ color: "#ef4444", marginBottom: "20px" }}>
                  Something went wrong during the calculations:
                </p>
                <div className="error" style={{ textAlign: "center", marginBottom: "24px" }}>
                  {result.error}
                </div>
                <button className="start-over" onClick={resetApp}>Go Back & Try Again</button>
              </div>
            </div>
          );
        }

        const decision = result.decision_summary || {};
        const financial = result.financial_analysis || {};
        const professional = result.professional_analysis || {};
        const personal = result.personal_analysis || {};
        const mc = result.monte_carlo_simulation || null;
        const paths = decision.paths || [];

        return (
          <div className="result-wrapper">

            {/* ── SITUATION CARD ── */}
            <div className="result-recommendation card-archetype">
              <div className="rec-label">Your Situation</div>
              <h2 className="rec-text">{decision.archetype || "Career Transition"}</h2>
              <p className="rec-summary">{decision.archetype_description}</p>
              <div className="recommended-badge">
                Recommended approach: <strong>{decision.recommended_strategy}</strong>
              </div>
            </div>

            {/* ── READINESS SNAPSHOT ── */}
            <div className="snapshot-row">
              <div className="snapshot-card" style={{ borderTop: `4px solid ${riskColor(financial.financial_risk_level)}` }}>
                <div className="snapshot-label">Financial Safety</div>
                <div className="snapshot-value" style={{ color: riskColor(financial.financial_risk_level) }}>
                  {financial.financial_risk_level || "—"}
                </div>
                <div className="snapshot-detail">
                  {financial.runway_months != null
                    ? `${financial.runway_months}${typeof financial.runway_months === "number" ? " months runway" : " runway"}`
                    : "—"}
                </div>
              </div>

              <div className="snapshot-card" style={{ borderTop: `4px solid ${riskColor(professional.professional_risk_level)}` }}>
                <div className="snapshot-label">Professional Readiness</div>
                <div className="snapshot-value" style={{ color: riskColor(professional.professional_risk_level) }}>
                  {professional.professional_risk_level || "—"}
                </div>
                <div className="snapshot-detail">
                  {professional.success_probability_percent != null
                    ? `${professional.success_probability_percent}% job search success probability`
                    : "—"}
                </div>
              </div>

              <div className="snapshot-card" style={{ borderTop: `4px solid ${riskColor(personal.personal_risk_profile)}` }}>
                <div className="snapshot-label">Personal Stability</div>
                <div className="snapshot-value" style={{ color: riskColor(personal.personal_risk_profile) }}>
                  {personal.personal_risk_profile || "—"}
                </div>
                <div className="snapshot-detail">
                  {personal.personal_stability_score != null
                    ? `Stability score: ${personal.personal_stability_score}/100`
                    : "—"}
                </div>
              </div>
            </div>

            {/* ── MONTE CARLO ── */}
            {mc && (
              <div className="result-section mc-section">
                <h3>What Happens Across 1,000 Simulated Transitions?</h3>
                <p className="mc-intro">
                  We ran 1,000 versions of your career switch — each with a slightly different job search timeline
                  and monthly spending. Here is what the numbers say:
                </p>

                <div className="mc-verdict-box">{mc.plain_verdict}</div>

                <div className="mc-grid">
                  <div className="mc-card">
                    <h4>Landed a job in time</h4>
                    <p className="mc-value" style={{ color: "#7c3aed" }}>{mc.success_rate_percent}%</p>
                    <p className="mc-desc">of simulations ended with income secured before savings ran out</p>
                  </div>
                  <div className="mc-card">
                    <h4>Stayed financially safe</h4>
                    <p className="mc-value" style={{ color: "#10b981" }}>{mc.survival_without_collapse_percent}%</p>
                    <p className="mc-desc">made it through the search period without running out of money</p>
                  </div>
                  <div className="mc-card">
                    <h4>Ran out of money</h4>
                    <p className="mc-value" style={{ color: "#ef4444" }}>{mc.financial_collapse_risk_percent}%</p>
                    <p className="mc-desc">of simulations ended with savings completely depleted</p>
                  </div>
                </div>

                {mc.avg_months_to_land_job && (
                  <p className="mc-landing-note">
                    In simulations where a job was found, it took an average of{" "}
                    <strong>{mc.avg_months_to_land_job} month{mc.avg_months_to_land_job !== 1 ? "s" : ""}</strong> to land it.
                  </p>
                )}
              </div>
            )}

            {/* ── PATH COMPARISON ── */}
            <div className="path-selector-section">
              <h3 className="section-heading">Compare Your Three Paths</h3>
              <p className="section-sub">
                Each path is a different way to approach the switch. Pick one to see the full breakdown.
              </p>

              <div className="path-tabs">
                {paths.map((p) => (
                  <button
                    key={p.id}
                    className={`path-tab-btn ${activePathTab === p.id ? "active" : ""}`}
                    onClick={() => setActivePathTab(p.id)}
                  >
                    <span className="tab-name">{p.name.split(":")[0]}</span>
                    <span className="tab-title">{p.name.split(":")[1]?.trim()}</span>
                  </button>
                ))}
              </div>

              {(() => {
                const currentPath = paths.find((p) => p.id === activePathTab) || paths[0] || {};
                return (
                  <div className="selected-path-card">
                    <div className="path-header">
                      <h3>{currentPath.name}</h3>
                      <p className="path-tagline">"{currentPath.tagline}"</p>
                      <div className="path-badges">
                        <span className={`path-badge-item risk ${currentPath.risk?.toLowerCase().replace(/[^a-z]/g, "")}`}>
                          Risk: {currentPath.risk}
                        </span>
                        <span className="path-badge-item stress">
                          Stress: {currentPath.stress}
                        </span>
                      </div>
                    </div>

                    <div className="path-body">
                      <p className="path-narrative">{currentPath.narrative}</p>

                      <div className="path-steps">
                        <h4>📍 Action Steps</h4>
                        <ol>
                          {currentPath.steps?.map((s, idx) => <li key={idx}>{s}</li>)}
                        </ol>
                      </div>

                      <div className="path-pro-con-grid">
                        <div className="pro-list">
                          <h4>🟢 Pros</h4>
                          <ul>{currentPath.pros?.map((pro, idx) => <li key={idx}>{pro}</li>)}</ul>
                        </div>
                        <div className="con-list">
                          <h4>🔴 Cons</h4>
                          <ul>{currentPath.cons?.map((con, idx) => <li key={idx}>{con}</li>)}</ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <button id="start-over-btn" className="start-over" onClick={resetApp}>
              Start New Analysis
            </button>
          </div>
        );
      })()}
    </div>
  );
}

export default App;
