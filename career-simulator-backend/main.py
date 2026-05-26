from fastapi.middleware.cors import CORSMiddleware
from services.monte_carlo import run_monte_carlo
from services.scenario_engine import generate_scenarios
from services.decision_model import calculate_overall_decision_risk
from services.personal import calculate_personal_metrics
from services.financial import calculate_financial_metrics
from services.professional import calculate_professional_metrics
from fastapi import FastAPI
from models import SimulationInput

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://career-switch-decision-assistant.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Career Decision Simulator Backend Running"}

@app.post("/simulate")
def simulate(data: SimulationInput):
    import traceback
    try:
        financial_result = calculate_financial_metrics(data.financial)
        # Attach raw current_savings for monte carlo infinite-runway case
        financial_result["current_savings"] = data.financial.current_savings

        professional_result = calculate_professional_metrics(data.professional)
        personal_result = calculate_personal_metrics(data.personal)

        overall_result = calculate_overall_decision_risk(
            financial_result,
            professional_result,
            personal_result
        )

        scenarios = generate_scenarios(
            financial_result,
            professional_result,
            personal_result,
            overall_result
        )

        monte_carlo_result = run_monte_carlo(
            financial_result,
            professional_result,
            personal_result,
            iterations=1000
        )

        return {
            "financial_analysis": financial_result,
            "professional_analysis": professional_result,
            "personal_analysis": personal_result,
            "decision_summary": overall_result,
            "scenario_simulation": scenarios,
            "monte_carlo_simulation": monte_carlo_result
        }
    except Exception as e:
        traceback.print_exc()
        try:
            with open("backend_error.log", "w") as f:
                f.write(traceback.format_exc())
        except Exception:
            pass
        return {"error": str(e), "traceback": traceback.format_exc()}