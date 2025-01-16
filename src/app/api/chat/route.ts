import { StreamingTextResponse, LangChainStream, Message } from "ai";
import { ChatOpenAI } from "@langchain/openai";

import { ConversationalRetrievalQAChain } from "langchain/chains";
import { vectorStore } from "@/utils/openai";
import { NextResponse } from "next/server";
import { BufferMemory } from "langchain/memory";

export async function POST(req: Request) {
    try {
        const { stream, handlers } = LangChainStream();
        const body = await req.json();
        const messages: Message[] = body.messages ?? [];

        messages.unshift({
            id: messages.length.toString(),
            role: "system",
            content: "Answer only from your knowledge based vectorStore.",
        });

        const question = messages[messages.length - 1].content;

        const model = new ChatOpenAI({
            temperature: 0.5,
            streaming: true,
            callbacks: [handlers],
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
            },
        );
        conversationChain.invoke({
            question: question,
        });

        return new StreamingTextResponse(stream);
    } catch (e) {
        return NextResponse.json(
            { message: "Error Processing" },
            { status: 500 },
        );
    }
}
