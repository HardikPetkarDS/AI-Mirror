from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class BodyMeasurementProvider(ABC):
    @abstractmethod
    def estimate_measurements(self, pose_data: Dict[str, Any], user_height_cm: float = 172.0) -> Dict[str, Any]:
        """Estimate shoulder width, chest girth, and waist in cm with confidence metrics."""
        pass

class LandmarkBodyMeasurer(BodyMeasurementProvider):
    """
    Computes body measurement estimates based on camera posture ratios,
    anatomical scale relative to reference height, and landmark confidence.
    """
    def estimate_measurements(self, pose_data: Dict[str, Any], user_height_cm: float = 172.0) -> Dict[str, Any]:
        keypoints = pose_data.get("keypoints", [])
        
        # Anatomical proportions based on user height
        # Height to shoulder width ratio ~ 0.265
        # Height to chest circumference ratio ~ 0.58
        # Height to waist circumference ratio ~ 0.49
        base_shoulder = user_height_cm * 0.265
        base_chest = user_height_cm * 0.58
        base_waist = user_height_cm * 0.488

        # Adjust based on keypoint ratio if keypoints exist
        confidence = 0.88
        if keypoints and len(keypoints) >= 4:
            left_s = next((k for k in keypoints if k["name"] == "left_shoulder"), None)
            right_s = next((k for k in keypoints if k["name"] == "right_shoulder"), None)
            if left_s and right_s:
                ratio = abs(right_s["x"] - left_s["x"]) / 0.24 # 0.24 normalized standard
                base_shoulder *= max(0.85, min(1.2, ratio))
                base_chest *= max(0.85, min(1.2, ratio))
                base_waist *= max(0.85, min(1.2, ratio))
                confidence = (left_s["confidence"] + right_s["confidence"]) / 2.0

        return {
            "estimated_shoulder_cm": round(base_shoulder, 1),
            "estimated_chest_cm": round(base_chest, 1),
            "estimated_waist_cm": round(base_waist, 1),
            "estimated_height_cm": round(user_height_cm, 1),
            "overall_confidence": round(confidence, 2),
            "measurement_source": "camera_landmark_estimation"
        }
