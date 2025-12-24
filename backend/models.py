from datetime import datetime
from enum import Enum
from typing import Optional

from sqlmodel import SQLModel, Field, Relationship


class PatientPriority(str, Enum):
    normal = "normal"
    important = "important"
    critical = "critical"


class PatientStatus(str, Enum):
    active = "active"
    discharged = "discharged"


class TaskPriority(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class TaskStatus(str, Enum):
    open = "open"
    done = "done"


class UserBase(SQLModel):
    name: str
    email: Optional[str] = None


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    last_login_at: Optional[datetime] = None

    patients: list["Patient"] = Relationship(back_populates="user")


class PatientBase(SQLModel):
    name: str
    bed: Optional[str] = None
    main_problem: Optional[str] = None
    priority: PatientPriority = Field(default=PatientPriority.normal)
    status: PatientStatus = Field(default=PatientStatus.active)


class Patient(PatientBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")

    user: Optional[User] = Relationship(back_populates="patients")
    tasks: list["Task"] = Relationship(back_populates="patient")


class TaskBase(SQLModel):
    title: str
    notes: Optional[str] = None
    # for v0.1, we support full datetime; UI can still treat as today/tomorrow buckets
    due_time: Optional[datetime] = None
    priority: TaskPriority = Field(default=TaskPriority.medium)
    status: TaskStatus = Field(default=TaskStatus.open)


class Task(TaskBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(foreign_key="patient.id")

    created_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None

    patient: Optional[Patient] = Relationship(back_populates="tasks")


class TaskRead(TaskBase):
    id: int
    patient_id: int
    created_at: datetime
    completed_at: Optional[datetime]


class PatientRead(PatientBase):
    id: int
    user_id: int


class UserRead(UserBase):
    id: int
    last_login_at: Optional[datetime]


