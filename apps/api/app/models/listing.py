from sqlalchemy import (
    Column, Integer, String, Float, Numeric, Text, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.session import Base
from app.models.listing_tag import listing_tags


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(Integer, ForeignKey("buildings.id", ondelete="RESTRICT"), nullable=False, index=True)
    code = Column(String, nullable=False, index=True)
    price = Column(Numeric(15, 2), nullable=False, index=True)
    area = Column(Float, nullable=False)
    bedrooms = Column(Integer, nullable=True)
    bathrooms = Column(Integer, nullable=True)
    floor = Column(Integer, nullable=True)
    direction = Column(String, nullable=True)
    status = Column(String, nullable=False, default="available", index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), nullable=True)

    building = relationship("Building", back_populates="listings")
    images = relationship("ListingImage", back_populates="listing", cascade="all, delete-orphan")
    tags = relationship("Tag", secondary=listing_tags, back_populates="listings")

    @property
    def building_name(self) -> str:
        return self.building.name if self.building else ""
