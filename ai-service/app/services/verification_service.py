def verify_resolution(
    original_description: str,
    resolution_description: str
) -> dict:
    """
    Verify whether the resolution addresses the reported issue.
    """

    original = original_description.lower().strip()
    resolution = resolution_description.lower().strip()

    if not original or not resolution:
        return {
            "verified": False,
            "score": 0.0,
            "message": "Missing issue or resolution description."
        }

    # Basic keyword-based verification
    original_words = set(original.split())
    resolution_words = set(resolution.split())

    common_words = original_words.intersection(resolution_words)

    score = len(common_words) / max(len(original_words), 1)

    return {
        "verified": score >= 0.2,
        "score": round(score, 2),
        "message": (
            "Resolution appears relevant."
            if score >= 0.2
            else "Resolution may not address the reported issue."
        )
    }