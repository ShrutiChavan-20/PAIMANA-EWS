# 🏛️ PAIMANA-EWS (Early Warning System)
### AI-Driven Sovereign Infrastructure Project Monitoring & Predictive Intelligence Platform
**Developed for Smart India Hackathon (SIH 2026)**  
*Problem Statement: Use case on web-based integrated project-monitoring platform*  
*Ministry: Ministry of Statistics and Programme Implementation (MoSPI) · Infrastructure & Project Monitoring Division (IPMD)*

---

## 📌 Executive Summary

**PAIMANA-EWS** modernizes the national infrastructure monitoring framework (spanning 1,775 central sector projects costing ≥ ₹150 Crore, with a cumulative portfolio value of ₹37.11 Lakh Crore). It augments MoSPI's official **PAIMANA / OCMS** system with an advanced **Predictive AI Engine and Early Warning System (EWS)** to detect, forecast, and mitigate schedule slippages and cost escalations before they compound.

---

## 🎯 Core Features & Problem Statement Deliverables

### 1. 📊 Official Public Dashboard (MoSPI / IPMD Aligned)
- **Multi-Parameter Filtering Toolbar**: Query by Sector (22 sectors), Ministry/Department (17 ministries), States/UTs, Project Cost bands, and Monitoring Month.
- **4 Canonical Pastel KPI Metrics**:
  - `Project Count`: **1,775 Projects** (≥ ₹150 Cr threshold)
  - `Original Sanctioned Cost`: **₹ 33,70,138 Cr**
  - `Latest Revised Cost`: **₹ 37,10,642 Cr** (+₹3.40 Lakh Cr escalation)
  - `Cumulative Expenditure`: **₹ 19,26,100 Cr** (51.91% disbursed)
- **4 Core Analytical Visualizations (with Charts & Data views)**:
  - **Sector-wise Distribution**: Nested concentric doughnut chart with CSV/XLS export shortcuts.
  - **Cost Overview**: 3-tier stepped isometric financial reconciliation blocks.
  - **Physical Progress**: Milestone completion bands (0-25%, 26-50%, 51-75%, 76-99%, 100%).
  - **State-wise Distribution**: Radial geographic dispersion across Indian States and UTs.

### 2. 🧠 Predictive AI & Machine Learning Suite (`/predict`)
- **Cost Overrun Forecaster**: Predicts final project cost and percentage overrun with 90% confidence bands.
- **Schedule Delay Regressor**: Multi-variable regression factoring in Land Acquisition status, Forest/Wildlife clearances, and Contractor Reliability scores.
- **AI vs. Statistical Benchmark Suite**: Comparative analysis between **OLS Regression**, **ARIMA Time-Series**, **Random Forest**, and **XGBoost/LightGBM Ensembles** (92.4% Accuracy, $R^2 = 0.891$).
- **Early Warning Risk Triage**: Real-time multi-factor risk categorization:
  - 🔴 **Critical (High Risk)**: 635 projects (35.8%)
  - 🟡 **Watchlist (Amber)**: 592 projects (33.4%)
  - 🟢 **On-Track (Green)**: 548 projects (30.9%)
- **Intervention Simulator**: Proactive "What-If" decision support for clearance fast-tracking and liquidity relief.

### 3. 📝 Common Upload Form (CUF) Field Bottleneck Reporting (`/report` & `/issues`)
- Ground-level field verification for critical bottleneck categories:
  - Land Acquisition & RoW Disputes
  - Stage-I & Stage-II Forest / Wildlife Clearances
  - Utility Relocation (High-Tension Lines, Water/Gas Mains)
  - Contractor Insolvency & Cash-Flow Constraints
  - Geological Surprises & Tunneling Hazards

### 4. 🏆 Implementing Agency Reliability Index (`/trust`)
- Accountability benchmarks and transparency scoring for agencies including **NHAI**, **RVNL**, **NTPC**, **PGCIL**, **CIL**, and **BSNL**.

### 5. 📚 Publications & Flash Reports Archive (`/publications`)
- Centralized digital repository for MoSPI **Monthly Flash Reports (Project Monitoring)** and **Monthly Review Reports (Performance Monitoring)**.

---

## 🛠️ Technology Stack

- **Frontend**: React.js 18, Framer Motion, Vanilla CSS Design System
- **Data Visualizations**: Chart.js, React-Chartjs-2, Leaflet Maps
- **State Management**: React Context API
- **Predictive Engine**: Python, XGBoost, Scikit-learn, ARIMA, SHAP Feature Attribution
- **Iconography & Typography**: Lucide React, Plus Jakarta Sans, Outfit, JetBrains Mono

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v16+ or v18+)
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/<YOUR_USERNAME>/PAIMANA-EWS.git
cd PAIMANA-EWS/civicsense-v3-upgraded

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm start
```
The application will launch automatically at `http://localhost:3000/`.

---

## 👥 Smart India Hackathon (SIH 2026) Team
- **Project**: PAIMANA-EWS
- **Organization**: Ministry of Statistics and Programme Implementation (MoSPI)
- **Domain**: Web-based Integrated Project Monitoring Platform & Predictive Analytics
