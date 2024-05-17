from fastapi import FastAPI, Response
from fastapi.responses import StreamingResponse
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware as FastAPICORS

app = FastAPI()

app.add_middleware(
    FastAPICORS,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)
@app.get("/")
def sample_lang_chain():
    load_dotenv()
    gemini_llm = ChatGoogleGenerativeAI(google_api_key=os.environ.get("GEMINI_API_KEY"), model="gemini-1.5-flash-latest",temperature=0.3)
    result = gemini_llm.invoke("what is the benefit of onion?")
    return {"response": result.content}


def formatted_response(content):
    formatted_content = content.replace("\n", "<br>").replace("\t", "&nbsp;&nbsp;&nbsp;&nbsp;").replace("**", "<b>")
    return formatted_content


@app.get("/chat")
async def chat_with_lang_chain(prompt: str):
    load_dotenv()
    gemini_llm = ChatGoogleGenerativeAI(google_api_key=os.environ.get("GEMINI_API_KEY"), model="gemini-1.5-flash-latest",temperature=0.3)
    def event_stream():
        for chunk in gemini_llm.stream(prompt):
            yield f"data: {chunk.content}\n\n"
    return StreamingResponse(event_stream(), media_type="text/event-stream")
