from fastapi import APIRouter

from app.api.v1.endpoints import listings, buildings, tracking, favorites

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(listings.router)
api_router.include_router(buildings.router)
api_router.include_router(tracking.router)
api_router.include_router(favorites.router)
