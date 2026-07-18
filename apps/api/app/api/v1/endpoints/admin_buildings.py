from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.db.session import get_db
from app.api.deps import get_current_admin
from app.models.user import User
from app.models.building import Building
from app.schemas.building_admin import BuildingAdminOut, BuildingCreate, BuildingUpdate

router = APIRouter(prefix="/admin/buildings", tags=["admin-buildings"])


@router.get("", response_model=list[BuildingAdminOut])
def list_buildings(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    return db.query(Building).order_by(Building.created_at.desc()).all()


@router.post("", response_model=BuildingAdminOut, status_code=201)
def create_building(
    payload: BuildingCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    building = Building(**payload.model_dump())
    db.add(building)
    db.commit()
    db.refresh(building)
    return building


@router.put("/{building_id}", response_model=BuildingAdminOut)
def update_building(
    building_id: int,
    payload: BuildingUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    building = db.query(Building).filter(Building.id == building_id).first()
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(building, field, value)

    db.commit()
    db.refresh(building)
    return building


@router.delete("/{building_id}", status_code=204)
def delete_building(
    building_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    building = db.query(Building).filter(Building.id == building_id).first()
    if not building:
        raise HTTPException(status_code=404, detail="Building not found")

    db.delete(building)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Không thể xóa tòa nhà này vì vẫn còn căn hộ thuộc tòa. Vui lòng xóa hoặc chuyển các căn hộ trước.",
        )
    return None
