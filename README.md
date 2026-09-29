# AssetIQ

AI-powered equipment memory agent.

AssetIQ remembers the maintenance history of physical equipment and gives technicians an instant, context-aware brief before they work on an asset.

## Tech Stack

- React
- Node.js
- Express
- MySQL
- Hindsight
- Groq

## Project Structure

- frontend/ - React application
- backend/ - Node.js + Express API
- database/ - Database schema
- seed-data/ - Demo data
- docs/ - Project documentation

## Demo data setup

Apply the existing `database/schema.sql` to the `assetiq` database before seeding. The demo runner uses `mysql2` from the backend and the same `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` settings as the API. It loads these settings from `backend/.env` when present; process environment variables take precedence. Do not commit local credentials.

```powershell
node .\seed-data\seed-demo.js
```

The seed preserves the 20 synthetic assets and 20 dated maintenance reports. It updates matching asset IDs and report identities rather than duplicating them on repeated runs. Only columns supported by the backend schema are written.

To make those historical reports available to the maintenance brief, configure `HINDSIGHT_BASE_URL` and `HINDSIGHT_API_KEY` in `backend/.env`, then run:

```powershell
node .\seed-data\retain-demo-history.js
```

The bootstrap uses the canonical demo report fixtures and the existing backend Hindsight service. It checks recall for each report before retaining it and verifies the resulting memory. New reports submitted through `POST /api/reports` continue to use the backend's normal retention flow.
