from __future__ import annotations

from datetime import datetime, timedelta

from sqlmodel import Session, select

from .models import User, Patient, Task, PatientPriority, TaskPriority
from .database import engine


def seed_example_data() -> None:
    """Seed 1 user, 2–3 patients, and 5–10 tasks if DB is empty."""
    with Session(engine) as session:
        user_count = session.exec(select(User)).first()
        if user_count:
            return

        user = User(name="Dr. Test Resident", email="resident@example.com")
        session.add(user)
        session.commit()
        session.refresh(user)

        patient_1 = Patient(
            name="John Doe",
            bed="12A",
            main_problem="Sepsis secondary to pneumonia",
            priority=PatientPriority.critical,
            user_id=user.id,
        )
        patient_2 = Patient(
            name="Maria Garcia",
            bed="7B",
            main_problem="Decompensated heart failure",
            priority=PatientPriority.important,
            user_id=user.id,
        )
        patient_3 = Patient(
            name="Ahmed Khan",
            bed="3C",
            main_problem="Uncontrolled diabetes",
            priority=PatientPriority.normal,
            user_id=user.id,
        )

        session.add(patient_1)
        session.add(patient_2)
        session.add(patient_3)
        session.commit()
        session.refresh(patient_1)
        session.refresh(patient_2)
        session.refresh(patient_3)

        now = datetime.utcnow()

        tasks = [
            Task(
                patient_id=patient_1.id,
                title="Recheck lactate",
                notes="Draw in 4 hours",
                due_time=now + timedelta(hours=4),
                priority=TaskPriority.high,
            ),
            Task(
                patient_id=patient_1.id,
                title="Review blood culture results",
                due_time=now + timedelta(hours=8),
                priority=TaskPriority.medium,
            ),
            Task(
                patient_id=patient_2.id,
                title="Follow up echocardiogram",
                due_time=now + timedelta(hours=6),
                priority=TaskPriority.high,
            ),
            Task(
                patient_id=patient_2.id,
                title="Adjust diuretics",
                due_time=now + timedelta(hours=10),
                priority=TaskPriority.medium,
            ),
            Task(
                patient_id=patient_3.id,
                title="Review blood glucose log",
                due_time=now + timedelta(days=1),
                priority=TaskPriority.low,
            ),
            Task(
                patient_id=patient_3.id,
                title="Check HbA1c result",
                due_time=now + timedelta(days=1, hours=2),
                priority=TaskPriority.medium,
            ),
        ]

        session.add_all(tasks)
        session.commit()


