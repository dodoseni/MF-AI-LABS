#!/usr/bin/env python3
"""Seed Azure Blob Storage with documents and create an Azure AI Search index.

Usage:
  pip install azure-storage-blob azure-search-documents python-dotenv
  python seed.py ./my-documents/

This uploads all .txt, .md, and .pdf files from the given directory to Blob Storage,
then creates a search index and indexes the content for RAG queries.
"""
import os
import sys
import hashlib
from pathlib import Path
from dotenv import load_dotenv
from azure.storage.blob import BlobServiceClient
from azure.search.documents.indexes import SearchIndexClient
from azure.search.documents.indexes.models import (
    SearchIndex,
    SearchField,
    SearchFieldDataType,
)
from azure.identity import DefaultAzureCredential

load_dotenv()

AZURE_SEARCH_ENDPOINT = os.getenv("AZURE_SEARCH_ENDPOINT", "")
AZURE_SEARCH_INDEX_NAME = os.getenv("AZURE_SEARCH_INDEX_NAME", "levelup-documents")
AZURE_STORAGE_CONNECTION = os.getenv("AZURE_STORAGE_CONNECTION_STRING", "")
STORAGE_CONTAINER = os.getenv("AZURE_STORAGE_CONTAINER", "levelup-documents")


def chunk_text(text: str, max_len: int = 1000, overlap: int = 150) -> list[str]:
    """Split text into overlapping chunks for vector search."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + max_len
        chunk = text[start:end]
        if chunk.strip():
            chunks.append(chunk.strip())
        start = end - overlap
    return chunks


def create_index(index_client: SearchIndexClient):
    """Create the search index if it doesn't exist."""
    existing = [i.name for i in index_client.list_indexes()]
    if AZURE_SEARCH_INDEX_NAME in existing:
        print(f"Index '{AZURE_SEARCH_INDEX_NAME}' already exists, skipping creation.")
        return

    index = SearchIndex(
        name=AZURE_SEARCH_INDEX_NAME,
        fields=[
            SearchField(name="id", type=SearchFieldDataType.String, key=True),
            SearchField(name="title", type=SearchFieldDataType.String, searchable=True),
            SearchField(name="content", type=SearchFieldDataType.String, searchable=True, analyzer_name="en.microsoft"),
            SearchField(name="url", type=SearchFieldDataType.String, filterable=True),
            SearchField(name="chunk_id", type=SearchFieldDataType.String, filterable=True),
            SearchField(name="source_file", type=SearchFieldDataType.String, filterable=True),
        ],
    )
    index_client.create_index(index)
    print(f"Created index '{AZURE_SEARCH_INDEX_NAME}'.")


def upload_documents(doc_dir: str):
    """Upload documents to blob storage and index into Azure AI Search."""
    blob_client = BlobServiceClient.from_connection_string(AZURE_STORAGE_CONNECTION)
    container = blob_client.get_container_client(STORAGE_CONTAINER)
    try:
        container.create_container()
    except Exception:
        pass  # already exists

    credential = DefaultAzureCredential()
    index_client = SearchIndexClient(
        endpoint=AZURE_SEARCH_ENDPOINT, credential=credential
    )
    search_client = index_client.get_search_client(AZURE_SEARCH_INDEX_NAME)
    create_index(index_client)

    doc_path = Path(doc_dir)
    if not doc_path.is_dir():
        print(f"Error: {doc_dir} is not a directory")
        sys.exit(1)

    total_chunks = 0
    for file_path in sorted(doc_path.rglob("*")):
        if file_path.suffix.lower() not in (".txt", ".md"):
            continue

        print(f"Processing: {file_path.name}")
        text = file_path.read_text(encoding="utf-8", errors="ignore")
        chunks = chunk_text(text)

        # Upload to blob storage
        with open(file_path, "rb") as f:
            container.upload_blob(
                name=f"documents/{file_path.name}", data=f, overwrite=True
            )

        # Index chunks
        documents = []
        for i, chunk in enumerate(chunks):
            doc_id = hashlib.md5(f"{file_path.name}:{i}".encode()).hexdigest()[:16]
            documents.append(
                {
                    "id": doc_id,
                    "title": file_path.stem,
                    "content": chunk,
                    "url": f"blob://{STORAGE_CONTAINER}/documents/{file_path.name}",
                    "chunk_id": f"{file_path.name}#chunk-{i}",
                    "source_file": file_path.name,
                }
            )

        if documents:
            search_client.upload_documents(documents)
            total_chunks += len(documents)
            print(f"  Indexed {len(documents)} chunks")

    print(f"\nDone. Total chunks indexed: {total_chunks}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python seed.py <documents-directory>")
        sys.exit(1)
    upload_documents(sys.argv[1])
