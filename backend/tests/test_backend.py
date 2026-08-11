import pytest
from fastapi.testclient import TestClient
from app.main import app
from database.seed_db import seed_database

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_db():
    seed_database()

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "api_v1" in data

def test_product_list_and_search():
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    products = response.json()
    assert len(products) > 0

    # Search query
    search_res = client.get("/api/v1/products?query=black")
    assert search_res.status_code == 200
    assert len(search_res.json()) > 0

    # Category filter
    cat_res = client.get("/api/v1/products?category=T-shirts")
    assert cat_res.status_code == 200
    assert len(cat_res.json()) > 0

def test_categories_endpoint():
    response = client.get("/api/v1/products/categories")
    assert response.status_code == 200
    categories = response.json()
    assert "T-shirts" in categories or len(categories) > 0

def test_product_detail_endpoint():
    response = client.get("/api/v1/products/1")
    assert response.status_code == 200
    product = response.json()
    assert product["id"] == 1
    assert "size_charts" in product

def test_body_analysis_endpoint():
    payload = {
        "user_height_cm": 175.0
    }
    response = client.post("/api/v1/body-analysis", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "estimated_shoulder_cm" in data
    assert "estimated_chest_cm" in data
    assert data["overall_confidence"] > 0

def test_size_recommendation_endpoint():
    response = client.get(
        "/api/v1/size-recommendation/1?chest_cm=100.0&shoulder_cm=46.5&waist_cm=84.0&fit_preference=Regular%20Fit"
    )
    assert response.status_code == 200
    data = response.json()
    assert "recommended_size" in data
    assert "confidence_percentage" in data
    assert data["confidence_percentage"] >= 70

def test_auth_and_feedback_flow():
    # Register user
    reg_payload = {
        "email": "tester@aimirror.com",
        "password": "testpassword123",
        "name": "Test User"
    }
    reg_res = client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_res.status_code in [201, 400] # 201 created or 400 if exists

    # Login user
    login_payload = {
        "email": "tester@aimirror.com",
        "password": "testpassword123"
    }
    login_res = client.post("/api/v1/auth/login", json=login_payload)
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]

    headers = {"Authorization": f"Bearer {token}"}

    # Submit fit feedback
    fb_payload = {
        "product_id": 1,
        "selected_size": "M",
        "feedback": "too_tight"
    }
    fb_res = client.post("/api/v1/fit-feedback", json=fb_payload, headers=headers)
    assert fb_res.status_code == 201

def test_try_on_endpoint():
    payload = {
        "product_id": 1,
        "user_image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...",
        "selected_size": "M"
    }
    response = client.post("/api/v1/try-on", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "result_image_url" in data
    assert data["confidence_score"] > 0.8
