# Eventia Setup & Running

This file covers installation and running for both frontend and backend.

## Prerequisites
- Node.js (LTS recommended)
- npm
- MongoDB running locally or a hosted MongoDB URI

## Frontend (eventia-frontend, Vite)

### Install
1. Open a terminal at the project root.
2. Go to the frontend folder:
   ```
   cd eventia-frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Run (dev)
```
npm run dev
```

Vite will print the local dev URL in the terminal.

## Backend (express, nodemon, MongoDB)

### Install
1. Open a terminal at the project root.
2. Go to the backend folder:
   ```
   cd express
   ```
3. Install dependencies:
   ```
   npm install
   ```

### Configure
Set your MongoDB connection string in the backend environment (commonly `MONGO_URI`). If you already have a `.env` file or config in place, update it with your database URI.

### Run (dev with nodemon)
```
npm run dev
```

If your backend uses a different script (e.g., `start`), run:
```
npm run start
```

## Notes
- Start MongoDB before running the backend.
- Run frontend and backend in separate terminals.
