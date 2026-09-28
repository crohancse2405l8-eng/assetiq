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

## Demo database setup

Use environment variables for your local MySQL connection; do not commit credentials.

### PowerShell

```powershell
$env:MYSQL_HOST = 'localhost'
$env:MYSQL_PORT = '3306'
$env:MYSQL_USER = 'root'
$env:MYSQL_PASSWORD = ''
$env:MYSQL_DATABASE = 'assetiq_dev'
$env:MYSQL_BIN = 'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe'

& $env:MYSQL_BIN -h $env:MYSQL_HOST -P $env:MYSQL_PORT -u $env:MYSQL_USER -p -e "CREATE DATABASE IF NOT EXISTS $env:MYSQL_DATABASE; USE $env:MYSQL_DATABASE; SOURCE .\database\schema.sql;"
node .\seed-data\seed-demo.js
```

If your local MySQL binary is in PATH, you can omit `MYSQL_BIN` and use:

```powershell
$env:MYSQL_HOST = 'localhost'
$env:MYSQL_PORT = '3306'
$env:MYSQL_USER = 'root'
$env:MYSQL_PASSWORD = ''
$env:MYSQL_DATABASE = 'assetiq_dev'

& mysql -h $env:MYSQL_HOST -P $env:MYSQL_PORT -u $env:MYSQL_USER -p -e "CREATE DATABASE IF NOT EXISTS $env:MYSQL_DATABASE; USE $env:MYSQL_DATABASE; SOURCE .\database\schema.sql;"
node .\seed-data\seed-demo.js
```

### Linux/macOS

```bash
export MYSQL_HOST=localhost
export MYSQL_PORT=3306
export MYSQL_USER=root
export MYSQL_PASSWORD=''
export MYSQL_DATABASE=assetiq_dev
export MYSQL_BIN=mysql

mysql -h "$MYSQL_HOST" -P "$MYSQL_PORT" -u "$MYSQL_USER" -p -e "CREATE DATABASE IF NOT EXISTS $MYSQL_DATABASE; USE $MYSQL_DATABASE; SOURCE ./database/schema.sql;"
node ./seed-data/seed-demo.js
```

The runner expects the mysql client to be available either at `MYSQL_BIN` or on your PATH. If not found, it raises a clear error telling you to set `MYSQL_BIN`.
