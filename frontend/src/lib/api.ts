import { Product, BodyAnalysisResponse, TryOnResponse, SizeRecommendationResponse, UserProfile, SavedOutfit } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function fetchProducts(params: {
  query?: string;
  retailer?: string;
  brand?: string;
  category?: string;
  gender?: string;
  fit_type?: string;
  min_price?: number;
  max_price?: number;
}): Promise<Product[]> {
  const url = new URL(`${API_BASE_URL}/products`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value));
    }
  });

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  const res = await fetch(`${API_BASE_URL}/products/categories`);
  if (!res.ok) return ['T-shirts', 'Shirts', 'Jackets', 'Dresses', 'Jeans', 'Trousers', 'Shoes'];
  return res.json();
}

export async function fetchProductById(id: number): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
}

export async function analyzeBody(image_base64?: string, user_height_cm: number = 172): Promise<BodyAnalysisResponse> {
  const res = await fetch(`${API_BASE_URL}/body-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_base64, user_height_cm }),
  });
  if (!res.ok) throw new Error('Body analysis failed');
  return res.json();
}

export async function getSizeRecommendation(
  productId: number,
  params: {
    chest_cm?: number;
    shoulder_cm?: number;
    waist_cm?: number;
    height_cm?: number;
    confidence?: number;
    fit_preference?: string;
  }
): Promise<SizeRecommendationResponse> {
  const url = new URL(`${API_BASE_URL}/size-recommendation/${productId}`);
  url.searchParams.append('chest_cm', String(params.chest_cm || 100.0));
  url.searchParams.append('shoulder_cm', String(params.shoulder_cm || 46.5));
  url.searchParams.append('waist_cm', String(params.waist_cm || 84.0));
  url.searchParams.append('height_cm', String(params.height_cm || 172.0));
  url.searchParams.append('confidence', String(params.confidence || 0.90));
  url.searchParams.append('fit_preference', params.fit_preference || 'Regular Fit');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Size recommendation failed');
  return res.json();
}

export async function generateVirtualTryOn(
  productId: number,
  user_image_base64: string,
  selected_size: string = 'M'
): Promise<TryOnResponse> {
  const res = await fetch(`${API_BASE_URL}/try-on`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_id: productId,
      user_image_base64,
      selected_size,
    }),
  });
  if (!res.ok) throw new Error('Virtual try-on failed');
  return res.json();
}

export async function submitFitFeedback(productId: number, selected_size: string, feedback: string, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/fit-feedback`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      product_id: productId,
      selected_size,
      feedback,
    }),
  });
  return res.ok;
}

export async function trackAffiliateClick(productId: number): Promise<string> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/affiliate-click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.redirect_url;
    }
  } catch (e) {
    console.error(e);
  }
  return '#';
}

export async function fetchOutfitRecommendations(productId: number): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/outfits/recommend/${productId}`);
  if (!res.ok) return [];
  return res.json();
}
