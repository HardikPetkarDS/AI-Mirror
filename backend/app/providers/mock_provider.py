from typing import List, Optional, Dict, Any
from app.providers.base import ProductProvider
from app.schemas.schemas import ProductFilterParams

MOCK_CATALOG: List[Dict[str, Any]] = [
    # --- T-SHIRTS ---
    {
        "external_id": "MYN-TSH-001",
        "retailer": "Myntra",
        "brand": "Roadster",
        "name": "Men Black Solid Oversized T-Shirt",
        "description": "Pure cotton heavy drop-shoulder oversized t-shirt with classic crew neck.",
        "category": "T-shirts",
        "subcategory": "Oversized",
        "gender": "Men",
        "price": 799.0,
        "currency": "INR",
        "discount": 35.0,
        "images": [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop"
        ],
        "product_url": "https://www.myntra.com/tshirts/roadster/men-black-oversized/1001",
        "affiliate_url": "https://myntra.com/aff/aimirror/1001",
        "available_sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["Black"],
        "fit_type": "Oversized",
        "material": "100% Cotton",
        "rating": 4.6,
        "size_charts": [
            {"size_label": "S", "chest_min": 92.0, "chest_max": 96.0, "shoulder_min": 44.0, "shoulder_max": 46.0, "waist_min": 78.0, "waist_max": 82.0, "length_cm": 70.0},
            {"size_label": "M", "chest_min": 98.0, "chest_max": 103.0, "shoulder_min": 46.5, "shoulder_max": 48.5, "waist_min": 84.0, "waist_max": 88.0, "length_cm": 72.0},
            {"size_label": "L", "chest_min": 104.0, "chest_max": 109.0, "shoulder_min": 49.0, "shoulder_max": 51.0, "waist_min": 90.0, "waist_max": 94.0, "length_cm": 74.0},
            {"size_label": "XL", "chest_min": 110.0, "chest_max": 116.0, "shoulder_min": 51.5, "shoulder_max": 53.5, "waist_min": 96.0, "waist_max": 102.0, "length_cm": 76.0},
            {"size_label": "XXL", "chest_min": 117.0, "chest_max": 124.0, "shoulder_min": 54.0, "shoulder_max": 56.5, "waist_min": 104.0, "waist_max": 110.0, "length_cm": 78.0}
        ]
    },
    {
        "external_id": "ZAR-TSH-002",
        "retailer": "Zara",
        "brand": "Zara",
        "name": "Heavyweight Textured White Tee",
        "description": "Minimalist premium cotton white tee featuring structured silhouette.",
        "category": "T-shirts",
        "subcategory": "Crew Neck",
        "gender": "Unisex",
        "price": 1490.0,
        "currency": "INR",
        "discount": 10.0,
        "images": [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop"
        ],
        "product_url": "https://www.zara.com/in/en/heavyweight-textured-white-tee-p1002",
        "affiliate_url": "https://zara.com/aff/aimirror/1002",
        "available_sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["White"],
        "fit_type": "Regular Fit",
        "material": "100% Organic Cotton",
        "rating": 4.8,
        "size_charts": [
            {"size_label": "XS", "chest_min": 86.0, "chest_max": 90.0, "shoulder_min": 42.0, "shoulder_max": 43.5, "waist_min": 72.0, "waist_max": 76.0, "length_cm": 67.0},
            {"size_label": "S", "chest_min": 92.0, "chest_max": 96.0, "shoulder_min": 44.0, "shoulder_max": 45.5, "waist_min": 78.0, "waist_max": 82.0, "length_cm": 69.0},
            {"size_label": "M", "chest_min": 98.0, "chest_max": 102.0, "shoulder_min": 46.0, "shoulder_max": 47.5, "waist_min": 84.0, "waist_max": 88.0, "length_cm": 71.0},
            {"size_label": "L", "chest_min": 104.0, "chest_max": 108.0, "shoulder_min": 48.0, "shoulder_max": 49.5, "waist_min": 90.0, "waist_max": 94.0, "length_cm": 73.0},
            {"size_label": "XL", "chest_min": 110.0, "chest_max": 115.0, "shoulder_min": 50.0, "shoulder_max": 52.0, "waist_min": 96.0, "waist_max": 100.0, "length_cm": 75.0}
        ]
    },
    {
        "external_id": "HM-TSH-003",
        "retailer": "H&M",
        "brand": "H&M",
        "name": "Graphic Sage Green Vintage Tee",
        "description": "Washed jersey fabric with subtle chest artwork and relaxed shoulders.",
        "category": "T-shirts",
        "subcategory": "Graphic",
        "gender": "Men",
        "price": 999.0,
        "currency": "INR",
        "discount": 20.0,
        "images": [
            "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&auto=format&fit=crop"
        ],
        "product_url": "https://www2.hm.com/en_in/productpage.1003.html",
        "affiliate_url": "https://hm.com/aff/aimirror/1003",
        "available_sizes": ["S", "M", "L", "XL"],
        "colors": ["Sage Green"],
        "fit_type": "Relaxed Fit",
        "material": "100% Cotton",
        "rating": 4.4,
        "size_charts": [
            {"size_label": "S", "chest_min": 90.0, "chest_max": 95.0, "shoulder_min": 43.0, "shoulder_max": 45.0, "waist_min": 76.0, "waist_max": 80.0, "length_cm": 68.0},
            {"size_label": "M", "chest_min": 96.0, "chest_max": 101.0, "shoulder_min": 45.5, "shoulder_max": 47.5, "waist_min": 82.0, "waist_max": 86.0, "length_cm": 70.0},
            {"size_label": "L", "chest_min": 102.0, "chest_max": 107.0, "shoulder_min": 48.0, "shoulder_max": 50.0, "waist_min": 88.0, "waist_max": 93.0, "length_cm": 72.0},
            {"size_label": "XL", "chest_min": 108.0, "chest_max": 114.0, "shoulder_min": 50.5, "shoulder_max": 53.0, "waist_min": 94.0, "waist_max": 100.0, "length_cm": 74.0}
        ]
    },
    # --- SHIRTS ---
    {
        "external_id": "AJI-SHI-004",
        "retailer": "AJIO",
        "brand": "Netplay",
        "name": "Men Slim Fit Linen Casual Shirt",
        "description": "Breathable pure linen button-down shirt ideal for summer layering.",
        "category": "Shirts",
        "subcategory": "Casual Shirts",
        "gender": "Men",
        "price": 1299.0,
        "currency": "INR",
        "discount": 40.0,
        "images": [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop"
        ],
        "product_url": "https://www.ajio.com/netplay-linen-casual-shirt/p/1004",
        "affiliate_url": "https://ajio.com/aff/aimirror/1004",
        "available_sizes": ["38", "40", "42", "44"],
        "colors": ["Sky Blue", "White"],
        "fit_type": "Slim Fit",
        "material": "100% Linen",
        "rating": 4.5,
        "size_charts": [
            {"size_label": "38", "chest_min": 94.0, "chest_max": 98.0, "shoulder_min": 43.0, "shoulder_max": 44.5, "waist_min": 80.0, "waist_max": 84.0, "length_cm": 73.0},
            {"size_label": "40", "chest_min": 99.0, "chest_max": 103.0, "shoulder_min": 45.0, "shoulder_max": 46.5, "waist_min": 85.0, "waist_max": 89.0, "length_cm": 75.0},
            {"size_label": "42", "chest_min": 104.0, "chest_max": 108.0, "shoulder_min": 47.0, "shoulder_max": 48.5, "waist_min": 90.0, "waist_max": 94.0, "length_cm": 77.0},
            {"size_label": "44", "chest_min": 109.0, "chest_max": 114.0, "shoulder_min": 49.0, "shoulder_max": 51.0, "waist_min": 95.0, "waist_max": 100.0, "length_cm": 79.0}
        ]
    },
    {
        "external_id": "AMZ-SHI-005",
        "retailer": "Amazon Fashion",
        "brand": "Symbol Premium",
        "name": "Classic White Formal Cotton Shirt",
        "description": "Wrinkle-resistant twill weave formal dress shirt with stiff collar.",
        "category": "Shirts",
        "subcategory": "Formal Shirts",
        "gender": "Men",
        "price": 1099.0,
        "currency": "INR",
        "discount": 15.0,
        "images": [
            "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop"
        ],
        "product_url": "https://www.amazon.in/dp/B005AMZ1005",
        "affiliate_url": "https://amazon.in/aff/aimirror/1005",
        "available_sizes": ["S", "M", "L", "XL"],
        "colors": ["White"],
        "fit_type": "Regular Fit",
        "material": "100% Egyptian Cotton",
        "rating": 4.3,
        "size_charts": [
            {"size_label": "S", "chest_min": 92.0, "chest_max": 96.0, "shoulder_min": 43.5, "shoulder_max": 45.0, "waist_min": 78.0, "waist_max": 82.0, "length_cm": 74.0},
            {"size_label": "M", "chest_min": 98.0, "chest_max": 102.0, "shoulder_min": 45.5, "shoulder_max": 47.0, "waist_min": 84.0, "waist_max": 88.0, "length_cm": 76.0},
            {"size_label": "L", "chest_min": 104.0, "chest_max": 108.0, "shoulder_min": 47.5, "shoulder_max": 49.0, "waist_min": 90.0, "waist_max": 95.0, "length_cm": 78.0},
            {"size_label": "XL", "chest_min": 110.0, "chest_max": 115.0, "shoulder_min": 49.5, "shoulder_max": 51.5, "waist_min": 96.0, "waist_max": 102.0, "length_cm": 80.0}
        ]
    },
    # --- JACKETS ---
    {
        "external_id": "MYN-JKT-006",
        "retailer": "Myntra",
        "brand": "Levis",
        "name": "Men Trucker Denim Jacket",
        "description": "Authentic indigo washed denim trucker jacket with button closures.",
        "category": "Jackets",
        "subcategory": "Denim",
        "gender": "Men",
        "price": 3499.0,
        "currency": "INR",
        "discount": 30.0,
        "images": [
            "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop"
        ],
        "product_url": "https://www.myntra.com/jackets/levis/trucker-denim/1006",
        "affiliate_url": "https://myntra.com/aff/aimirror/1006",
        "available_sizes": ["S", "M", "L", "XL"],
        "colors": ["Indigo Blue"],
        "fit_type": "Regular Fit",
        "material": "99% Cotton, 1% Elastane",
        "rating": 4.9,
        "size_charts": [
            {"size_label": "S", "chest_min": 94.0, "chest_max": 99.0, "shoulder_min": 44.0, "shoulder_max": 46.0, "waist_min": 80.0, "waist_max": 85.0, "length_cm": 64.0},
            {"size_label": "M", "chest_min": 100.0, "chest_max": 105.0, "shoulder_min": 46.5, "shoulder_max": 48.5, "waist_min": 86.0, "waist_max": 91.0, "length_cm": 66.0},
            {"size_label": "L", "chest_min": 106.0, "chest_max": 111.0, "shoulder_min": 49.0, "shoulder_max": 51.0, "waist_min": 92.0, "waist_max": 97.0, "length_cm": 68.0},
            {"size_label": "XL", "chest_min": 112.0, "chest_max": 118.0, "shoulder_min": 51.5, "shoulder_max": 54.0, "waist_min": 98.0, "waist_max": 104.0, "length_cm": 70.0}
        ]
    },
    {
        "external_id": "ZAR-JKT-007",
        "retailer": "Zara",
        "brand": "Zara",
        "name": "Matte Faux Leather Biker Jacket",
        "description": "Sleek black biker jacket with asymmetric zip and metallic hardware.",
        "category": "Jackets",
        "subcategory": "Leather",
        "gender": "Men",
        "price": 4990.0,
        "currency": "INR",
        "discount": 0.0,
        "images": [
            "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop"
        ],
        "product_url": "https://www.zara.com/in/en/biker-jacket-p1007",
        "affiliate_url": "https://zara.com/aff/aimirror/1007",
        "available_sizes": ["S", "M", "L", "XL"],
        "colors": ["Black"],
        "fit_type": "Slim Fit",
        "material": "Polyurethane Faux Leather",
        "rating": 4.7,
        "size_charts": [
            {"size_label": "S", "chest_min": 92.0, "chest_max": 96.0, "shoulder_min": 43.0, "shoulder_max": 44.5, "waist_min": 78.0, "waist_max": 82.0, "length_cm": 63.0},
            {"size_label": "M", "chest_min": 98.0, "chest_max": 102.0, "shoulder_min": 45.0, "shoulder_max": 46.5, "waist_min": 84.0, "waist_max": 88.0, "length_cm": 65.0},
            {"size_label": "L", "chest_min": 104.0, "chest_max": 108.0, "shoulder_min": 47.0, "shoulder_max": 48.5, "waist_min": 90.0, "waist_max": 94.0, "length_cm": 67.0},
            {"size_label": "XL", "chest_min": 110.0, "chest_max": 115.0, "shoulder_min": 49.0, "shoulder_max": 51.0, "waist_min": 96.0, "waist_max": 101.0, "length_cm": 69.0}
        ]
    },
    # --- DRESSES ---
    {
        "external_id": "NYK-DRS-008",
        "retailer": "Nykaa Fashion",
        "brand": "Twenty Dresses",
        "name": "Women Floral Print Midi A-Line Dress",
        "description": "Charming floral printed midi dress with puff sleeves and cinched waist.",
        "category": "Dresses",
        "subcategory": "Midi",
        "gender": "Women",
        "price": 1895.0,
        "currency": "INR",
        "discount": 25.0,
        "images": [
            "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop"
        ],
        "product_url": "https://www.nykaafashion.com/twenty-dresses-floral-midi/p/1008",
        "affiliate_url": "https://nykaafashion.com/aff/aimirror/1008",
        "available_sizes": ["XS", "S", "M", "L", "XL"],
        "colors": ["Multicolor Floral"],
        "fit_type": "Regular Fit",
        "material": "Viscose Rayon",
        "rating": 4.7,
        "size_charts": [
            {"size_label": "XS", "chest_min": 80.0, "chest_max": 84.0, "shoulder_min": 35.0, "shoulder_max": 36.5, "waist_min": 64.0, "waist_max": 68.0, "length_cm": 110.0},
            {"size_label": "S", "chest_min": 85.0, "chest_max": 89.0, "shoulder_min": 37.0, "shoulder_max": 38.0, "waist_min": 69.0, "waist_max": 73.0, "length_cm": 112.0},
            {"size_label": "M", "chest_min": 90.0, "chest_max": 94.0, "shoulder_min": 38.5, "shoulder_max": 39.5, "waist_min": 74.0, "waist_max": 78.0, "length_cm": 114.0},
            {"size_label": "L", "chest_min": 95.0, "chest_max": 100.0, "shoulder_min": 40.0, "shoulder_max": 41.5, "waist_min": 79.0, "waist_max": 84.0, "length_cm": 116.0},
            {"size_label": "XL", "chest_min": 101.0, "chest_max": 107.0, "shoulder_min": 42.0, "shoulder_max": 43.5, "waist_min": 85.0, "waist_max": 91.0, "length_cm": 118.0}
        ]
    },
    {
        "external_id": "HM-DRS-009",
        "retailer": "H&M",
        "brand": "H&M",
        "name": "Little Black Ribbed Bodycon Dress",
        "description": "Stretchy ribbed jersey bodycon dress with square neck silhouette.",
        "category": "Dresses",
        "subcategory": "Bodycon",
        "gender": "Women",
        "price": 1299.0,
        "currency": "INR",
        "discount": 10.0,
        "images": [
            "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop"
        ],
        "product_url": "https://www2.hm.com/en_in/productpage.1009.html",
        "affiliate_url": "https://hm.com/aff/aimirror/1009",
        "available_sizes": ["XS", "S", "M", "L"],
        "colors": ["Black"],
        "fit_type": "Slim Fit",
        "material": "95% Cotton, 5% Elastane",
        "rating": 4.5,
        "size_charts": [
            {"size_label": "XS", "chest_min": 78.0, "chest_max": 82.0, "shoulder_min": 34.0, "shoulder_max": 35.5, "waist_min": 60.0, "waist_max": 64.0, "length_cm": 88.0},
            {"size_label": "S", "chest_min": 83.0, "chest_max": 87.0, "shoulder_min": 36.0, "shoulder_max": 37.0, "waist_min": 65.0, "waist_max": 69.0, "length_cm": 90.0},
            {"size_label": "M", "chest_min": 88.0, "chest_max": 92.0, "shoulder_min": 37.5, "shoulder_max": 38.5, "waist_min": 70.0, "waist_max": 74.0, "length_cm": 92.0},
            {"size_label": "L", "chest_min": 93.0, "chest_max": 98.0, "shoulder_min": 39.0, "shoulder_max": 40.5, "waist_min": 75.0, "waist_max": 80.0, "length_cm": 94.0}
        ]
    },
    # --- JEANS & TROUSERS ---
    {
        "external_id": "MYN-JNS-010",
        "retailer": "Myntra",
        "brand": "Levis",
        "name": "Men 511 Slim Fit Blue Jeans",
        "description": "Classic mid-rise dark indigo washed slim stretch denim.",
        "category": "Jeans",
        "subcategory": "Slim Fit",
        "gender": "Men",
        "price": 2899.0,
        "currency": "INR",
        "discount": 20.0,
        "images": [
            "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop"
        ],
        "product_url": "https://www.myntra.com/jeans/levis/511-slim-blue/1010",
        "affiliate_url": "https://myntra.com/aff/aimirror/1010",
        "available_sizes": ["30", "32", "34", "36"],
        "colors": ["Dark Blue"],
        "fit_type": "Slim Fit",
        "material": "98% Cotton, 2% Elastane",
        "rating": 4.8,
        "size_charts": [
            {"size_label": "30", "chest_min": None, "chest_max": None, "shoulder_min": None, "shoulder_max": None, "waist_min": 75.0, "waist_max": 78.0, "length_cm": 102.0},
            {"size_label": "32", "chest_min": None, "chest_max": None, "shoulder_min": None, "shoulder_max": None, "waist_min": 80.0, "waist_max": 83.0, "length_cm": 104.0},
            {"size_label": "34", "chest_min": None, "chest_max": None, "shoulder_min": None, "shoulder_max": None, "waist_min": 85.0, "waist_max": 88.0, "length_cm": 106.0},
            {"size_label": "36", "chest_min": None, "chest_max": None, "shoulder_min": None, "shoulder_max": None, "waist_min": 90.0, "waist_max": 94.0, "length_cm": 108.0}
        ]
    },
    {
        "external_id": "ZAR-TRS-011",
        "retailer": "Zara",
        "brand": "Zara",
        "name": "Pleated Beige Relaxed Chino Trousers",
        "description": "Tailored double-pleated relaxed chino trousers with tapered leg.",
        "category": "Trousers",
        "subcategory": "Chinos",
        "gender": "Men",
        "price": 2990.0,
        "currency": "INR",
        "discount": 0.0,
        "images": [
            "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop"
        ],
        "product_url": "https://www.zara.com/in/en/pleated-chino-p1011",
        "affiliate_url": "https://zara.com/aff/aimirror/1011",
        "available_sizes": ["30", "32", "34", "36"],
        "colors": ["Beige"],
        "fit_type": "Relaxed Fit",
        "material": "100% Cotton Twill",
        "rating": 4.6,
        "size_charts": [
            {"size_label": "30", "chest_min": None, "chest_max": None, "shoulder_min": None, "shoulder_max": None, "waist_min": 76.0, "waist_max": 79.0, "length_cm": 101.0},
            {"size_label": "32", "chest_min": None, "chest_max": None, "shoulder_min": None, "shoulder_max": None, "waist_min": 81.0, "waist_max": 84.0, "length_cm": 103.0},
            {"size_label": "34", "chest_min": None, "chest_max": None, "shoulder_min": None, "shoulder_max": None, "waist_min": 86.0, "waist_max": 89.0, "length_cm": 105.0},
            {"size_label": "36", "chest_min": None, "chest_max": None, "shoulder_min": None, "shoulder_max": None, "waist_min": 91.0, "waist_max": 95.0, "length_cm": 107.0}
        ]
    },
    # --- SHOES ---
    {
        "external_id": "AMZ-SHS-012",
        "retailer": "Amazon Fashion",
        "brand": "Nike",
        "name": "Court Vision Low Leather Sneakers",
        "description": "Retro basketball-inspired white low-top leather sneakers.",
        "category": "Shoes",
        "subcategory": "Sneakers",
        "gender": "Unisex",
        "price": 5495.0,
        "currency": "INR",
        "discount": 15.0,
        "images": [
            "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop"
        ],
        "product_url": "https://www.amazon.in/dp/B005AMZ1012",
        "affiliate_url": "https://amazon.in/aff/aimirror/1012",
        "available_sizes": ["UK 7", "UK 8", "UK 9", "UK 10"],
        "colors": ["Triple White"],
        "fit_type": "Regular Fit",
        "material": "Real & Synthetic Leather",
        "rating": 4.9,
        "size_charts": [
            {"size_label": "UK 7", "chest_min": None, "chest_max": None, "shoulder_min": None, "shoulder_max": None, "waist_min": None, "waist_max": None, "length_cm": 26.0},
            {"size_label": "UK 8", "chest_min": None, "chest_max": None, "shoulder_min": None, "shoulder_max": None, "waist_min": None, "waist_max": None, "length_cm": 27.0},
            {"size_label": "UK 9", "chest_min": None, "chest_max": None, "shoulder_min": None, "shoulder_max": None, "waist_min": None, "waist_max": None, "length_cm": 28.0},
            {"size_label": "UK 10", "chest_min": None, "chest_max": None, "shoulder_min": None, "shoulder_max": None, "waist_min": None, "waist_max": None, "length_cm": 29.0}
        ]
    }
]

