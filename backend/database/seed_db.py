from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.models import Product, SizeChart, User, UserProfile
from app.core.security import get_password_hash
from app.providers.mock_provider import MOCK_CATALOG

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    try:
        # Check if products already exist
        if db.query(Product).count() > 0:
            return

        for p_dict in MOCK_CATALOG:
            product = Product(
                external_id=p_dict["external_id"],
                retailer=p_dict["retailer"],
                brand=p_dict["brand"],
                name=p_dict["name"],
                description=p_dict["description"],
                category=p_dict["category"],
                subcategory=p_dict["subcategory"],
                gender=p_dict["gender"],
                price=p_dict["price"],
                currency=p_dict["currency"],
                discount=p_dict["discount"],
                images=p_dict["images"],
                product_url=p_dict["product_url"],
                affiliate_url=p_dict["affiliate_url"],
                available_sizes=p_dict["available_sizes"],
                colors=p_dict["colors"],
                fit_type=p_dict["fit_type"],
                material=p_dict["material"],
                rating=p_dict["rating"]
            )
            db.add(product)
            db.commit()
            db.refresh(product)

            # Add size charts for product
            for sc_dict in p_dict.get("size_charts", []):
                sc = SizeChart(
                    product_id=product.id,
                    size_label=sc_dict["size_label"],
                    chest_min=sc_dict.get("chest_min"),
                    chest_max=sc_dict.get("chest_max"),
                    waist_min=sc_dict.get("waist_min"),
                    waist_max=sc_dict.get("waist_max"),
                    shoulder_min=sc_dict.get("shoulder_min"),
                    shoulder_max=sc_dict.get("shoulder_max"),
                    length_cm=sc_dict.get("length_cm")
                )
                db.add(sc)
            db.commit()

        # Seed Demo User
        if db.query(User).count() == 0:
            demo_user = User(
                email="demo@aimirror.com",
                name="Fashion Explorer",
                hashed_password=get_password_hash("password123")
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)

            profile = UserProfile(
                user_id=demo_user.id,
                height_cm=175.0,
                usual_size="M",
                preferred_fit="Regular Fit",
                chest_cm=100.0,
                waist_cm=84.0,
                shoulder_cm=46.5
            )
            db.add(profile)
            db.commit()

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
    print("Database seeding completed successfully.")
