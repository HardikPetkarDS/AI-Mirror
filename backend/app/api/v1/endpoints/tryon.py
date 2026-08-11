from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import (
    BodyAnalysisRequest, BodyAnalysisResponse,
    TryOnRequest, TryOnResponse,
    SizeRecommendationResponse,
    FitFeedbackCreate, FitFeedbackOut
)
from app.services.ai_service import AIService
from app.services.product_service import ProductService
from app.models.models import User, FitFeedback
from app.services.auth_service import get_current_user

router = APIRouter()
ai_service = AIService()

@router.post("/body-analysis", response_model=BodyAnalysisResponse)
def analyze_body(payload: BodyAnalysisRequest):
    res = ai_service.analyze_body(
        image_base64=payload.image_base64,
        user_height_cm=payload.user_height_cm or 172.0
    )
    return res

@router.post("/try-on", response_model=TryOnResponse)
def generate_try_on(
    payload: TryOnRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    product_service = ProductService(db)
    product = product_service.get_product(payload.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    res = ai_service.generate_try_on(
        db=db,
        product=product,
        user_image_base64=payload.user_image_base64,
        selected_size=payload.selected_size or "M",
        user_id=current_user.id if current_user else None
    )
    return res

@router.get("/size-recommendation/{product_id}", response_model=SizeRecommendationResponse)
def get_size_recommendation(
    product_id: int,
    chest_cm: float = Query(100.0),
    shoulder_cm: float = Query(46.5),
    waist_cm: float = Query(84.0),
    height_cm: float = Query(172.0),
    confidence: float = Query(0.90),
    fit_preference: str = Query("Regular Fit"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    product_service = ProductService(db)
    product = product_service.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    res = ai_service.recommend_size(
        db=db,
        product=product,
        chest_cm=chest_cm,
        shoulder_cm=shoulder_cm,
        waist_cm=waist_cm,
        height_cm=height_cm,
        confidence=confidence,
        fit_preference=fit_preference,
        user_id=current_user.id if current_user else None
    )
    return res

@router.post("/fit-feedback", response_model=FitFeedbackOut, status_code=201)
def submit_fit_feedback(
    payload: FitFeedbackCreate,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Must be logged in to save fit feedback.")

    product_service = ProductService(db)
    product = product_service.get_product(payload.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")

    feedback = FitFeedback(
        user_id=current_user.id,
        product_id=product.id,
        brand=product.brand,
        category=product.category,
        selected_size=payload.selected_size,
        feedback=payload.feedback
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback
