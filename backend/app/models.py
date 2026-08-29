"""ORM models following the PRD data-model sketch (Section 7)."""
from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import (
    Boolean,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


def utcnow() -> datetime:
    return datetime.now(timezone.utc)


class DataSource(Base):
    __tablename__ = "data_sources"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    provider_id: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    type: Mapped[str] = mapped_column(String(32), default="official")
    source_url: Mapped[str] = mapped_column(String(512), default="")
    status: Mapped[str] = mapped_column(String(16), default="active")  # active|delayed|stale
    reliability_score: Mapped[float] = mapped_column(Float, default=90.0)
    last_success_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_failure_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_error: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    weather_observations = relationship("WeatherObservation", back_populates="source")


class RawDataRecord(Base):
    __tablename__ = "raw_data_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    source_id: Mapped[int] = mapped_column(ForeignKey("data_sources.id"))
    external_id: Mapped[str] = mapped_column(String(255), index=True)
    raw_payload_reference: Mapped[str] = mapped_column(Text, default="")
    fetched_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    source_timestamp: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    processing_status: Mapped[str] = mapped_column(String(24), default="processed")


class WeatherObservation(Base):
    __tablename__ = "weather_observations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    source_id: Mapped[int] = mapped_column(ForeignKey("data_sources.id"))
    location_name: Mapped[str] = mapped_column(String(255), default="")
    latitude: Mapped[float] = mapped_column(Float, index=True)
    longitude: Mapped[float] = mapped_column(Float, index=True)
    temperature_c: Mapped[float | None] = mapped_column(Float, nullable=True)
    rainfall_mm_1h: Mapped[float | None] = mapped_column(Float, nullable=True)
    rainfall_mm_24h: Mapped[float | None] = mapped_column(Float, nullable=True)
    wind_kmh: Mapped[float | None] = mapped_column(Float, nullable=True)
    # Forward-looking forecast aggregates (next 24h horizon)
    rainfall_mm_fc24h: Mapped[float | None] = mapped_column(Float, nullable=True)
    wind_kmh_fc24h_max: Mapped[float | None] = mapped_column(Float, nullable=True)
    temp_c_fc24h_max: Mapped[float | None] = mapped_column(Float, nullable=True)
    condition: Mapped[str] = mapped_column(String(64), default="unknown")
    warning_level: Mapped[str] = mapped_column(String(16), default="none")  # none|alert|watch|warning
    observed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    source = relationship("DataSource", back_populates="weather_observations")


class EarthquakeEvent(Base):
    __tablename__ = "earthquake_events"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    source_id: Mapped[int] = mapped_column(ForeignKey("data_sources.id"))
    external_event_id: Mapped[str] = mapped_column(String(128), unique=True, index=True)
    magnitude: Mapped[float] = mapped_column(Float)
    latitude: Mapped[float] = mapped_column(Float, index=True)
    longitude: Mapped[float] = mapped_column(Float, index=True)
    depth_km: Mapped[float | None] = mapped_column(Float, nullable=True)
    region_name: Mapped[str] = mapped_column(String(255), default="Unknown region")
    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Incident(Base):
    __tablename__ = "incidents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    public_id: Mapped[str] = mapped_column(String(48), unique=True, index=True)
    type: Mapped[str] = mapped_column(String(32), index=True)  # flood|heavy_rain|cyclone|landslide|earthquake|heatwave
    title: Mapped[str] = mapped_column(String(255))
    summary: Mapped[str] = mapped_column(Text, default="")
    signal_kind: Mapped[str] = mapped_column(String(24), default="OBSERVED_EVENT")  # OBSERVED_EVENT|FORECAST_RISK
    latitude: Mapped[float] = mapped_column(Float, index=True)
    longitude: Mapped[float] = mapped_column(Float, index=True)
    location_name: Mapped[str] = mapped_column(String(255), default="")
    district: Mapped[str] = mapped_column(String(128), default="")
    state: Mapped[str] = mapped_column(String(128), default="")
    affected_radius_km: Mapped[float] = mapped_column(Float, default=25.0)
    risk_level: Mapped[str] = mapped_column(String(16), default="LOW")  # LOW|MODERATE|HIGH|CRITICAL
    risk_score: Mapped[float] = mapped_column(Float, default=0.0)
    confidence_score: Mapped[float] = mapped_column(Float, default=50.0)
    status: Mapped[str] = mapped_column(String(24), default="DETECTED", index=True)
    verification_status: Mapped[str] = mapped_column(String(24), default="UNVERIFIED")
    trend: Mapped[str] = mapped_column(String(16), default="stable")
    rainfall_mm: Mapped[float | None] = mapped_column(Float, nullable=True)
    temperature_c: Mapped[float | None] = mapped_column(Float, nullable=True)
    magnitude: Mapped[float | None] = mapped_column(Float, nullable=True)
    what_we_known_json: Mapped[str] = mapped_column(Text, default="[]")
    official_warnings_json: Mapped[str] = mapped_column(Text, default="[]")
    detected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
    resolved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    evidence = relationship("IncidentEvidence", back_populates="incident", cascade="all, delete-orphan")
    assessments = relationship("RiskAssessment", back_populates="incident", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="incident")
    history = relationship("IncidentStatusHistory", back_populates="incident", cascade="all, delete-orphan")


class IncidentEvidence(Base):
    __tablename__ = "incident_evidence"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    incident_id: Mapped[int] = mapped_column(ForeignKey("incidents.id"), index=True)
    source_provider_id: Mapped[str] = mapped_column(String(64), default="")
    evidence_type: Mapped[str] = mapped_column(String(48))  # provider_observation|provider_event|moderator_review|citizen_report
    reference_id: Mapped[str] = mapped_column(String(255), default="")
    detail: Mapped[str] = mapped_column(Text, default="")
    confidence_weight: Mapped[float] = mapped_column(Float, default=10.0)
    added_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    incident = relationship("Incident", back_populates="evidence")


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    incident_id: Mapped[int] = mapped_column(ForeignKey("incidents.id"), index=True)
    risk_level: Mapped[str] = mapped_column(String(16))
    risk_score: Mapped[float] = mapped_column(Float)
    factors_json: Mapped[str] = mapped_column(Text, default="[]")
    rule_version: Mapped[str] = mapped_column(String(24), default="v1")
    calculated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    incident = relationship("Incident", back_populates="assessments")


class Resource(Base):
    __tablename__ = "resources"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    public_id: Mapped[str] = mapped_column(String(48), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    type: Mapped[str] = mapped_column(String(32))  # shelter|hospital|relief_centre|police|fire_station
    latitude: Mapped[float] = mapped_column(Float, index=True)
    longitude: Mapped[float] = mapped_column(Float, index=True)
    address: Mapped[str] = mapped_column(Text, default="")
    district: Mapped[str] = mapped_column(String(128), default="")
    state: Mapped[str] = mapped_column(String(128), default="")
    contact_number: Mapped[str] = mapped_column(String(128), default="")
    capacity: Mapped[str | None] = mapped_column(String(255), nullable=True)
    availability_status: Mapped[str] = mapped_column(String(16), default="OPEN")
    available_beds_or_kits: Mapped[int | None] = mapped_column(Integer, nullable=True)
    source_name: Mapped[str] = mapped_column(String(255), default="Curated dataset")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Recommendation(Base):
    __tablename__ = "recommendations"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    disaster_type: Mapped[str] = mapped_column(String(32), index=True)
    min_risk_level: Mapped[str] = mapped_column(String(16), default="MODERATE")
    priority: Mapped[str] = mapped_column(String(16))  # urgent|important|advisory
    title: Mapped[str] = mapped_column(String(255))
    instruction: Mapped[str] = mapped_column(Text)
    is_official: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class EmergencyContact(Base):
    """National / official emergency helpline numbers shown on the site."""

    __tablename__ = "emergency_contacts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(String(255))
    category: Mapped[str] = mapped_column(String(32), index=True)  # EMERGENCY|POLICE|FIRE|MEDICAL|DISASTER|HELPLINE
    phone_number: Mapped[str] = mapped_column(String(128))
    description: Mapped[str] = mapped_column(Text, default="")
    sort_order: Mapped[int] = mapped_column(Integer, default=100)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class GovernmentScheme(Base):
    """Official government welfare schemes for people in disaster-struck areas."""

    __tablename__ = "government_schemes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    scheme_code: Mapped[str] = mapped_column(String(48), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    level: Mapped[str] = mapped_column(String(16), default="CENTRAL")  # CENTRAL|STATE
    administering_body: Mapped[str] = mapped_column(String(255), default="")
    applicable_disaster_types_json: Mapped[str] = mapped_column(Text, default="[]")
    summary: Mapped[str] = mapped_column(Text, default="")
    benefit_details: Mapped[str] = mapped_column(Text, default="")
    eligibility: Mapped[str] = mapped_column(Text, default="")
    documents_required_json: Mapped[str] = mapped_column(Text, default="[]")
    how_to_apply_json: Mapped[str] = mapped_column(Text, default="[]")
    official_portal: Mapped[str] = mapped_column(String(512), default="")
    helpline: Mapped[str | None] = mapped_column(String(128), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)


class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    public_id: Mapped[str] = mapped_column(String(48), unique=True, index=True)
    incident_id: Mapped[int | None] = mapped_column(ForeignKey("incidents.id"), nullable=True, index=True)
    alert_type: Mapped[str] = mapped_column(String(48), default="risk_escalation")
    title: Mapped[str] = mapped_column(String(255))
    message: Mapped[str] = mapped_column(Text)
    severity: Mapped[str] = mapped_column(String(16))  # low|moderate|high|critical
    affected_area: Mapped[str] = mapped_column(String(255), default="")
    recommended_action: Mapped[str] = mapped_column(Text, default="")
    status: Mapped[str] = mapped_column(String(16), default="ACTIVE")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    incident = relationship("Incident", back_populates="alerts")


class IncidentStatusHistory(Base):
    __tablename__ = "incident_status_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    incident_id: Mapped[int] = mapped_column(ForeignKey("incidents.id"), index=True)
    previous_status: Mapped[str] = mapped_column(String(24))
    new_status: Mapped[str] = mapped_column(String(24))
    reason: Mapped[str] = mapped_column(Text, default="")
    actor_type: Mapped[str] = mapped_column(String(24), default="system")  # system|moderator
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)

    incident = relationship("Incident", back_populates="history")


class CitizenReport(Base):
    __tablename__ = "citizen_reports"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    public_id: Mapped[str] = mapped_column(String(48), unique=True, index=True)
    user_name: Mapped[str] = mapped_column(String(128), default="Anonymous Citizen")
    linked_incident_id: Mapped[int | None] = mapped_column(ForeignKey("incidents.id"), nullable=True)
    type: Mapped[str] = mapped_column(String(32))
    description: Mapped[str] = mapped_column(Text)
    latitude: Mapped[float] = mapped_column(Float)
    longitude: Mapped[float] = mapped_column(Float)
    location_name: Mapped[str] = mapped_column(String(255), default="")
    media_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    evidence_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    verification_status: Mapped[str] = mapped_column(String(24), default="UNDER_REVIEW")
    confidence_score: Mapped[float] = mapped_column(Float, default=50.0)
    upvotes: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow, onupdate=utcnow)
