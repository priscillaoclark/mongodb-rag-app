import { StreamingTextResponse, LangChainStream, Message } from "ai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { vectorStore } from "@/utils/openai";
import { NextResponse } from "next/server";
import { BufferMemory } from "langchain/memory";
import { tracing } from "@langchain/langsmith";

// Initialize LangSmith tracing
tracing.init({
    project: "demo",  // Replace with your LangSmith project name
    apiKey: process.env.LANGSMITH_API_KEY,  // Store your API key securely
});

export async function POST(req: Request) {
    try {
        const { stream, handlers } = LangChainStream();
        const body = await req.json();
        const messages: Message[] = body.messages ?? [];
        const question = messages[messages.length - 1].content;

        const model = new ChatOpenAI({
            temperature: 0.8,
            streaming: true,
            callbacks: [handlers, tracing.getTracer()], // Attach the tracer
        });

        const retriever = vectorStore().asRetriever({
            searchType: "mmr",
            searchKwargs: { fetchK: 10, lambda: 0.25 },
        });
        const conversationChain = ConversationalRetrievalQAChain.fromLLM(
            model,
            retriever,
            {
                memory: new BufferMemory({
                    memoryKey: "chat_history",
                }),
                callbacks: [tracing.getTracer()], // Trace the chain as well
            }
        );

        await conversationChain.invoke({
            question: question,
        });

        return new StreamingTextResponse(stream);
    } catch (e) {
        console.error("Error:", e);
        return NextResponse.json(
            { message: "Error Processing" },
            { status: 500 }
        );
    }
}
