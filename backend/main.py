from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import sqlite3
import hashlib
from datetime import datetime

app = FastAPI(title="Digital Diary API")

# CORS is enabled for both common Vite development origins.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://digital-diary-9war.vercel.app"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

DB_NAME = "diary.db"


def get_db():
    db = sqlite3.connect(DB_NAME)
    db.row_factory = sqlite3.Row
    return db


def create_tables():
    db = get_db()

    db.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            gender TEXT NOT NULL
        )
    """)

    db.execute("""
        CREATE TABLE IF NOT EXISTS journals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            content TEXT NOT NULL,
            mood TEXT,
            tags TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    db.commit()
    db.close()


create_tables()


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    gender: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class JournalRequest(BaseModel):
    user_id: int
    title: str
    content: str
    mood: str = ""
    tags: str = ""


class JournalUpdateRequest(BaseModel):
    title: str
    content: str
    mood: str = ""
    tags: str = ""


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


@app.get("/")
def home():
    return {"message": "Digital Diary Backend is running!"}


@app.post("/register")
def register(user: RegisterRequest):
    gender = user.gender.strip().lower()

    if gender not in ["male", "female"]:
        raise HTTPException(
            status_code=400,
            detail="Gender must be male or female"
        )

    if not user.name.strip() or not user.password:
        raise HTTPException(
            status_code=400,
            detail="Name and password are required"
        )

    db = get_db()

    existing_user = db.execute(
        "SELECT id FROM users WHERE email = ?",
        (str(user.email),)
    ).fetchone()

    if existing_user:
        db.close()
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    db.execute(
        """
        INSERT INTO users (name, email, password, gender)
        VALUES (?, ?, ?, ?)
        """,
        (
            user.name.strip(),
            str(user.email),
            hash_password(user.password),
            gender,
        ),
    )

    db.commit()
    db.close()

    return {"message": "Registration successful"}


@app.post("/login")
def login(user: LoginRequest):
    db = get_db()

    existing_user = db.execute(
        "SELECT * FROM users WHERE email = ?",
        (str(user.email),)
    ).fetchone()

    if not existing_user:
        db.close()
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if hash_password(user.password) != existing_user["password"]:
        db.close()
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    logged_user = {
        "id": existing_user["id"],
        "name": existing_user["name"],
        "email": existing_user["email"],
        "gender": existing_user["gender"],
    }

    db.close()

    return {
        "message": "Login successful",
        "user": logged_user
    }


@app.post("/journals")
def create_journal(journal: JournalRequest):
    db = get_db()

    user = db.execute(
        "SELECT id FROM users WHERE id = ?",
        (journal.user_id,)
    ).fetchone()

    if not user:
        db.close()
        raise HTTPException(status_code=404, detail="User not found")

    title = journal.title.strip()
    content = journal.content.strip()

    if not title or not content:
        db.close()
        raise HTTPException(
            status_code=400,
            detail="Title and content are required"
        )

    db.execute(
        """
        INSERT INTO journals
        (user_id, title, content, mood, tags, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            journal.user_id,
            title,
            content,
            journal.mood.strip(),
            journal.tags.strip(),
            datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        ),
    )

    db.commit()
    db.close()

    return {"message": "Journal saved successfully"}


@app.get("/journals/{user_id}")
def get_journals(user_id: int):
    db = get_db()

    journals = db.execute(
        """
        SELECT id, title, content, mood, tags, created_at
        FROM journals
        WHERE user_id = ?
        ORDER BY id DESC
        """,
        (user_id,)
    ).fetchall()

    result = [dict(journal) for journal in journals]

    db.close()
    return result


@app.put("/journals/{journal_id}")
def update_journal(
    journal_id: int,
    journal: JournalUpdateRequest
):
    db = get_db()

    title = journal.title.strip()
    content = journal.content.strip()

    if not title or not content:
        db.close()
        raise HTTPException(
            status_code=400,
            detail="Title and content are required"
        )

    result = db.execute(
        """
        UPDATE journals
        SET title = ?, content = ?, mood = ?, tags = ?
        WHERE id = ?
        """,
        (
            title,
            content,
            journal.mood.strip(),
            journal.tags.strip(),
            journal_id,
        ),
    )

    db.commit()

    if result.rowcount == 0:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Journal not found"
        )

    db.close()
    return {"message": "Journal updated successfully"}


@app.delete("/journals/{journal_id}")
def delete_journal(journal_id: int):
    db = get_db()

    result = db.execute(
        "DELETE FROM journals WHERE id = ?",
        (journal_id,)
    )

    db.commit()

    if result.rowcount == 0:
        db.close()
        raise HTTPException(
            status_code=404,
            detail="Journal not found"
        )

    db.close()
    return {"message": "Journal deleted successfully"}
