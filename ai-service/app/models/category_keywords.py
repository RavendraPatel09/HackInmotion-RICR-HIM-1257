"""
Configurable category classification rules.

This is a transparent, auditable rule engine — the same role a trained
NLP classifier would play. Swap `classify_by_keywords()` in
`classifier_service.py` for a real model call without touching any
other layer (schemas, routes, and downstream consumers stay identical).
"""

CATEGORY_KEYWORDS: dict[str, list[str]] = {
    "ROADS": [
        "pothole", "road", "asphalt", "crack", "footpath", "sidewalk",
        "speed breaker", "divider", "bridge", "flyover", "pavement",
    ],
    "WATER": [
        "water", "pipe leak", "leakage", "supply", "tap", "borewell",
        "contaminated water", "no water", "pipeline burst",
    ],
    "SANITATION": [
        "garbage", "trash", "waste", "dustbin", "litter", "dump",
        "sewage overflow", "toilet", "public toilet", "cleaning",
    ],
    "ELECTRICITY": [
        "streetlight", "street light", "power cut", "transformer",
        "electric pole", "wire", "short circuit", "voltage", "power outage",
    ],
    "DRAINAGE": [
        "drain", "drainage", "sewer", "manhole", "waterlogging",
        "flooding", "stagnant water", "clogged",
    ],
    "PUBLIC_WORKS": [
        "park", "playground", "public bench", "government building",
        "construction", "encroachment", "illegal structure",
    ],
    "TRAFFIC": [
        "traffic signal", "signal not working", "traffic jam",
        "parking", "no parking", "traffic light", "zebra crossing",
    ],
}

# Keywords that meaningfully raise safety risk regardless of category
SAFETY_RISK_KEYWORDS: list[str] = [
    "exposed wire", "live wire", "collapse", "collapsed", "accident",
    "fire", "gas leak", "open manhole", "electrocution", "landslide",
    "children", "school zone", "hospital", "blind curve",
]

DEFAULT_CATEGORY = "PUBLIC_WORKS"
