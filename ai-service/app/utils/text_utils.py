import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def normalize(text: str) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text


def text_similarity(text_a: str, text_b: str) -> float:
    """
    Cosine similarity over TF-IDF vectors of two short texts.

    Deliberately classical (not a downloaded embedding model) so this
    service runs fully offline/air-gapped for a hackathon demo. Swap
    for sentence-transformers or an API-based embedding model later —
    only this function needs to change.
    """
    a, b = normalize(text_a), normalize(text_b)

    if not a or not b:
        return 0.0

    if a == b:
        return 1.0

    try:
        vectorizer = TfidfVectorizer(stop_words="english")
        tfidf_matrix = vectorizer.fit_transform([a, b])
        score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return float(max(0.0, min(1.0, score)))
    except ValueError:
        # Happens if both texts are entirely stop-words / empty after vectorizing
        return 0.0


def extract_matched_keywords(text: str, keywords: list[str]) -> list[str]:
    normalized = normalize(text)
    return [kw for kw in keywords if kw in normalized]