# Generate synthetic additional catalog items up to 50 items across brands/categories
BRANDS = ["Roadster", "HRX", "Levis", "Zara", "H&M", "Mango", "Twenty Dresses", "Netplay", "Puma", "Nike", "Adidas"]
RETAILERS = ["Myntra", "Nykaa", "AJIO", "Amazon", "Zara", "H&M"]
CATEGORIES = ["T-shirts", "Shirts", "Jackets", "Dresses", "Jeans", "Trousers", "Shoes"]

for i in range(13, 51):
    cat = CATEGORIES[i % len(CATEGORIES)]
    brand = BRANDS[i % len(BRANDS)]
    ret = RETAILERS[i % len(RETAILERS)]
    MOCK_CATALOG.append({
        "external_id": f"GEN-CAT-{i:03d}",
        "retailer": ret,
        "brand": brand,
        "name": f"{brand} Premium {cat[:-1] if cat.endswith('s') else cat} Edition {i}",
        "description": f"High quality fashion item from {brand} available on {ret}.",
        "category": cat,
        "subcategory": "Casual",
        "gender": "Unisex" if i % 2 == 0 else ("Men" if i % 3 == 0 else "Women"),
        "price": float((i * 180 + 499) % 4500 + 599),
        "currency": "INR",
        "discount": float((i * 5) % 40),
        "images": [
            MOCK_CATALOG[i % len(MOCK_CATALOG[:12])]["images"][0]
        ],
        "product_url": f"https://www.{ret.lower().replace(' ', '')}.com/p/{i}",
        "affiliate_url": f"https://{ret.lower().replace(' ', '')}.com/aff/aimirror/{i}",
        "available_sizes": ["S", "M", "L", "XL"] if cat not in ["Shoes", "Jeans"] else ["30", "32", "34"] if cat == "Jeans" else ["UK 7", "UK 8", "UK 9"],
        "colors": ["Black", "Navy", "White", "Beige"][i % 4: (i % 4) + 1],
        "fit_type": ["Regular Fit", "Slim Fit", "Relaxed Fit", "Oversized"][i % 4],
        "material": "100% Cotton",
        "rating": round(4.0 + (i % 10) * 0.1, 1),
        "size_charts": MOCK_CATALOG[i % len(MOCK_CATALOG[:12])]["size_charts"]
    })

