from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ctransformers import AutoModelForCausalLM

app = FastAPI()

# Enable CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load quantized LLaMA 2 model
model = AutoModelForCausalLM.from_pretrained(
    "llama-2-7b-chat.Q3_K_L.gguf",
    model_type="llama",
    max_new_tokens=250,
    temperature=0.3,
    top_k=30,
    top_p=0.85
)

# Global chat history
chat_history = []

class ChatRequest(BaseModel):
    message: str

class QuizRequest(BaseModel):
    text: str

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        chat_history.append(f"User: {request.message}")
        history_text = "\n".join(chat_history[-6:])

        system_prompt = (
            "System: You are an educational AI assistant. Provide clear, concise, and accurate answers "
            "to academic questions. Only respond to educational queries and what the user has previously asked. "
            "If the question is not academic, ask them to ask something educational.\n"
        )

        full_prompt = f"{system_prompt}{history_text}\nAssistant:"
        response = model(full_prompt).strip()
        chat_history.append(f"Assistant: {response}")
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-quiz")
async def generate_quiz(request: QuizRequest):
    try:
        prompt = (
    "System: You are a quiz-making assistant. Generate a quiz from the text below. "
    "Create 10 multiple choice questions. Each question must follow this format:\n\n"
    "1. Question text here\n"
    "A) Option 1\n"
    "B) Option 2\n"
    "C) Option 3\n"
    "D) Option 4\n"
    "Answer: A\n\n"
    "Use this exact format. Text:\n"
    f"{request.text}\n\nQuiz:\n"
)
        result = model(prompt).strip()
        return {"quiz": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if _name_ == "_main_":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)