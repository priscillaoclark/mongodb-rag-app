
import { NextRequest, NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { PDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

if (!process.env.PINECONE_API_KEY) {
  throw new Error('Missing PINECONE_API_KEY');
}

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
  environment: "gcp-starter" // Update this to match your Pinecone environment
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Load the PDF
    const loader = new PDFLoader(buffer);
    const docs = await loader.load();

    // Split the documents into chunks
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splitDocs = await textSplitter.splitDocuments(docs);

    // Initialize embeddings
    const embeddings = new OpenAIEmbeddings();

    // Get or create Pinecone index
    const index = pc.index("zeno");

    // Create new vectorstore
    const vectorStore = await PineconeStore.fromDocuments(
      splitDocs,
      embeddings,
      {
        pineconeIndex: index,
        namespace: "pdf-docs",
      }
    );

    return NextResponse.json({ message: "Document processed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error processing document:", error);
    return NextResponse.json({ error: "Error processing document" }, { status: 500 });
  }
}
