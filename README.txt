DIGITAL DIARY AND JOURNAL APP
=============================

Tech:
- React + Vite
- Axios
- FastAPI
- SQLite
- No AI
- No MongoDB

FOLDER STRUCTURE
----------------

Digital_Diary/
|
|-- backend/
|   |-- main.py
|   |-- requirements.txt
|   `-- diary.db   (created automatically)
|
`-- frontend/
    |-- package.json
    |-- vite.config.js
    |-- index.html
    `-- src/
        |-- App.jsx
        |-- App.css
        |-- Login.jsx
        |-- Register.jsx
        |-- Dashboard.jsx
        |-- api.js
        |-- main.jsx
        `-- index.css


RUN BACKEND
------------

Open Terminal 1:

cd backend

python -m venv venv

Windows PowerShell:
.\venv\Scripts\Activate.ps1

pip install -r requirements.txt

uvicorn main:app --reload


Backend:
http://127.0.0.1:8000


RUN FRONTEND
------------

Open Terminal 2:

cd frontend

npm install

npm run dev


Frontend:
http://localhost:5173


IMPORTANT
---------

Keep BOTH terminals running.

The frontend uses a Vite proxy:
React -> /api -> FastAPI -> SQLite

So the frontend does not directly call port 8000 from the browser, avoiding the previous CORS problem.
