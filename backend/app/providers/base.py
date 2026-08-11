from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
from app.schemas.schemas import ProductFilterParams

class ProductProvider(ABC):
    @abstractmethod
    def search_products(self, params: ProductFilterParams, limit: int = 50, offset: int = 0) -> List[Dict[str, Any]]:
        """Search products with filters."""
        pass

    @abstractmethod
    def get_product(self, product_id: str) -> Optional[Dict[str, Any]]:
        """Get product by external or internal ID."""
        pass

    @abstractmethod
    def get_categories(self) -> List[str]:
        """Get list of supported clothing categories."""
        pass

    @abstractmethod
    def get_size_chart(self, product_id: str) -> List[Dict[str, Any]]:
        """Get size chart for a product."""
        pass
