from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import SavedOutfitCreate, SavedOutfitOut, ProductOut
from app.models.models import User, SavedOutfit, Product
from app.services.auth_service import get_current_user
from app.services.product_service import ProductService

router = APIRouter()

@router.get("", response_model=List[SavedOutfitOut])
def get_saved_outfits(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated.")
    outfits = db.query(SavedOutfit).filter(SavedOutfit.user_id == current_user.id).all()
    product_service = ProductService(db)
    
    result = []
    for o in outfits:
        prods = [product_service.get_product(pid) for pid in o.product_ids if product_service.get_product(pid)]
        outfit_out = SavedOutfitOut(
            id=o.id,
            user_id=o.user_id,
            title=o.title,
            product_ids=o.product_ids,
            total_price=o.total_price,
            products=prods,
            created_at=o.created_at
        )
        result.append(outfit_out)
    return result

@router.post("", response_model=SavedOutfitOut, status_code=201)
def create_outfit(
    payload: SavedOutfitCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated.")

    product_service = ProductService(db)
    prods = [product_service.get_product(pid) for pid in payload.product_ids if product_service.get_product(pid)]
    total_price = sum(p.price for p in prods)

    outfit = SavedOutfit(
        user_id=current_user.id,
        title=payload.title,
        product_ids=payload.product_ids,
        total_price=total_price
    )
    db.add(outfit)
    db.commit()
    db.refresh(outfit)

    return SavedOutfitOut(
        id=outfit.id,
        user_id=outfit.user_id,
        title=outfit.title,
        product_ids=outfit.product_ids,
        total_price=outfit.total_price,
        products=prods,
        created_at=outfit.created_at
    )

@router.get("/recommend/{product_id}", response_model=List[ProductOut])
def recommend_outfit_match(product_id: int, db: Session = Depends(get_db)):
    """
    AI Outfit Recommender: 'Complete My Look'.
    Matches tops with bottoms, jackets, and footwear based on category harmony.
    """
    product_service = ProductService(db)
    base_product = product_service.get_product(product_id)
    if not base_product:
        raise HTTPException(status_code=404, detail="Product not found.")

    all_prods = product_service.get_products(limit=50)
    recommendations = []
    
    cat = base_product.category.lower()
    for p in all_prods:
        if p.id == base_product.id:
            continue
        p_cat = p.category.lower()
        if cat in ["t-shirts", "shirts", "tops"]:
            if p_cat in ["jeans", "trousers", "jackets", "shoes"]:
                recommendations.append(p)
        elif cat in ["jeans", "trousers"]:
            if p_cat in ["t-shirts", "shirts", "jackets", "shoes"]:
                recommendations.append(p)
        elif cat in ["jackets"]:
            if p_cat in ["t-shirts", "shirts", "jeans", "trousers"]:
                recommendations.append(p)
        else:
            if p_cat not in [cat]:
                recommendations.append(p)

    return recommendations[:4]
