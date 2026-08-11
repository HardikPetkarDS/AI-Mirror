import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    profile = relationship("UserProfile", back_populates="user", uselist=False)
    fit_feedbacks = relationship("FitFeedback", back_populates="user")
    saved_products = relationship("SavedProduct", back_populates="user")
    saved_outfits = relationship("SavedOutfit", back_populates="user")

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    height_cm = Column(Float, default=172.0)
    weight_kg = Column(Float, nullable=True)
    usual_size = Column(String, default="M")
    preferred_fit = Column(String, default="Regular Fit") # Slim Fit, Regular Fit, Relaxed Fit, Oversized
    chest_cm = Column(Float, nullable=True)
    waist_cm = Column(Float, nullable=True)
    shoulder_cm = Column(Float, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="profile")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    external_id = Column(String, index=True, nullable=False)
    retailer = Column(String, index=True, nullable=False) # Myntra, Nykaa, AJIO, Amazon, Zara, H&M
    brand = Column(String, index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String, index=True, nullable=False) # T-shirts, Shirts, Jackets, Dresses, Jeans, Trousers, Shoes
    subcategory = Column(String, nullable=True)
    gender = Column(String, default="Unisex")
    price = Column(Float, nullable=False)
    currency = Column(String, default="INR")
    discount = Column(Float, default=0.0) # Percentage e.g. 20.0
    images = Column(JSON, nullable=False) # List of image URLs
    product_url = Column(String, nullable=False)
    affiliate_url = Column(String, nullable=False)
    available_sizes = Column(JSON, nullable=False) # List of strings e.g. ["S", "M", "L", "XL"]
    colors = Column(JSON, nullable=True) # List of strings
    fit_type = Column(String, default="Regular Fit")
    material = Column(String, nullable=True)
    rating = Column(Float, default=4.5)

    size_charts = relationship("SizeChart", back_populates="product", cascade="all, delete-orphan")

class SizeChart(Base):
    __tablename__ = "size_charts"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    size_label = Column(String, nullable=False) # XS, S, M, L, XL, XXL
    chest_min = Column(Float, nullable=True)
    chest_max = Column(Float, nullable=True)
    waist_min = Column(Float, nullable=True)
    waist_max = Column(Float, nullable=True)
    shoulder_min = Column(Float, nullable=True)
    shoulder_max = Column(Float, nullable=True)
    length_cm = Column(Float, nullable=True)

    product = relationship("Product", back_populates="size_charts")

class SavedProduct(Base):
    __tablename__ = "saved_products"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="saved_products")
    product = relationship("Product")

class SavedOutfit(Base):
    __tablename__ = "saved_outfits"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False)
    product_ids = Column(JSON, nullable=False) # List of product IDs
    total_price = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="saved_outfits")

class FitFeedback(Base):
    __tablename__ = "fit_feedbacks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    brand = Column(String, nullable=False)
    category = Column(String, nullable=False)
    selected_size = Column(String, nullable=False)
    feedback = Column(String, nullable=False) # too_tight, fits_perfectly, too_loose
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="fit_feedbacks")
    product = relationship("Product")

class TryOnSession(Base):
    __tablename__ = "try_on_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    result_image_url = Column(String, nullable=False)
    confidence_score = Column(Float, default=0.9)
    model_name = Column(String, default="IDM-VTON-v1")
    processing_time_ms = Column(Integer, default=450)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class AffiliateClick(Base):
    __tablename__ = "affiliate_clicks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    retailer = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
