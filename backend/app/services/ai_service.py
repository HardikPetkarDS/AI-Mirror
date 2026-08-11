import sys
from pathlib import Path
root_dir = Path(__file__).resolve().parent.parent.parent.parent
if str(root_dir) not in sys.path:
    sys.path.insert(0, str(root_dir))

from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from ai.pose.pose_detector import MediaPipePoseEstimator
from ai.body_analysis.body_measurer import LandmarkBodyMeasurer
from ai.virtual_try_on.try_on_provider import ConfigurableNeuralVTONProvider
from ai.size_recommendation.size_engine import SizeRecommendationEngine
from app.models.models import Product, FitFeedback, TryOnSession, UserProfile
from app.core.config import settings

class AIService:
    def __init__(self):
        self.pose_estimator = MediaPipePoseEstimator()
        self.body_measurer = LandmarkBodyMeasurer()
        self.vton_provider = ConfigurableNeuralVTONProvider(
            api_key=settings.VIRTUAL_TRYON_API_KEY,
            provider_name=settings.VIRTUAL_TRYON_PROVIDER
        )
        self.size_engine = SizeRecommendationEngine()

    def analyze_body(self, image_base64: Optional[str] = None, user_height_cm: float = 172.0) -> Dict[str, Any]:
        pose_res = self.pose_estimator.estimate_pose(image_base64)
        meas_res = self.body_measurer.estimate_measurements(pose_res, user_height_cm)
        meas_res["guidance_message"] = pose_res.get("guidance_message", "Good lighting. Full body detected.")
        return meas_res

    def recommend_size(
        self,
        db: Session,
        product: Product,
        chest_cm: float = 100.0,
        shoulder_cm: float = 46.5,
        waist_cm: float = 84.0,
        height_cm: float = 172.0,
        confidence: float = 0.90,
        fit_preference: str = "Regular Fit",
        user_id: Optional[int] = None
    ) -> Dict[str, Any]:
        
        # Convert product size charts
        sc_list = [
            {
                "size_label": sc.size_label,
                "chest_min": sc.chest_min,
                "chest_max": sc.chest_max,
                "shoulder_min": sc.shoulder_min,
                "shoulder_max": sc.shoulder_max,
                "waist_min": sc.waist_min,
                "waist_max": sc.waist_max,
                "length_cm": sc.length_cm
            }
            for sc in product.size_charts
        ]

        # Fetch past fit feedback for user if present
        user_feedback = []
        if user_id:
            feedbacks = db.query(FitFeedback).filter(FitFeedback.user_id == user_id).all()
            user_feedback = [
                {
                    "brand": fb.brand,
                    "category": fb.category,
                    "selected_size": fb.selected_size,
                    "feedback": fb.feedback
                } for fb in feedbacks
            ]

        return self.size_engine.calculate_recommendation(
            chest_cm=chest_cm,
            shoulder_cm=shoulder_cm,
            waist_cm=waist_cm,
            height_cm=height_cm,
            confidence=confidence,
            size_charts=sc_list,
            category=product.category,
            brand=product.brand,
            fit_preference=fit_preference,
            user_fit_feedback=user_feedback
        )

    def generate_try_on(
        self,
        db: Session,
        product: Product,
        user_image_base64: str,
        selected_size: str = "M",
        user_id: Optional[int] = None
    ) -> Dict[str, Any]:
        pose_res = self.pose_estimator.estimate_pose(user_image_base64)
        garment_img_url = product.images[0] if product.images else ""
        
        vton_res = self.vton_provider.generate_try_on(
            user_image_base64=user_image_base64,
            garment_image_url=garment_img_url,
            category=product.category,
            pose_data=pose_res
        )

        # Log session in DB
        session = TryOnSession(
            user_id=user_id,
            product_id=product.id,
            result_image_url=vton_res["result_image_url"],
            confidence_score=vton_res["confidence_score"],
            model_name=vton_res["model_name"],
            processing_time_ms=vton_res["processing_time_ms"]
        )
        db.add(session)
        db.commit()
        db.refresh(session)

        return {
            "try_on_session_id": session.id,
            "result_image_url": vton_res["result_image_url"],
            "confidence_score": vton_res["confidence_score"],
            "model_name": vton_res["model_name"],
            "processing_time_ms": vton_res["processing_time_ms"],
            "message": "Virtual try-on generated successfully."
        }
