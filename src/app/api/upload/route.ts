import { NextRequest, NextResponse } from "next/server";
import { createClient } from "redis";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RedisVectorStore } from "langchain/vectorstores/redis";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

if (!process.env.REDIS_URL) {
  throw new Error("Missing REDIS_URL environment variable");
}

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const client = createClient({
  url: process.env.REDIS_URL,
});

// Connect to Redis
await client.connect();

// Create vector search index if it doesn't exist
try {
  await client.ft.create(
    "docs_index",
    {
      text_embedding: {
        type: "VECTOR",
        ALGORITHM: "HNSW",
        DIM: 1536,
        DISTANCE_METRIC: "COSINE",
      },
    },
    { PREFIX: "doc:" },
  );
} catch (error) {
  if (error.message === "Index already exists") {
    console.log("Index already exists");
  } else {
    console.error("Error creating index:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Save file temporarily
    const tempPath = `/tmp/${file.name}`;
    require("fs").writeFileSync(tempPath, buffer);

    // Load and process the PDF
    const loader = new PDFLoader(tempPath);
    const docs = await loader.load();

    // Split the documents into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 3000,
      chunkOverlap: 200,
    });
    const splitDocs = await textSplitter.splitDocuments(docs);

    // Create vector store
    const vectorStore = await RedisVectorStore.fromDocuments(
      splitDocs,
      new OpenAIEmbeddings(),
      {
        redisClient: client,
        indexName: "documents",
        keyPrefix: "doc:",
      },
    );

    // Clean up temp file
    require("fs").unlinkSync(tempPath);

    // Verify storage
    const indexInfo = await client.ft.info("docs_index");
    console.log("Index info:", indexInfo);

    return NextResponse.json({
      success: true,
      message: "Document processed and stored in Redis",
    });
  } catch (error) {
    console.error("Error processing document:", error);
    return NextResponse.json(
      { error: "Failed to process document" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: "Upload endpoint ready" });
}
