export interface SizeChart {
  id: number;
  size_label: string;
  chest_min?: number;
  chest_max?: number;
  waist_min?: number;
  waist_max?: number;
  shoulder_min?: number;
  shoulder_max?: number;
  length_cm?: number;
}

export interface Product {
  id: number;
  external_id: string;
  retailer: string;
  brand: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  gender: string;
  price: number;
  currency: string;
  discount: number;
  images: string[];
  tryOnAsset?: string; // Clean transparent PNG/SVG garment asset for live AR try-on
  product_url: string;
  affiliate_url: string;
  available_sizes: string[];
  colors?: string[];
  fit_type: string;
  material?: string;
  rating: number;
  size_charts?: SizeChart[];
}

export interface FitBreakdown {
  shoulder: string;
  chest: string;
  waist: string;
  length: string;
}

export interface AlternativeSize {
  size: string;
  reason: string;
}

export interface SizeRecommendationResponse {
  recommended_size: string;
  confidence_percentage: number;
  fit_type: string;
  explanation: string;
  fit_breakdown: FitBreakdown;
  alternative_sizes: AlternativeSize[];
}

export interface BodyAnalysisResponse {
  estimated_shoulder_cm: number;
  estimated_chest_cm: number;
  estimated_waist_cm: number;
  estimated_height_cm: number;
  overall_confidence: number;
  guidance_message: string;
}

export interface TryOnResponse {
  try_on_session_id: number;
  result_image_url: string;
  confidence_score: number;
  model_name: string;
  processing_time_ms: number;
  message: string;
}

export interface UserProfile {
  id: number;
  user_id: number;
  height_cm: number;
  weight_kg?: number;
  usual_size: string;
  preferred_fit: string;
  chest_cm?: number;
  waist_cm?: number;
  shoulder_cm?: number;
  updated_at: string;
}

export interface SavedOutfit {
  id: number;
  user_id: number;
  title: string;
  product_ids: number[];
  total_price: number;
  products?: Product[];
  created_at: string;
}