class MockProductProvider(ProductProvider):
    def __init__(self):
        self.catalog = MOCK_CATALOG

    def search_products(self, params: ProductFilterParams, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        results = self.catalog
        if params.query:
            q = params.query.lower()
            results = [
                p for p in results 
                if q in p["name"].lower() or q in p["brand"].lower() or q in p["category"].lower() or q in p["description"].lower()
            ]
        if params.retailer:
            results = [p for p in results if p["retailer"].lower() == params.retailer.lower()]
        if params.brand:
            results = [p for p in results if p["brand"].lower() == params.brand.lower()]
        if params.category:
            results = [p for p in results if p["category"].lower() == params.category.lower()]
        if params.gender:
            results = [p for p in results if p["gender"].lower() in [params.gender.lower(), "unisex"]]
        if params.min_price is not None:
            results = [p for p in results if p["price"] >= params.min_price]
        if params.max_price is not None:
            results = [p for p in results if p["price"] <= params.max_price]
        if params.fit_type:
            results = [p for p in results if p["fit_type"].lower() == params.fit_type.lower()]
            
        return results[offset : offset + limit]

    def get_product(self, product_id: str) -> Optional[Dict[str, Any]]:
        for p in self.catalog:
            if str(p.get("id")) == str(product_id) or p.get("external_id") == product_id:
                return p
        return None

    def get_categories(self) -> List[str]:
        return list(set(p["category"] for p in self.catalog))

    def get_size_chart(self, product_id: str) -> List[Dict[str, Any]]:
        p = self.get_product(product_id)
        if p:
            return p.get("size_charts", [])
        return []
