from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.models import Product, SizeChart
from app.providers.mock_provider import MockProductProvider
from app.schemas.schemas import ProductFilterParams

class ProductService:
    def __init__(self, db: Session):
        self.db = db
        self.mock_provider = MockProductProvider()

    def get_products(self, params: ProductFilterParams, limit: int = 50, offset: int = 0) -> List[Product]:
        # Query database first
        query = self.db.query(Product)
        if params.query:
            q = f"%{params.query}%"
            query = query.filter(
                (Product.name.ilike(q)) | (Product.brand.ilike(q)) | (Product.category.ilike(q)) | (Product.description.ilike(q))
            )
        if params.retailer:
            query = query.filter(Product.retailer.ilike(params.retailer))
        if params.brand:
            query = query.filter(Product.brand.ilike(params.brand))
        if params.category:
            query = query.filter(Product.category.ilike(params.category))
        if params.gender:
            query = query.filter(Product.gender.in_([params.gender, "Unisex"]))
        if params.min_price is not None:
            query = query.filter(Product.price >= params.min_price)
        if params.max_price is not None:
            query = query.filter(Product.price <= params.max_price)
        if params.fit_type:
            query = query.filter(Product.fit_type.ilike(params.fit_type))

        db_products = query.offset(offset).limit(limit).all()
        if db_products:
            return db_products

        # If DB not seeded yet, fetch from mock provider
        mock_raw = self.mock_provider.search_products(params, limit, offset)
        return [self._convert_dict_to_product_model(p) for p in mock_raw]

    def get_product(self, product_id: int) -> Optional[Product]:
        p = self.db.query(Product).filter(Product.id == product_id).first()
        if p:
            return p
        # Check mock by external_id or index
        raw = self.mock_provider.get_product(str(product_id))
        if raw:
            return self._convert_dict_to_product_model(raw, product_id)
        return None

    def get_categories(self) -> List[str]:
        db_cats = self.db.query(Product.category).distinct().all()
        if db_cats:
            return [c[0] for c in db_cats]
        return self.mock_provider.get_categories()

    def _convert_dict_to_product_model(self, d: Dict[str, Any], override_id: Optional[int] = None) -> Product:
        p = Product(
            id=override_id or 1,
            external_id=d.get("external_id", "EXT-100"),
            retailer=d.get("retailer", "Myntra"),
            brand=d.get("brand", "Roadster"),
            name=d.get("name", "Sample Product"),
            description=d.get("description", ""),
            category=d.get("category", "T-shirts"),
            subcategory=d.get("subcategory", ""),
            gender=d.get("gender", "Unisex"),
            price=d.get("price", 999.0),
            currency=d.get("currency", "INR"),
            discount=d.get("discount", 0.0),
            images=d.get("images", []),
            product_url=d.get("product_url", "#"),
            affiliate_url=d.get("affiliate_url", "#"),
            available_sizes=d.get("available_sizes", ["S", "M", "L"]),
            colors=d.get("colors", ["Black"]),
            fit_type=d.get("fit_type", "Regular Fit"),
            material=d.get("material", "Cotton"),
            rating=d.get("rating", 4.5)
        )
        p.size_charts = [
            SizeChart(
                id=idx + 1,
                size_label=sc.get("size_label", "M"),
                chest_min=sc.get("chest_min"),
                chest_max=sc.get("chest_max"),
                waist_min=sc.get("waist_min"),
                waist_max=sc.get("waist_max"),
                shoulder_min=sc.get("shoulder_min"),
                shoulder_max=sc.get("shoulder_max"),
                length_cm=sc.get("length_cm")
            ) for idx, sc in enumerate(d.get("size_charts", []))
        ]
        return p
