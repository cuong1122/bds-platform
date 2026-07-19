from fastapi import APIRouter

from app.api.v1.endpoints import (
    listings, buildings, tracking, favorites, inquiries,
    admin, auth, admin_buildings, admin_listings,
)

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(auth.router)
api_router.include_router(listings.router)
api_router.include_router(buildings.router)
api_router.include_router(tracking.router)
api_router.include_router(favorites.router)
api_router.include_router(inquiries.router)
api_router.include_router(admin.router)
api_router.include_router(admin_buildings.router)
api_router.include_router(admin_listings.router)
