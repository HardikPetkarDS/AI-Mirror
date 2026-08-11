from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import ProductOut, ProductFilterParams, AffiliateClickCreate
from app.services.product_service import ProductService
from app.models.models import AffiliateClick, User
from app.services.auth_service import get_current_user

router = APIRouter()

@router.get("", response_model=List[ProductOut])
def list_products(
    query: Optional[str] = None,
    retailer: Optional[str] = None,
    brand: Optional[str] = None,
    category: Optional[str] = None,
    gender: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    fit_type: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db)
):
    service = ProductService(db)
    params = ProductFilterParams(
        query=query,
        retailer=retailer,
        brand=brand,
        category=category,
        gender=gender,
        min_price=min_price,
        max_price=max_price,
        fit_type=fit_type
    )
    return service.get_products(params, limit, offset)

@router.get("/categories", response_model=List[str])
def list_categories(db: Session = Depends(get_db)):
    service = ProductService(db)
    return service.get_categories()

@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    service = ProductService(db)
    product = service.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    return product

@router.post("/affiliate-click", status_code=201)
def track_affiliate_click(
    payload: AffiliateClickCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    service = ProductService(db)
    product = service.get_product(payload.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    
    click = AffiliateClick(
        user_id=current_user.id if current_user else None,
        product_id=product.id,
        retailer=product.retailer
    )
    db.add(click)
    db.commit()
    return {"status": "tracked", "redirect_url": product.affiliate_url}
