from app.db.session import SessionLocal
from app.models.building import Building
from app.models.listing import Listing
from app.models.listing_image import ListingImage
from app.models.tag import Tag

db = SessionLocal()

buildings_data = [
    {"name": "Tòa A", "address": "123 Đường ABC, Đà Nẵng", "lat": 16.0544, "lng": 108.2208},
    {"name": "Tòa B", "address": "456 Đường XYZ, Đà Nẵng", "lat": 16.0600, "lng": 108.2250},
    {"name": "Tòa C", "address": "789 Đường DEF, Đà Nẵng", "lat": 16.0500, "lng": 108.2150},
]

buildings = []
for b in buildings_data:
    building = Building(**b)
    db.add(building)
    buildings.append(building)

db.commit()

statuses = ["available", "reserved", "sold"]
for idx, building in enumerate(buildings):
    for i in range(1, 8):
        listing = Listing(
            building_id=building.id,
            code=f"{chr(65+idx)}{100+i}",
            price=2_000_000_000 + i * 150_000_000,
            area=60 + i * 5,
            bedrooms=2 if i % 2 == 0 else 3,
            bathrooms=2,
            floor=i,
            direction="southeast",
            status=statuses[i % 3],
            description=f"Căn hộ {chr(65+idx)}{100+i} view đẹp, thoáng mát",
        )
        db.add(listing)
        db.flush()
        db.add(ListingImage(
            listing_id=listing.id,
            url="https://placehold.co/800x600",
            order=0,
            is_cover=True,
        ))

db.commit()
db.close()
print("Seed data thành công!")
