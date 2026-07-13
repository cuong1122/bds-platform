from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.building import Building
from app.schemas.listing import BuildingOut

router = APIRouter(prefix="/buildings", tags=["buildings"])


@router.get("", response_model=list[BuildingOut])
def get_buildings(db: Session = Depends(get_db)):
    return db.query(Building).all()


@router.get("/{building_id}", response_model=BuildingOut)
def get_building_detail(building_id: int, db: Session = Depends(get_db)):
    building = db.query(Building).filter(Building.id == building_id).first()
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")
    return building
