from fastapi import FastAPI, Request
from sentence_transformers import SentenceTransformer
import uvicorn

app = FastAPI()

# Load the embedding model
model = SentenceTransformer("BAAI/bge-large-en-v1.5")

@app.post("/embed")
async def embed(request: Request):
    body = await request.json()
    text = body.get("text")
    if not text:
        return {"error": "Text is required"}
    
    # Get the embedding
    embedding = model.encode(text).tolist()
    return {"embedding": embedding}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5001)