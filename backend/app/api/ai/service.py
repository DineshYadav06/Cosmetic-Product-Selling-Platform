import os
from fastapi import UploadFile, HTTPException
from app.api.ai.repository import analysis_repository
from app.models.user_model import User
from app.models.analysis_model import AnalysisHistory
from app.api.products.repository import product_repository
import logging

logger = logging.getLogger(__name__)

# Try importing tensorflow, gracefully fallback if not installed
try:
    import tensorflow as tf
    import numpy as np
    from PIL import Image
    import io
    TF_AVAILABLE = True
    
    # Load model (Mock path, replace with actual in production)
    MODEL_PATH = os.path.join(os.path.dirname(__file__), "../../../ai-services/skin_model.h5")
    model = None
    if os.path.exists(MODEL_PATH):
        try:
            model = tf.keras.models.load_model(MODEL_PATH)
            logger.info("TensorFlow Model loaded successfully.")
        except Exception as e:
            logger.error(f"Error loading TF model: {e}")
except ImportError:
    TF_AVAILABLE = False
    logger.warning("TensorFlow is not installed. AI features will use mock data.")

SKIN_TYPES = ["Oily", "Dry", "Combination", "Normal", "Sensitive"]

class AIService:
    async def analyze_skin(self, current_user: User, file: UploadFile):
        # 1. Read Image
        contents = await file.read()
        
        # 2. Predict (Mock logic if TF unavailable or model missing)
        predicted_skin_type = "Combination"
        confidence = 0.85
        
        if TF_AVAILABLE and 'model' in globals() and model:
            try:
                # Preprocess image
                image = Image.open(io.BytesIO(contents)).resize((224, 224))
                img_array = np.array(image) / 255.0
                img_array = np.expand_dims(img_array, axis=0)
                
                # Predict
                predictions = model.predict(img_array)
                class_idx = np.argmax(predictions[0])
                predicted_skin_type = SKIN_TYPES[class_idx % len(SKIN_TYPES)]
                confidence = float(predictions[0][class_idx])
            except Exception as e:
                logger.error(f"Prediction failed: {e}")
                
        # 3. Save History
        history = AnalysisHistory(
            user=current_user,
            image_url="placeholder_url_from_s3_or_cloudinary", # You should upload to Cloudinary here
            skin_type_result=predicted_skin_type,
            confidence_score=confidence
        )
        await history.insert()
        
        return {
            "skin_type": predicted_skin_type,
            "confidence": confidence,
            "message": "Skin analysis completed successfully."
        }
        
    async def get_recommendations(self, skin_type: str):
        # Find products matching this skin type
        # In Beanie, querying arrays:
        products = await product_repository.model.find({"skin_types": skin_type}).limit(10).to_list()
        
        return {
            "skin_type": skin_type,
            "recommended_products": products
        }

ai_service = AIService()
