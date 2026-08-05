from typing import TypeVar, Type, Generic, List, Optional
from beanie import Document
from pydantic import BaseModel
from bson import ObjectId

ModelType = TypeVar("ModelType", bound=Document)
CreateSchemaType = TypeVar("CreateSchemaType", bound=BaseModel)
UpdateSchemaType = TypeVar("UpdateSchemaType", bound=BaseModel)

class BaseRepository(Generic[ModelType, CreateSchemaType, UpdateSchemaType]):
    def __init__(self, model: Type[ModelType]):
        self.model = model

    async def get(self, id: str) -> Optional[ModelType]:
        if not ObjectId.is_valid(id):
            return None
        return await self.model.get(ObjectId(id))

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        return await self.model.find_all().skip(skip).limit(limit).to_list()

    async def create(self, obj_in: CreateSchemaType) -> ModelType:
        obj_in_data = obj_in.model_dump(exclude_unset=True)
        db_obj = self.model(**obj_in_data)
        return await db_obj.insert()

    async def update(self, db_obj: ModelType, obj_in: UpdateSchemaType) -> ModelType:
        obj_data = obj_in.model_dump(exclude_unset=True)
        for field, value in obj_data.items():
            setattr(db_obj, field, value)
        await db_obj.save()
        return db_obj

    async def delete(self, id: str) -> bool:
        obj = await self.get(id)
        if obj:
            await obj.delete()
            return True
        return False
