# product_info.py
from pydantic import BaseModel, EmailStr
from typing import List, Dict, Any
from datetime import datetime

# Define Pydantic schema
class ProductData(BaseModel):
    barcode : int
    product_name: str
    nutriments: Dict[str, Any]
    additives_tags: List[str]
    ingredients_hierarchy: List[str]
    nutrient_levels: Dict[str, Any]
    nova_groups_tags: List[str]
    discription: List[str]

class UserData(BaseModel):
    name: str
    email: EmailStr
    product_data: ProductData
    timestamp: datetime

