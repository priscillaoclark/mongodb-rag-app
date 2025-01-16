import { StreamingTextResponse, LangChainStream, Message } from "ai";
import { ChatOpenAI } from "@langchain/openai";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { vectorStore } from "@/utils/openai";
import { NextResponse } from "next/server";
import { BufferMemory } from "langchain/memory";
import { LangChainTracer } from "@langchain/core/tracers/tracer_langchain";
import dotenv from "dotenv";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

dotenv.config();

const tracer = new LangChainTracer({ projectName: "demo" });
const retriever = vectorStore().asRetriever();

export async function POST(req: Request) {
    try {
        const { handlers } = LangChainStream();
        const body = await req.json();
        const messages: Message[] = body.messages ?? [];
        const currentMessageContent = messages[messages.length - 1].content;

        // Convert the chat history to LangChain format
        const chatHistory: BaseMessage[] = messages.slice(0, -1).map((m) => 
            m.role === "user" 
                ? new HumanMessage(m.content)
                : new AIMessage(m.content)
        );

        const llm = new ChatOpenAI({
            temperature: 0.8,
            streaming: true,
            callbacks: [handlers, tracer],
        });

        const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
            ["system", "Given a chat history and the latest user question, formulate a standalone question which can be understood without the chat history. Do NOT answer the question, just reformulate it if needed and otherwise return it as is."],
            new MessagesPlaceholder("chat_history"),
            ["human", "{input}"],
        ]);

        const historyAwareRetriever = await createHistoryAwareRetriever({
            llm,
            retriever,
            rephrasePrompt: contextualizeQPrompt,
        });

        const qaPrompt = ChatPromptTemplate.fromMessages([
            ["system", "You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know.\n\n{context}"],
            new MessagesPlaceholder("chat_history"),
            ["human", "{input}"],
        ]);

        const questionAnswerChain = await createStuffDocumentsChain({
            llm,
            prompt: qaPrompt,
        });

        const ragChain = await createRetrievalChain({
            retriever: historyAwareRetriever,
            combineDocsChain: questionAnswerChain,
        });

        const response = await ragChain.invoke({
            chat_history: chatHistory,
            input: currentMessageContent,
        });

        return NextResponse.json({ response });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "An error occurred." });
    }
}