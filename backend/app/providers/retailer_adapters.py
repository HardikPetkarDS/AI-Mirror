from typing import List, Optional, Dict, Any
from app.providers.base import ProductProvider
from app.providers.mock_provider import MockProductProvider
from app.schemas.schemas import ProductFilterParams
from app.core.config import settings

class MyntraProductProvider(ProductProvider):
    def __init__(self):
        self.api_key = settings.MYNTRA_API_KEY
        self.api_secret = settings.MYNTRA_API_SECRET
        self.fallback_mock = MockProductProvider()

    def search_products(self, params: ProductFilterParams, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        if not self.api_key:
            # Use mock fallback if official API key not configured
            params.retailer = "Myntra"
            return self.fallback_mock.search_products(params, limit, offset)
        # Official Myntra API call implementation when API keys provided
        return []

    def get_product(self, product_id: str) -> Optional[Dict[str, Any]]:
        if not self.api_key:
            return self.fallback_mock.get_product(product_id)
        return None

    def get_categories(self) -> List[str]:
        return self.fallback_mock.get_categories()

    def get_size_chart(self, product_id: str) -> List[Dict[str, Any]]:
        return self.fallback_mock.get_size_chart(product_id)


class NykaaProductProvider(ProductProvider):
    def __init__(self):
        self.api_key = settings.NYKAA_API_KEY
        self.fallback_mock = MockProductProvider()

    def search_products(self, params: ProductFilterParams, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        if not self.api_key:
            params.retailer = "Nykaa Fashion"
            return self.fallback_mock.search_products(params, limit, offset)
        return []

    def get_product(self, product_id: str) -> Optional[Dict[str, Any]]:
        return self.fallback_mock.get_product(product_id)

    def get_categories(self) -> List[str]:
        return self.fallback_mock.get_categories()

    def get_size_chart(self, product_id: str) -> List[Dict[str, Any]]:
        return self.fallback_mock.get_size_chart(product_id)


class AJIOProductProvider(ProductProvider):
    def __init__(self):
        self.api_key = settings.AJIO_API_KEY
        self.fallback_mock = MockProductProvider()

    def search_products(self, params: ProductFilterParams, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        if not self.api_key:
            params.retailer = "AJIO"
            return self.fallback_mock.search_products(params, limit, offset)
        return []

    def get_product(self, product_id: str) -> Optional[Dict[str, Any]]:
        return self.fallback_mock.get_product(product_id)

    def get_categories(self) -> List[str]:
        return self.fallback_mock.get_categories()

    def get_size_chart(self, product_id: str) -> List[Dict[str, Any]]:
        return self.fallback_mock.get_size_chart(product_id)


class AmazonProductProvider(ProductProvider):
    def __init__(self):
        self.api_key = settings.AMAZON_API_KEY
        self.fallback_mock = MockProductProvider()

    def search_products(self, params: ProductFilterParams, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        if not self.api_key:
            params.retailer = "Amazon Fashion"
            return self.fallback_mock.search_products(params, limit, offset)
        return []

    def get_product(self, product_id: str) -> Optional[Dict[str, Any]]:
        return self.fallback_mock.get_product(product_id)

    def get_categories(self) -> List[str]:
        return self.fallback_mock.get_categories()

    def get_size_chart(self, product_id: str) -> List[Dict[str, Any]]:
        return self.fallback_mock.get_size_chart(product_id)
