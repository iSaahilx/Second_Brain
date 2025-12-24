from __future__ import annotations

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from .database import create_db_and_tables, get_session
from .models import Task, TaskRead, Patient, PatientRead, User, UserRead
from .seed import seed_example_data

app = FastAPI(title="SecondBrain v0.1 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    create_db_and_tables()
    seed_example_data()


@app.get("/users", response_model=list[UserRead])
def list_users(session: Session = Depends(get_session)) -> list[User]:
    return session.exec(select(User)).all()


@app.get("/patients", response_model=list[PatientRead])
def list_patients(session: Session = Depends(get_session)) -> list[Patient]:
    return session.exec(select(Patient)).all()


@app.get("/patients/{patient_id}/tasks", response_model=list[TaskRead])
def list_tasks_for_patient(
    patient_id: int, session: Session = Depends(get_session)
) -> list[Task]:
    return session.exec(select(Task).where(Task.patient_id == patient_id)).all()


