from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import UserProfileOut, UserProfileBase, ProductOut
from app.models.models import User, UserProfile, SavedProduct, Product
from app.services.auth_service import get_current_user

router = APIRouter()

@router.get("/profile", response_model=UserProfileOut)
def get_user_profile(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated.")
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile

@router.put("/profile", response_model=UserProfileOut)
def update_user_profile(
    payload: UserProfileBase,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated.")
    profile = db.query(UserProfile).filter(UserProfile.user_id == current_user.id).first()
    if not profile:
        profile = UserProfile(user_id=current_user.id)
        db.add(profile)

    for field, val in payload.model_dump(exclude_unset=True).items():
        setattr(profile, field, val)

    db.commit()
    db.refresh(profile)
    return profile

@router.get("/saved-products", response_model=List[ProductOut])
def get_saved_products(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated.")
    saved = db.query(SavedProduct).filter(SavedProduct.user_id == current_user.id).all()
    products = [s.product for s in saved]
    return products

@router.post("/saved-products/{product_id}", status_code=201)
def save_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated.")
    existing = db.query(SavedProduct).filter(
        SavedProduct.user_id == current_user.id,
        SavedProduct.product_id == product_id
    ).first()
    if not existing:
        s = SavedProduct(user_id=current_user.id, product_id=product_id)
        db.add(s)
        db.commit()
    return {"status": "saved"}
