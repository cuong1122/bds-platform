from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.db.session import Base


class ListingImage(Base):
    __tablename__ = "listing_images"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id", ondelete="CASCADE"), nullable=False, index=True)
    url = Column(String, nullable=False)
    order = Column(Integer, nullable=False, default=0)
    is_cover = Column(Boolean, default=False)
    caption = Column(String, nullable=True)

    listing = relationship("Listing", back_populates="images")
