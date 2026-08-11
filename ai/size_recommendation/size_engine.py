from typing import List, Dict, Any, Optional

class SizeRecommendationEngine:
    """
    Multi-factor AI Size Recommendation Engine.
    Evaluates body measurements against retailer size charts, user fit preferences,
    garment category rules, and historical user fit feedback.
    """
    def calculate_recommendation(
        self,
        chest_cm: float,
        shoulder_cm: float,
        waist_cm: float,
        height_cm: float,
        confidence: float,
        size_charts: List[Dict[str, Any]],
        category: str,
        brand: str,
        fit_preference: str = "Regular Fit",
        user_fit_feedback: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        
        if not size_charts:
            # Fallback size recommendation if size chart is missing
            return {
                "recommended_size": "M",
                "confidence_percentage": 75,
                "fit_type": fit_preference,
                "explanation": "Standard size recommended as product size chart is pending verification.",
                "fit_breakdown": {
                    "shoulder": "Good",
                    "chest": "Good",
                    "waist": "Good",
                    "length": "Regular"
                },
                "alternative_sizes": [{"size": "L", "reason": "Choose for a looser fit"}]
            }

        # Apply fit preference adjustment offsets to measurements
        adj_chest = chest_cm
        adj_shoulder = shoulder_cm
        adj_waist = waist_cm

        if fit_preference == "Slim Fit":
            adj_chest += 2.0
            adj_shoulder += 1.0
            adj_waist += 2.0
        elif fit_preference == "Relaxed Fit":
            adj_chest -= 3.0
            adj_shoulder -= 1.5
            adj_waist -= 3.0
        elif fit_preference == "Oversized":
            adj_chest -= 5.0
            adj_shoulder -= 2.5
            adj_waist -= 5.0

        # Apply historical feedback adjustment for this brand/category
        feedback_offset = 0
        if user_fit_feedback:
            relevant = [
                fb for fb in user_fit_feedback 
                if fb.get("brand", "").lower() == brand.lower() or fb.get("category", "").lower() == category.lower()
            ]
            for fb in relevant:
                if fb.get("feedback") == "too_tight":
                    feedback_offset += 1 # Upsize suggestion
                elif fb.get("feedback") == "too_loose":
                    feedback_offset -= 1 # Downsize suggestion

        # Match size charts
        size_scores = {}
        for sc in size_charts:
            size_label = sc["size_label"]
            score = 0.0
            total_weights = 0.0

            # Chest score
            if sc.get("chest_min") is not None and sc.get("chest_max") is not None:
                c_min, c_max = sc["chest_min"], sc["chest_max"]
                c_mid = (c_min + c_max) / 2.0
                diff = abs(adj_chest - c_mid)
                c_score = max(0.0, 100.0 - (diff * 8.0))
                score += c_score * 0.45
                total_weights += 0.45

            # Shoulder score
            if sc.get("shoulder_min") is not None and sc.get("shoulder_max") is not None:
                s_min, s_max = sc["shoulder_min"], sc["shoulder_max"]
                s_mid = (s_min + s_max) / 2.0
                diff = abs(adj_shoulder - s_mid)
                s_score = max(0.0, 100.0 - (diff * 12.0))
                score += s_score * 0.35
                total_weights += 0.35

            # Waist score
            if sc.get("waist_min") is not None and sc.get("waist_max") is not None:
                w_min, w_max = sc["waist_min"], sc["waist_max"]
                w_mid = (w_min + w_max) / 2.0
                diff = abs(adj_waist - w_mid)
                w_score = max(0.0, 100.0 - (diff * 8.0))
                score += w_score * 0.20
                total_weights += 0.20

            final_size_score = (score / total_weights) if total_weights > 0 else 70.0
            size_scores[size_label] = final_size_score

        # Sort sizes by score
        sorted_sizes = sorted(size_scores.items(), key=lambda item: item[1], reverse=True)
        best_size, best_score = sorted_sizes[0]

        # Handle feedback index shifting
        size_labels = [sc["size_label"] for sc in size_charts]
        if feedback_offset != 0 and best_size in size_labels:
            curr_idx = size_labels.index(best_size)
            new_idx = max(0, min(len(size_labels) - 1, curr_idx + feedback_offset))
            best_size = size_labels[new_idx]

        # Calculate final confidence percentage
        final_conf = int(min(98, max(70, best_score * confidence)))

        # Build detailed fit breakdown for the recommended size
        rec_chart = next((sc for sc in size_charts if sc["size_label"] == best_size), size_charts[0])
        
        shoulder_eval = "Good"
        if rec_chart.get("shoulder_min") and shoulder_cm < rec_chart["shoulder_min"]:
            shoulder_eval = "Relaxed fit on shoulders"
        elif rec_chart.get("shoulder_max") and shoulder_cm > rec_chart["shoulder_max"]:
            shoulder_eval = "Slightly snug on shoulders"
        else:
            shoulder_eval = "Perfect fit on shoulders"

        chest_eval = "Perfect"
        if rec_chart.get("chest_min") and chest_cm < rec_chart["chest_min"]:
            chest_eval = "Slightly relaxed"
        elif rec_chart.get("chest_max") and chest_cm > rec_chart["chest_max"]:
            chest_eval = "Tailored snug"

        length_eval = "Slightly relaxed" if height_cm < 170.0 else "Ideal length"

        explanation = f"Your estimated chest ({chest_cm}cm) and shoulder ({shoulder_cm}cm) measurements align most closely with {brand}'s size {best_size}."
        if feedback_offset > 0:
            explanation += f" Adjusted up to size {best_size} based on your past feedback that {brand} runs tight."
        elif feedback_offset < 0:
            explanation += f" Adjusted down to size {best_size} based on your past feedback that {brand} runs loose."

        # Alternatives
        alternatives = []
        for size_lbl, sc_score in sorted_sizes[1:3]:
            if size_lbl != best_size:
                reason = "More relaxed fit" if size_labels.index(size_lbl) > size_labels.index(best_size) else "More fitted silhouette"
                alternatives.append({"size": size_lbl, "reason": reason})

        return {
            "recommended_size": best_size,
            "confidence_percentage": final_conf,
            "fit_type": fit_preference,
            "explanation": explanation,
            "fit_breakdown": {
                "shoulder": shoulder_eval,
                "chest": chest_eval,
                "waist": "Comfortable",
                "length": length_eval
            },
            "alternative_sizes": alternatives
        }
