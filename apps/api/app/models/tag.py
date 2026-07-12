import enum

from sqlalchemy import Column, Integer, String, Enum
from sqlalchemy.orm import relationship

from app.db.session import Base
from app.models.listing_tag import listing_tags


class TagType(str, enum.Enum):
    amenity = "amenity"
    interior = "interior"
    feature = "feature"


class Tag(Base):
    __tablename__ = "tags"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    type = Column(Enum(TagType), nullable=False)

    listings = relationship("Listing", secondary=listing_tags, back_populates="tags")
