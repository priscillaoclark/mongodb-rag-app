import { OpenAIEmbeddings } from "@langchain/openai";
import {
    MongoDBAtlasVectorSearch,
    MongoDBAtlasVectorSearchLibArgs,
} from "@langchain/community/vectorstores/mongodb_atlas";
import { MongoClient, Collection } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// Singleton instances
let embeddingsInstance: OpenAIEmbeddings | null = null;
let clientInstance: MongoClient | null = null;
let collectionInstance: Collection | null = null;

// Initialize MongoDB connection
async function initMongoDB() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI environment variable is not set");
        }

        if (!clientInstance) {
            console.log("Initializing new MongoDB connection...");
            clientInstance = new MongoClient(process.env.MONGODB_URI);
            await clientInstance.connect();
            console.log("MongoDB connected successfully");
        }

        if (!collectionInstance) {
            const namespace = "textbooks.uploads";
            const [dbName, collectionName] = namespace.split(".");

            const db = clientInstance.db(dbName);
            const collections = await db.listCollections().toArray();
            const collectionExists = collections.some(
                (col) => col.name === collectionName,
            );

            if (!collectionExists) {
                console.log(`Creating collection ${collectionName}...`);
                await db.createCollection(collectionName);
            }

            collectionInstance = db.collection(collectionName);
            console.log(`Collection ${collectionName} initialized`);
        }

        return collectionInstance;
    } catch (error: any) {
        console.error("MongoDB connection error:", error);
        // Reset instances on error
        clientInstance = null;
        collectionInstance = null;
        throw new Error(
            `Failed to connect to MongoDB: ${error?.message || "Unknown error"}`,
        );
    }
}

export function getEmbeddingsTransformer(): OpenAIEmbeddings {
    if (!embeddingsInstance) {
        embeddingsInstance = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: "text-embedding-ada-002",
        });
    }
    return embeddingsInstance;
}

export async function searchArgs(): Promise<MongoDBAtlasVectorSearchLibArgs> {
    const collection = await initMongoDB();
    if (!collection) {
        throw new Error("MongoDB collection not initialized");
    }

    return {
        collection,
        indexName: "vector_index",
        textKey: "text",
        embeddingKey: "text_embedding",
    };
}

export async function vectorStore(): Promise<MongoDBAtlasVectorSearch> {
    const args = await searchArgs();
    return new MongoDBAtlasVectorSearch(getEmbeddingsTransformer(), args);
}

// Cleanup function
export async function cleanup(): Promise<void> {
    if (clientInstance) {
        await clientInstance.close();
        clientInstance = null;
        collectionInstance = null;
    }
    embeddingsInstance = null;
}
