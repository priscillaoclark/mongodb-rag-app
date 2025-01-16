import { ChatOpenAI } from "@langchain/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { StreamingTextResponse, LangChainStream } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { ChatPromptTemplate } from "langchain/prompts";

// Define the structure of incoming messages
interface Message {
    role: "system" | "user" | "assistant";
    content: string;
}

// Define the request body type
interface RequestBody {
    messages?: Message[];
}

export async function POST(
    req: NextRequest,
): Promise<NextResponse | StreamingTextResponse> {
    try {
        const { stream, handlers } = LangChainStream();
        const body: RequestBody = await req.json();
        const messages: Message[] = body.messages ?? [];
        const question: string = messages[messages.length - 1]?.content ?? "";

        const systemPrompt = "You are Zeno, an AI tutor focused on helping students learn effectively while maintaining academic integrity.";
        const prompt = ChatPromptTemplate.fromTemplate(systemPrompt);

        // Initialize the ChatOpenAI model
        const model = new ChatOpenAI({
            temperature: 0.8,
            streaming: true,
            callbacks: [handlers],
        });

        // Combine system prompt with previous messages
        const promptMessages: Message[] = [
            { role: "system", content: systemPrompt },
            ...messages,
        ];

        // Configure the retriever
        const retriever = vectorStore().asRetriever({
            searchType: "mmr",
            searchKwargs: { fetchK: 10, lambda: 0.25 },
        });

        // Initialize the conversational chain with memory
        const conversationChain = ConversationalRetrievalQAChain.fromLLM(
            model,
            retriever,
            {
                memory: new BufferMemory({
                    memoryKey: "chat_history",
                    inputKey: "question",
                    chatHistory: promptMessages,
                }),
            },
        );

        // Invoke the model with the latest user question
        await conversationChain.invoke({
            question: question,
        });

        return new StreamingTextResponse(stream);
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { message: "Error Processing" },
            { status: 500 },
        );
    }
}
