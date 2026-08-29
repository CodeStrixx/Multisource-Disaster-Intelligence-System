"""F5: Config-driven risk classification with explainable factors (M6)."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from ..config import settings

RULE_VERSION = "v1"

_LEVEL_ORDER = {"LOW": 0, "MODERATE": 1, "HIGH": 2, "CRITICAL": 3}


@dataclass
class RiskOutcome:
    risk_level: str
    risk_score: float
    factors: list[str]


def level_value(level: str) -> int:
    return _LEVEL_ORDER.get(level.upper(), -1)


def classify_rain(rain_24h: float | None, warning_level: str, wind_kmh: float | None = None) -> RiskOutcome:
    """Rainfall + official warning -> flood / heavy-rain risk (rule example from F4)."""
    factors: list[str] = []
    score = 0.0

    rain = rain_24h or 0.0
    if rain >= settings.RAIN_EXTREME_MM_24H:
        score += 45
        factors.append(f"Extremely heavy rainfall in 24h ({rain:.0f} mm ≥ {settings.RAIN_EXTREME_MM_24H:.0f} mm threshold)")
    elif rain >= settings.RAIN_VERY_HEAVY_MM_24H:
        score += 32
        factors.append(f"Very heavy rainfall in 24h ({rain:.0f} mm)")
    elif rain >= settings.RAIN_HEAVY_MM_24H:
        score += 20
        factors.append(f"Heavy rainfall threshold exceeded ({rain:.0f} mm)")

    wl = (warning_level or "none").lower()
    if wl == "warning":
        score += 35
        factors.append("Official warning active")
    elif wl == "watch":
        score += 22
        factors.append("Official watch active for region")
    elif wl == "alert":
        score += 12
        factors.append("Rainfall alert issued")

    if wind_kmh and wind_kmh >= settings.CYCLONE_WIND_KMH:
        score += 25
        factors.append(f"Destructive winds observed ({wind_kmh:.0f} km/h)")

    if not factors:
        factors.append("Conditions within normal range")

    return RiskOutcome(_level_from_score(score), min(100.0, score), factors)


def classify_heat(temp_c: float | None) -> RiskOutcome:
    factors: list[str] = []
    score = 0.0
    t = temp_c or 0.0
    if t >= 45:
        score = 80
        factors.append(f"Severe heatwave temperature recorded ({t:.1f}°C)")
    elif t >= settings.HEATWAVE_TEMP_C + 2.5:
        score = 62
        factors.append(f"Heatwave conditions ({t:.1f}°C above {settings.HEATWAVE_TEMP_C:.0f}°C threshold)")
    elif t >= settings.HEATWAVE_TEMP_C:
        score = 42
        factors.append(f"Temperature at heatwave threshold ({t:.1f}°C)")
    else:
        factors.append("Temperature below heatwave threshold")
    return RiskOutcome(_level_from_score(score), min(100.0, score), factors)


def classify_quake(magnitude: float, depth_km: float | None = None) -> RiskOutcome:
    """Magnitude-band based severity (configurable MVP default per F3 ambiguity note)."""
    factors: list[str] = [f"Earthquake magnitude M{magnitude:.1f} recorded"]
    if magnitude >= 6.5:
        score = 92
        factors.append("Major quake: high structural-damage potential")
    elif magnitude >= 5.5:
        score = 78
        factors.append("Strong quake: damage possible in vulnerable structures")
    elif magnitude >= 4.5:
        score = 60
        factors.append("Moderate quake: widely felt, minor damage possible")
    elif magnitude >= 3.5:
        score = 38
        factors.append("Light quake: felt locally")
    else:
        score = 18
        factors.append("Minor quake: below typical damage threshold")
    if depth_km is not None and depth_km < 30 and magnitude >= 4.5:
        score += 8
        factors.append(f"Shallow depth ({depth_km:.0f} km) increases shaking intensity")
    return RiskOutcome(_level_from_score(score), min(100.0, score), factors)


def classify_cyclone(wind_kmh: float | None, warning_level: str) -> RiskOutcome:
    w = wind_kmh or 0.0
    factors: list[str] = []
    score = 0.0
    if w >= 118:
        score += 55
        factors.append(f"Cyclonic gale winds ({w:.0f} km/h)")
    elif w >= settings.CYCLONE_WIND_KMH:
        score += 38
        factors.append(f"Storm-force winds ({w:.0f} km/h)")

    wl = (warning_level or "").lower()
    if wl == "warning":
        score += 30
        factors.append("Official cyclone warning active")
    elif wl == "watch":
        score += 18
        factors.append("Cyclone watch in effect")

    if not factors:
        factors.append("Wind activity within normal seasonal range")
    return RiskOutcome(_level_from_score(score), min(100.0, score), factors)


def _level_from_score(score: float) -> str:
    if score >= 75:
        return "CRITICAL"
    if score >= 50:
        return "HIGH"
    if score >= 25:
        return "MODERATE"
    return "LOW"


__all__ = [
    "RiskOutcome",
    "RULE_VERSION",
    "classify_rain",
    "classify_heat",
    "classify_quake",
    "classify_cyclone",
    "level_value",
]
