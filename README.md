<h1 align="center">Multisource Disaster Intelligence System</h1>

<p align="center">This software streamlines the process of gathering and categorizing disaster related data from various sources, significantly reducing the time required for response efforts by providing real-time insights and actionable information, the software will enhance the effectiveness of disaster response operations, ultimately saving lives.</p>

## Links

- [Website](https://msdis.vercel.app/ "Live View")
- [Backend API Docs](http://localhost:8000/docs "Swagger UI (when running locally)")

## Architecture

```text
External Data Sources (Open-Meteo, USGS + curated official feeds)
        ↓
Provider Adapters + Mock Fallback (backend/app/services/providers)
        ↓
Normalization & Validation (backend/app/services/ingestion.py)
        ↓
Event Detection + Risk Classification (detection.py / risk.py)
        ↓
Incident & Verification Engine (incident_engine.py)
        ↓
SQL Database (SQLite locally, Postgres/Supabase via DATABASE_URL)
        ↓
FastAPI REST API (/api/v1)  →  React Frontend (this repo's src/)
```

- **Backend:** FastAPI + SQLAlchemy + APScheduler (`backend/`)
- **Live providers (free, no API key):** Open-Meteo (weather/rainfall), USGS FDSN (earthquakes)
- **Early prediction (F4):** Open-Meteo 24h forecast aggregates drive `FORECAST_RISK` incidents — predicted flood, heavy-rain, cyclone-wind and heatwave events are raised before anything is observed on the ground, and stay distinct from `OBSERVED_EVENT` incidents in the API
- **Government schemes:** curated central-scheme catalog (`GET /api/v1/schemes`) with location-aware relevance matching (`/schemes/relevant`)
- **Fallbacks:** seeded demo incidents, cached data and mock providers keep the dashboard alive if a provider fails
- **Frontend:** polls `/api/v1/dashboard` every 45 s; every endpoint silently falls back to bundled mock data when the backend is offline

## Running Locally

### 1. Backend (port 8000)

```bash
cd backend
pip install -r requirements.txt
copy .env.example .env        # optional: tweak thresholds / DB URL
python -m uvicorn app.main:app --reload --port 8000
```

- Swagger docs: <http://localhost:8000/docs>
- Health check: <http://localhost:8000/api/v1/health>
- On startup the backend seeds curated sources/resources/demo incidents, then runs a live ingestion pipeline and schedules refreshes (weather every 10 min, earthquakes every 10 min, detection every 5 min).
- To use Supabase/Postgres instead of SQLite set `DATABASE_URL` in `backend/.env`.

### 2. Frontend (port 3000)

```bash
npm install
npm run dev
```

The Vite dev server proxies `/api/*` to `http://127.0.0.1:8000`. For production deploys set `VITE_API_URL` to your backend URL (see `.env.example`).

### 3. Moderator / Admin API

Protected by the `X-Admin-Secret` header (default `sih-demo-admin-secret`, change in `backend/.env`):

| Action | Endpoint |
| --- | --- |
| Evidence bundle for review | `GET /api/v1/incidents/{id}/evidence` |
| Verify / reject / corroborate | `POST /api/v1/admin/incidents/{id}/verification` |
| Lifecycle transition | `POST /api/v1/admin/incidents/{id}/status` |
| Add relief resource | `POST /api/v1/admin/resources` |
| Update resource status | `PATCH /api/v1/admin/resources/{id}` |

### 4. Smoke test

```bash
# with the backend running:
python backend/smoke_test.py
```



## Built With

- TypeScript
- JavaScript
- Node
- NPM
- HTML
- CSS
- React
- Vite
- Python
- FastAPI
- SQLAlchemy
- APScheduler

## Future Updates

- [ ] Integrated AI Assistance
- [ ] Regional Language Support

## Authors

**Yajat Satpati** (Fullstack)

- [Profile](https://github.com/satpatiyajat "Yajat_Satpati")
- [Email](mailto:satpatiyajat@gmail.com?subject=Hi "Hi!")

**Swayam Gupta** (Frontend)
- [Profile](https://github.com/SwayamGupta1001 "Swayam_Gupta")
- [Email](mailto:swayamgupta1019@gmail.com?subject=Hi "Hi!")

**Nency Patel** (Backend)
- [Profile](https://github.com/nencypatel16 "Nency_Patel")
- [Email](mailto:nencypatel.1603@gmail.com?subject=Hi "Hi!")

**Ikjot Singh** (Frontend)
- [Profile](https://github.com/RottenCheesy "Ikjot_Singh")
- [Email](mailto:ikjot.manraj@gmail.com?subject=Hi "Hi!")

## Collaborators

**Pal Patel** (Research)
- [Profile](https://github.com/palpatel2311 "Pal_Patel")
- [Email](mailto:palpatel2311@gmail.com?subject=Hi "Hi!")

**Samaiera** (Research + Presentation)
- [Profile](https://github.com/Samaiera "Samaiera")
- [Email](mailto:samaieraali@gmail.com?subject=Hi "Hi!")

## 🤝 Support

Give a ⭐️ if you like this project!