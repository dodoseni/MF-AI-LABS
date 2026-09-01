import os
from enum import Enum
from typing import Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from azure.identity import DefaultAzureCredential
from azure.search.documents import SearchClient
from openai import AzureOpenAI
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="LevelUp AI Assistant", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Azure clients (lazy-init) ----------

_openai_client: Optional[AzureOpenAI] = None
_search_client: Optional[SearchClient] = None


def get_openai_client() -> AzureOpenAI:
    global _openai_client
    if _openai_client is None:
        _openai_client = AzureOpenAI(
            api_version=os.getenv("AZURE_OPENAI_API_VERSION", "2024-06-01"),
            azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT", ""),
            api_key=os.getenv("AZURE_OPENAI_API_KEY", ""),
        )
    return _openai_client


def get_search_client() -> SearchClient:
    global _search_client
    if _search_client is None:
        credential = DefaultAzureCredential()
        _search_client = SearchClient(
            endpoint=os.getenv("AZURE_SEARCH_ENDPOINT", ""),
            index_name=os.getenv("AZURE_SEARCH_INDEX_NAME", "levelup-documents"),
            credential=credential,
        )
    return _search_client


# ---------- Models ----------


class Persona(str, Enum):
    consultant = "consultant"
    manager = "manager"


class ChatRequest(BaseModel):
    message: str
    persona: Persona = Persona.consultant
    profile: Optional[dict] = None


class SourceDoc(BaseModel):
    title: str
    content: str
    url: Optional[str] = None
    chunk_id: Optional[str] = None
    score: Optional[float] = None


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceDoc]


# ---------- RAG pipeline ----------

SYSTEM_PROMPT_CONSULTANT = """You are SkillPath AI, an intelligent career development assistant for Sopra Steria consultants.
You answer questions about certifications, competency requirements, career paths, and study plans.
Always ground your answers in the provided source documents. If the documents don't contain enough information, say so.
Cite source documents when referencing specific requirements or recommendations."""

SYSTEM_PROMPT_MANAGER = """You are SkillPath AI, an intelligent team management assistant for Sopra Steria managers.
You help managers understand team competency status, certification progress, development needs, and progression paths.
Always ground your answers in the provided source documents. If the documents don't contain enough information, say so.
Cite source documents when referencing specific requirements or recommendations."""


def search_documents(query: str, top_k: int = 5) -> list[SourceDoc]:
    client = get_search_client()
    results = client.search(search_text=query, top=top_k)
    sources = []
    for doc in results:
        sources.append(
            SourceDoc(
                title=doc.get("title", "Untitled"),
                content=doc.get("content", ""),
                url=doc.get("url"),
                chunk_id=doc.get("chunk_id"),
                score=doc.get("@search.score"),
            )
        )
    return sources


def generate_answer(query: str, sources: list[SourceDoc], persona: Persona) -> str:
    client = get_openai_client()
    deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT", "gpt-4")

    context_parts = []
    for i, src in enumerate(sources, 1):
        context_parts.append(f"[{i}] {src.title}\n{src.content}")
    context = "\n\n---\n\n".join(context_parts)

    system_prompt = (
        SYSTEM_PROMPT_CONSULTANT
        if persona == Persona.consultant
        else SYSTEM_PROMPT_MANAGER
    )

    messages = [
        {"role": "system", "content": system_prompt},
        {
            "role": "user",
            "content": f"Source documents:\n\n{context}\n\n---\n\nUser question: {query}",
        },
    ]

    response = client.chat.completions.create(
        model=deployment,
        messages=messages,
        temperature=0.3,
        max_tokens=1500,
    )
    return response.choices[0].message.content or ""


# ---------- Routes ----------


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        sources = search_documents(req.message)
        answer = generate_answer(req.message, sources, req.persona)
        return ChatResponse(answer=answer, sources=sources)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/documents")
async def list_documents(top: int = 20):
    """List indexed documents for debugging."""
    client = get_search_client()
    results = client.search(search_text="*", top=top, include_total_result_count=True)
    docs = []
    for doc in results:
        docs.append(
            {
                "title": doc.get("title"),
                "chunk_id": doc.get("chunk_id"),
            }
        )
    return {"count": results.get_count(), "documents": docs}
