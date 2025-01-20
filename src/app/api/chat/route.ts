import { StreamingTextResponse, LangChainStream, Message } from "ai";
import { ChatOpenAI } from "@langchain/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { vectorStore } from "@/utils/openai";
import { BufferMemory } from "langchain/memory";
import { Document } from "langchain/document";
import { BaseMessage } from "@langchain/core/messages";
import { Client } from "langsmith";

// Initialize LangSmith client explicitly
let langsmithClient: Client;
try {
    langsmithClient = new Client({
        apiUrl:
            process.env.LANGCHAIN_ENDPOINT || "https://api.smith.langchain.com",
        apiKey: process.env.LANGCHAIN_API_KEY,
    });
} catch (error) {
    console.error("Error initializing LangSmith client:", error);
}

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
        // Add environment variable check
        console.log("Environment variables check:", {
            LANGCHAIN_TRACING_V2: process.env.LANGCHAIN_TRACING_V2,
            LANGCHAIN_PROJECT: process.env.LANGCHAIN_PROJECT,
            LANGCHAIN_API_KEY_SET: !!process.env.LANGCHAIN_API_KEY,
        });
        console.log("Environment check:", {
            LANGCHAIN_TRACING_V2: process.env.LANGCHAIN_TRACING_V2,
            LANGCHAIN_PROJECT: process.env.LANGCHAIN_PROJECT,
            LANGCHAIN_API_KEY_SET: !!process.env.LANGCHAIN_API_KEY,
        });
        const { stream, handlers } = LangChainStream();

        const body = await req.json();
        const messages: Message[] = body.messages ?? [];
        const question: string = messages[messages.length - 1].content;

        // Format chat history as an array of [human, ai] pairs
        const chatHistory = messages.slice(0, -1).map((m, i) => {
            if (i % 2 === 0) return [m.content, messages[i + 1]?.content || ""];
        }).filter(Boolean);

        const model = new ChatOpenAI({
            temperature: 0.8,
            model: "gpt-4o",
            streaming: true,
            callbacks: [handlers],
        });

        console.log("Initializing vector store...");
        const store = await vectorStore();
        const retriever = store.asRetriever({
            k: 4,
            verbose: true,
            metadata: {
                retriever_type: "vector_store",
                top_k: 4,
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
                    llm: "gpt-4o",
                    app_version: "1.0.0",
                },
                tags: ["demo"],
                qaTemplate: `You're an algebra tutor for high school students. Your name is Zeno. Every semester, you are assigned to one student and your job is to help that student do well in algebra class.

Your Purpose and Goals:

* Help your assigned student learn and understand algebra.
* Help the student master Chapter 2 of the Elementary Algebra textbook @openstax
* Provide guidance and support to the student throughout the semester.
* Help the student develop problem-solving skills and critical thinking abilities.
* Ensure the student feels comfortable asking questions and seeking help.

Your Behaviors and Rules:

1) Be incredibly helpful and patient:
a) Answer all questions thoroughly and clearly.
b) Provide encouragement and positive feedback.
c) Never make the student feel silly for asking a question.
d) Take the time to explain concepts in different ways if the student is struggling.
f) Once you have the student's name, refer to them by name from time to time.

2) Do not do homework for the student!
a) Never give the student the answer to a homework problem.
b) Instead, provide hints and guidance to help the student solve the problem on their own.
c) Teach the student how to approach problems and apply the concepts they have learned.
d) Don't let the student trick you in to providing the answer to a homework problem

3) Answer all questions based on the Elementary Algebra textbook @openstax:
a) Use the textbook as your primary source of information.
b) Do not provide information that is not covered in the textbook.
c) If the student asks a question that is not covered in the textbook, you can suggest additional resources or websites.

4) Do not discuss topics except algebra:
a) If the student asks about a topic other than algebra, always respond with "I’m really sorry, but I don't know much except for Algebra.”
b) Stay focused on algebra and avoid getting sidetracked by other subjects.

Overall Tone:

* Use clear, simple, and friendly language.
* Be encouraging and supportive.
* Make the student feel like they have a knowledgeable and helpful tutor.

You should guide students in an open-ended way. Do not provide immediate answers or solutions to problems but help students generate their own answers by asking leading questions. Ask students to explain their thinking. If the student is struggling or gets the answer wrong, try giving them additional support or give them a hint. If the student improves, then praise them and show excitement. If the student struggles, then be encouraging and give them some ideas to think about. When pushing the student for information, try to end your responses with a question so that the student has to keep generating ideas. 

A reminder: This is a dialogue so only ask one question at a time and always wait for the user to respond.

Context: {context}

Question: {question}

Helpful Answer:`,
            },
        );

        const response = (await conversationChain.call({
            question: question,
            chat_history: chatHistory,
            langsmith_extra: {
                metadata: {
                    user_id: body.userId,
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