# ReLoop — Every Product Deserves a Second Life

**HackOn with Amazon Season 6 | Second Life Commerce**

**ReLoop** keeps the digital twin of a product alive via phone-camera grading, routes items optimally, and creates a trusted P2P resale ecosystem.

## Problem Statement
Returns are a "data death" problem. When a customer opens a product, its digital identity dies. Amazon spends billions moving items to warehouses just to re-identify them. 

## Solution
ReLoop uses the customer's phone camera to grade items at their location, then routes each item directly to its optimal destination — so every item travels once.

## Architecture

ReLoop is built on a modern, decoupled, multi-layered architecture — designed for scale, AI-powered automation, and a seamless circular commerce experience.

![ReLoop Architecture Diagram](docs/architecture.png)


```mermaid
flowchart TB
    %% ─── CLIENT LAYER ───────────────────────────────────────────
    subgraph CL ["Client Layer"]
        direction LR
        CustApp["Customer App\nReact · Vite · Tailwind CSS\n─────────────────\n• Scan & upload product photos\n• View grading results\n• Browse marketplace\n• Manage ReLoop Credits"]
        AdminApp["Admin Dashboard\nReact · Vite · Tailwind CSS\n─────────────────\n• Monitor return flows\n• Approve/reject listings\n• Analytics & reporting"]
    end

    %% ─── API GATEWAY ─────────────────────────────────────────────
    subgraph GW ["API Gateway"]
        FastAPI["FastAPI\nPython 3.11\n─────────────────\n• JWT Auth & CORS\n• Request validation\n• OpenAPI /docs\n• Rate limiting"]
    end

    %% ─── ROUTER LAYER ────────────────────────────────────────────
    subgraph RL ["Router Layer"]
        direction LR
        R_Grading["/grading\nProduct photo intake\n& AI grading trigger"]
        R_Twins["/twins\nDigital twin\ncreation & lookup"]
        R_Routing["/routing\nOptimal destination\ndecision engine"]
        R_Market["/marketplace\nP2P listing, bidding\n& transactions"]
        R_Credits["/credits\nReLoop Credit\nearning & spending"]
        R_Prevent["/prevention\nReturn fraud\ndetection"]
        R_Dash["/dashboard\nAggregate stats\n& KPIs"]
    end

    %% ─── SERVICE LAYER ───────────────────────────────────────────
    subgraph SL ["Service Layer"]
        direction LR
        S_Grading["GradingService\n• Condition scoring\n• Defect detection\n• Price adjustment"]
        S_Routing["RoutingService\n• Resell / refurb\n• Recycle routing\n• Warehouse bypass"]
        S_Valuation["ValuationService\n• Dynamic pricing\n• Market benchmarking"]
        S_Credits["CreditsService\n• Reward calculation\n• Balance management"]
        S_Prevent["PreventionService\n• Fraud pattern analysis\n• Risk scoring"]
        S_Analytics["AnalyticsService\n• Sales & return metrics\n• Trend reporting"]
    end

    %% ─── AI / ML LAYER ───────────────────────────────────────────
    subgraph AI ["AI / ML Layer"]
        Bedrock["AWS Bedrock\nClaude 3 Sonnet (Multimodal)\n─────────────────\n• Vision-based condition grading\n• Natural language reasoning\n• Fraud signal interpretation\n• Valuation recommendations"]
    end

    %% ─── DATA LAYER ──────────────────────────────────────────────
    subgraph DL ["Data Layer"]
        DB[("SQLite DB\n─────────────\nProducts · Orders\nListings · Credits\nDigital Twins · Users")]
    end

    %% ─── DATA FLOWS ──────────────────────────────────────────────
    CustApp  -- "HTTPS / REST" --> FastAPI
    AdminApp -- "HTTPS / REST" --> FastAPI

    FastAPI --> R_Grading
    FastAPI --> R_Twins
    FastAPI --> R_Routing
    FastAPI --> R_Market
    FastAPI --> R_Credits
    FastAPI --> R_Prevent
    FastAPI --> R_Dash

    R_Grading  --> S_Grading
    R_Routing  --> S_Routing
    R_Market   --> S_Valuation
    R_Credits  --> S_Credits
    R_Prevent  --> S_Prevent
    R_Dash     --> S_Analytics
    R_Twins    --> DB

    S_Grading   -- "Image bytes + metadata" --> Bedrock
    S_Routing   -- "Grade + product context" --> Bedrock
    S_Valuation -- "Market data query"       --> Bedrock
    S_Prevent   -- "Behaviour signals"       --> Bedrock

    S_Grading   --> DB
    S_Routing   --> DB
    S_Valuation --> DB
    S_Credits   --> DB
    S_Prevent   --> DB
    S_Analytics --> DB
```


### Layer Responsibilities

| Layer | Technology | Responsibility |
|---|---|---|
| **Client** | React · Vite · Tailwind CSS | UI for customers (scan, resell, credits) and admins (monitoring, analytics) |
| **API Gateway** | FastAPI · Python 3.11 | Auth, request validation, routing, OpenAPI docs |
| **Routers** | FastAPI Routers | Domain-specific endpoints: grading, twins, routing, marketplace, credits, prevention, dashboard |
| **Services** | Python service classes | Business logic: grading, routing decisions, valuation, fraud prevention, analytics |
| **AI/ML** | AWS Bedrock · Claude 3 Sonnet | Multimodal vision grading, fraud analysis, dynamic valuation recommendations |
| **Database** | SQLite | Persistent storage for products, digital twins, marketplace listings, credits, users |


## Tech Stack
- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Python FastAPI + SQLite
- **AI/ML**: AWS Bedrock (Claude multimodal)

## Setup Instructions

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
python -m seed_data.generate_synthetic
uvicorn app.main:app --reload --port 8000
```
API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Demo
Launch both backend and frontend, then navigate to `http://localhost:3000` to walk through the customer experience and view the admin dashboard.

## Folder Structure
- `/contracts`: JSON schemas and API documentation
- `/backend`: FastAPI Python application
- `/frontend`: React customer and admin interfaces
- `/pitch`: Presentation deck and demo script