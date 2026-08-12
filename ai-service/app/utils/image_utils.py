import io
from typing import Optional

import httpx
import imagehash
from PIL import Image

from app.core.config import get_settings


async def fetch_image(url: str) -> Optional[Image.Image]:
    """Fetch a remote image and decode it. Returns None on any failure —
    callers must treat that as 'not comparable', never crash the request."""
    settings = get_settings()

    try:
        async with httpx.AsyncClient(timeout=settings.image_fetch_timeout) as client:
            response = await client.get(url)
            response.raise_for_status()
            return Image.open(io.BytesIO(response.content)).convert("RGB")
    except (httpx.HTTPError, OSError, ValueError):
        return None


def perceptual_hash(image: Image.Image) -> imagehash.ImageHash:
    return imagehash.phash(image)


def hash_similarity(hash_a: imagehash.ImageHash, hash_b: imagehash.ImageHash) -> float:
    """
    Convert Hamming distance between two perceptual hashes into a
    0-1 similarity score. phash is 64 bits by default, so max
    distance is 64.
    """
    max_distance = len(hash_a.hash) ** 2  # 8x8 hash -> 64 bits
    distance = hash_a - hash_b
    similarity = 1 - (distance / max_distance)
    return round(max(0.0, min(1.0, similarity)), 4)
