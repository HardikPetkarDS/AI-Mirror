from fastapi import APIRouter
from app.api.v1.endpoints import auth, products, tryon, user, outfits

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(tryon.router, tags=["ai-tryon"])
api_router.include_router(user.router, prefix="/user", tags=["user"])
api_router.include_router(outfits.router, prefix="/outfits", tags=["outfits"])
