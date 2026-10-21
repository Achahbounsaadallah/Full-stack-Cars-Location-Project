# Nova Drive

## Prerequisites

- Java 17+
- SQL Server with the `CarsLocation` database
- Node.js 20+

## Backend

Configure the database connection with environment variables or update the local Spring configuration. Start the API on port `8080`:

```powershell
.\mvnw.cmd spring-boot:run
```

Swagger is available at `http://localhost:8080/swagger-ui.html`.

## Frontend

```powershell
cd frontend
npm install
npm run dev
```

The frontend reads `VITE_API_URL` from `frontend/.env`. The default local value is `http://localhost:8080`.

## Roles

- `CLIENT`: catalogue and personal bookings
- `EMPLOYEE`: reservation processing and fleet status
- `ADMIN`: employee and user administration

## Checks

```powershell
npm run build
npm run lint
.\mvnw.cmd test
```
