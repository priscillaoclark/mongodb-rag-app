import { StreamingTextResponse, LangChainStream, Message } from "ai";
import { ChatOpenAI } from "@langchain/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { vectorStore } from "@/utils/openai";
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
    try {
        const { stream, handlers } = LangChainStream();

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
            metadata: {
                retriever_type: "vector_store",
                top_k: 3,
            },
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
                metadata: {
                    llm: "gpt-4o-mini",
                    app_version: "1.0.0",
                },
            },
        );

        const response = (await conversationChain.call({
            question: question,
            langsmith_extra: {
                metadata: {
                    user_id: body.userId, // Pass through from request if available
                },
            },
        })) as ChatResponse; // Type assertion since we know the shape of the response

        const sources =
            response.sourceDocuments?.map((doc: SourceDocument) => ({
                content: doc.pageContent.substring(0, 150) + "...",
                metadata: {
                    filename: doc.metadata.filename,
                    chunkIndex: doc.metadata.chunkIndex,
                    totalChunks: doc.metadata.totalChunks,
                },
            })) ?? [];

        const combinedStream = new ReadableStream({
            async start(controller) {
                const reader = stream.getReader();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    controller.enqueue(value);
                }

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

        const errorMessage =
            error instanceof Error
                ? error.message
                : "An unexpected error occurred";
        console.error("Detailed error:", errorMessage);

        // Log error metadata for tracing
        const metadata = {
            error_type:
                error instanceof Error
                    ? error.constructor.name
                    : "UnknownError",
            error_message: errorMessage,
            timestamp: new Date().toISOString(),
        };

        return new Response(
            JSON.stringify({
                message: "Error Processing",
                error: errorMessage,
                timestamp: new Date().toISOString(),
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    }
}
