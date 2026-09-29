# AssetIQ

AI-powered equipment memory agent.

AssetIQ remembers the maintenance history of physical equipment and gives technicians an instant, context-aware brief before they work on an asset.

---

## Tech Stack

* React + Vite
* Node.js
* Express
* MySQL
* Hindsight
* Groq

---

## Project Structure

```text
assetiq/
│
├── frontend/          # React + Vite application
├── backend/           # Node.js + Express API
├── database/          # MySQL schema and seed data
├── seed-data/         # Demo data
├── docs/              # Project documentation
├── .env.example
├── .gitignore
└── README.md
```

---

# Installation & Setup

## Prerequisites

Make sure the following are installed on your system:

* [Node.js](https://nodejs.org/)
* npm
* MySQL Server
* Git
* Hindsight API key
* Groq API key

You can verify Node.js and npm with:

```bash
node --version
npm --version
```

---

## 1. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/crohancse2405l8-eng/assetiq.git
```

Move into the project directory:

```bash
cd assetiq
```

---

## 2. Set Up MySQL Database

Make sure your MySQL server is running.

Open MySQL and create the AssetIQ database:

```sql
CREATE DATABASE assetiq;
```

Create the application user:

```sql
CREATE USER 'assetiq_dev'@'localhost' IDENTIFIED BY 'your_mysql_password';
```

Grant permissions:

```sql
GRANT ALL PRIVILEGES ON assetiq.* TO 'assetiq_dev'@'localhost';
FLUSH PRIVILEGES;
```

### Import the database schema

From the project root:

```bash
mysql -u assetiq_dev -p assetiq < database/schema.sql
```

### Import the sample data

```bash
mysql -u assetiq_dev -p assetiq < database/seed.sql
```

> If you use a different MySQL username, password, or database name, update the backend environment variables accordingly.

---

# 3. Configure Backend Environment Variables

Move into the backend directory:

```bash
cd backend
```

Create a `.env` file from the example file.

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

Open `backend/.env` and configure the values:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=assetiq
DB_USER=assetiq_dev
DB_PASSWORD=your_mysql_password

HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_API_KEY=your_hindsight_api_key
GROQ_API_KEY=your_groq_api_key
```

### Environment Variables

| Variable             | Description                     |
| -------------------- | ------------------------------- |
| `PORT`               | Port used by the backend server |
| `DB_HOST`            | MySQL host                      |
| `DB_PORT`            | MySQL port                      |
| `DB_NAME`            | MySQL database name             |
| `DB_USER`            | MySQL username                  |
| `DB_PASSWORD`        | MySQL password                  |
| `HINDSIGHT_BASE_URL` | Hindsight API base URL          |
| `HINDSIGHT_API_KEY`  | Hindsight API key               |
| `GROQ_API_KEY`       | Groq API key                    |

> **Important:** Never commit your real API keys or `.env` files to GitHub.

---

# 4. Install Backend Dependencies

Inside the `backend` directory:

```bash
npm install
```

---

# 5. Start the Backend

For development:

```bash
npm run dev
```

Or start normally:

```bash
npm start
```

The backend API will run on:

```text
http://localhost:3000
```

---

# 6. Install Frontend Dependencies

Open a **new terminal**.

From the project root:

```bash
cd frontend
```

Install the dependencies:

```bash
npm install
```

---

# 7. Start the Frontend

Run the Vite development server:

```bash
npm run dev
```

Vite will display the local development URL in the terminal.

Usually:

```text
http://localhost:5173
```

Open that URL in your browser.

---

# 8. Run AssetIQ

Both servers should be running.

| Component   | URL                     |
| ----------- | ----------------------- |
| Frontend    | `http://localhost:5173` |
| Backend API | `http://localhost:3000` |

Open the frontend URL to use AssetIQ.

---

# Useful Commands

## Frontend

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

Preview production build:

```bash
npm run preview
```

---

## Backend

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Start server:

```bash
npm start
```

Test Hindsight:

```bash
npm run test:hindsight
```

Test Groq:

```bash
npm run test:groq
```

Test maintenance brief generation:

```bash
npm run test:maintenance-brief
```

---

# Troubleshooting

## MySQL connection error

Make sure:

1. MySQL Server is running.
2. The database `assetiq` exists.
3. The username and password in `backend/.env` are correct.
4. The database schema has been imported.

You can verify the database with:

```sql
SHOW DATABASES;
```

---

## Port already in use

If port `3000` is already being used, change the backend port in `.env`:

```env
PORT=3001
```

Then restart the backend.

---

## Frontend cannot connect to backend

Make sure the backend is running before using API-dependent features.

Check that the backend is available at:

```text
http://localhost:3000
```

---

## API key errors

Verify that these values are correctly configured in `backend/.env`:

```env
HINDSIGHT_API_KEY=your_hindsight_api_key
GROQ_API_KEY=your_groq_api_key
```

Do not include quotation marks unless required by your environment.

---

# Security

Never commit sensitive information such as:

* API keys
* Database passwords
* `.env` files
* Authentication tokens

Use `.env` for local configuration and keep secrets out of source control.

---

# Team Development

Before making changes:

```bash
git pull origin main
```

Create a new branch:

```bash
git checkout -b feature/your-feature-name
```

After making changes:

```bash
git add .
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
```

Create a Pull Request on GitHub for review.

---

# AssetIQ Workflow

```text
Technician
    │
    ▼
React Frontend
    │
    ▼
Express Backend API
    │
    ├──────────────► MySQL
    │
    ├──────────────► Hindsight
    │
    └──────────────► Groq
    │
    ▼
Context-Aware Maintenance Brief
    │
    ▼
Technician
```

---

# License

This project is developed as an academic/project prototype for demonstrating AI-powered equipment memory and maintenance assistance.

---

## Authors

AssetIQ Development Team
