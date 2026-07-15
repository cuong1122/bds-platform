from pydantic import BaseModel, Field


class FavoriteToggle(BaseModel):
    session_id: str = Field(..., min_length=8, max_length=64)


class FavoriteListingIds(BaseModel):
    listing_ids: list[int]
