import { StreamingTextResponse, LangChainStream, Message } from "ai";
import { ChatOpenAI } from "@langchain/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { vectorStore } from "@/utils/openai";
import { NextResponse } from "next/server";
import { BufferMemory } from "langchain/memory";
import { Document } from "langchain/document";
import { BaseMessage } from "@langchain/core/messages";

interface SourceDocument extends Document {
    metadata: {
        filename: string;
        uploadTime: string;
        chunkIndex: number;
        chunkLength: number;
        totalChunks: number;
    };
    score?: number;
}

interface TransformedSource {
    content: string;
    metadata: {
        filename: string;
        chunkIndex: number;
        totalChunks: number;
    };
}

interface ChatResponse {
    question: string;
    chat_history: BaseMessage[];
    text?: string;
    sourceDocuments?: SourceDocument[];
}

export async function POST(req: Request): Promise<Response> {
    const { stream, handlers } = LangChainStream();

    try {
        const body = await req.json();
        const messages: Message[] = body.messages ?? [];
        const question: string = messages[messages.length - 1].content;

        const model = new ChatOpenAI({
            temperature: 0.8,
            streaming: true,
            callbacks: [handlers],
        });

        console.log("Initializing vector store...");
        const store = await vectorStore();
        const retriever = store.asRetriever({
            k: 3,
            verbose: true,
        });

        console.log("Creating conversation chain...");
        const conversationChain = ConversationalRetrievalQAChain.fromLLM(
            model,
            retriever,
            {
                memory: new BufferMemory({
                    memoryKey: "chat_history",
                    returnMessages: true,
                    inputKey: "question",
                    outputKey: "text",
                }),
                returnSourceDocuments: true,
                verbose: true,
            },
        );

        const response = await conversationChain.call({
            question: question,
        });

        // Create a transformed version of source documents
        const sources: TransformedSource[] =
            response.sourceDocuments?.map((doc: SourceDocument) => ({
                content: doc.pageContent.substring(0, 150) + "...", // First 150 chars
                metadata: {
                    filename: doc.metadata.filename,
                    chunkIndex: doc.metadata.chunkIndex,
                    totalChunks: doc.metadata.totalChunks,
                },
            })) ?? [];

        // Create a ReadableStream to combine the response and sources
        const combinedStream = new ReadableStream({
            async start(controller) {
                // Wait for the original stream to finish
                const reader = stream.getReader();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    controller.enqueue(value);
                }

                // Add sources after the main content
                if (sources && sources.length > 0) {
                    const sourcesText =
                        "\n\nSources:\n" +
                        sources
                            .map(
                                (source: TransformedSource, i: number) =>
                                    `${i + 1}. From ${source.metadata.filename} (Part ${source.metadata.chunkIndex + 1}/${source.metadata.totalChunks})`,
                            )
                            .join("\n");

                    controller.enqueue(new TextEncoder().encode(sourcesText));
                }

                controller.close();
            },
        });

        return new StreamingTextResponse(combinedStream);
    } catch (error: unknown) {
        console.error("Error in chat processing:", error);
        
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        console.error("Detailed error:", errorMessage);

        return new Response(
            JSON.stringify({
                message: "Error Processing",
                error: errorMessage,
                timestamp: new Date().toISOString()
            }), 
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}
