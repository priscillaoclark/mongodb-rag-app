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
        const question = messages[messages.length - 1].content;

        const model = new ChatOpenAI({
            temperature: 0.5,
            streaming: true,
            callbacks: [handlers],
        });

        const retriever = vectorStore().asRetriever({
            searchType: "similarity",
            searchKwargs: { k: 4 },
        });

        const conversationChain = ConversationalRetrievalQAChain.fromLLM(
            model,
            retriever,
            {
                returnSourceDocuments: true,
                memory: new BufferMemory({
                    memoryKey: "chat_history",
                    returnMessages: true,
                    inputKey: "question",
                    outputKey: "text",
                }),
            }
        );

        await conversationChain.call({
            question: question,
            chat_history: messages.slice(0, -1),
        }, {
            callbacks: [handlers],
        });

        return new StreamingTextResponse(stream);
    } catch (e) {
        return NextResponse.json(
            { message: "Error Processing" },
            { status: 500 },
        );
    }
}