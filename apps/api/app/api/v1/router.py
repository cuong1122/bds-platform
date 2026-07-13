from fastapi import APIRouter

from app.api.v1.endpoints import listings, buildings

api_router = APIRouter(prefix="/api/v1")
api_router.include_router(listings.router)
api_router.include_router(buildings.router)
