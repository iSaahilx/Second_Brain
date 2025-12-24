from __future__ import annotations

from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "sqlite:///./secondbrain.db"

engine = create_engine(DATABASE_URL, echo=False, connect_args={"check_same_thread": False})


def create_db_and_tables() -> None:
    from . import models  # noqa: F401

    SQLModel.metadata.create_all(engine)


def get_session() -> Session:
    with Session(engine) as session:
        yield session


