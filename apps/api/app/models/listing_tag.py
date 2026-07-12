from sqlalchemy import Table, Column, Integer, ForeignKey

from app.db.session import Base

listing_tags = Table(
    "listing_tags",
    Base.metadata,
    Column("listing_id", Integer, ForeignKey("listings.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)
