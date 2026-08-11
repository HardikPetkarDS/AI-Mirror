from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UserOut(BaseModel):
    id: int
    email: EmailStr
    name: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# --- User Profile & Measurements ---
class UserProfileBase(BaseModel):
    height_cm: Optional[float] = 172.0
    weight_kg: Optional[float] = None
    usual_size: Optional[str] = "M"
    preferred_fit: Optional[str] = "Regular Fit"
    chest_cm: Optional[float] = None
    waist_cm: Optional[float] = None
    shoulder_cm: Optional[float] = None

class UserProfileOut(UserProfileBase):
    id: int
    user_id: int
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Product & Size Chart Schemas ---
class SizeChartOut(BaseModel):
    id: int
    size_label: str
    chest_min: Optional[float] = None
    chest_max: Optional[float] = None
    waist_min: Optional[float] = None
    waist_max: Optional[float] = None
    shoulder_min: Optional[float] = None
    shoulder_max: Optional[float] = None
    length_cm: Optional[float] = None

    class Config:
        from_attributes = True

class ProductOut(BaseModel):
    id: int
    external_id: str
    retailer: str
    brand: str
    name: str
    description: Optional[str] = None
    category: str
    subcategory: Optional[str] = None
    gender: str
    price: float
    currency: str
    discount: float
    images: List[str]
    product_url: str
    affiliate_url: str
    available_sizes: List[str]
    colors: Optional[List[str]] = []
    fit_type: str
    material: Optional[str] = None
    rating: float
    size_charts: List[SizeChartOut] = []

    class Config:
        from_attributes = True

class ProductFilterParams(BaseModel):
    query: Optional[str] = None
    retailer: Optional[str] = None
    brand: Optional[str] = None
    category: Optional[str] = None
    gender: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    fit_type: Optional[str] = None

# --- AI & TryOn Schemas ---
class PoseKeypoint(BaseModel):
    name: str
    x: float
    y: float
    confidence: float

class BodyAnalysisRequest(BaseModel):
    image_base64: Optional[str] = None
    user_height_cm: Optional[float] = 172.0
    keypoints: Optional[List[PoseKeypoint]] = []

class BodyAnalysisResponse(BaseModel):
    estimated_shoulder_cm: float
    estimated_chest_cm: float
    estimated_waist_cm: float
    estimated_height_cm: float
    overall_confidence: float
    guidance_message: str

class TryOnRequest(BaseModel):
    product_id: int
    user_image_base64: str
    selected_size: Optional[str] = "M"

class TryOnResponse(BaseModel):
    try_on_session_id: int
    result_image_url: str
    confidence_score: float
    model_name: str
    processing_time_ms: int
    message: str

class FitBreakdown(BaseModel):
    shoulder: str # Good, Tight, Loose, Perfect
    chest: str # Good, Tight, Loose, Perfect
    waist: str # Good, Tight, Loose, Perfect
    length: str # Good, Slightly relaxed, Too short, Perfect

class SizeRecommendationResponse(BaseModel):
    recommended_size: str
    confidence_percentage: int
    fit_type: str
    explanation: str
    fit_breakdown: FitBreakdown
    alternative_sizes: List[Dict[str, str]]

class FitFeedbackCreate(BaseModel):
    product_id: int
    selected_size: str
    feedback: str # too_tight, fits_perfectly, too_loose

class FitFeedbackOut(FitFeedbackCreate):
    id: int
    user_id: int
    brand: str
    category: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- Outfit Schemas ---
class SavedOutfitCreate(BaseModel):
    title: str
    product_ids: List[int]

class SavedOutfitOut(BaseModel):
    id: int
    user_id: int
    title: str
    product_ids: List[int]
    total_price: float
    products: List[ProductOut] = []
    created_at: datetime

    class Config:
        from_attributes = True

class AffiliateClickCreate(BaseModel):
    product_id: int
