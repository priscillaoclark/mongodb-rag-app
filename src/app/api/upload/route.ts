import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import pdf from "pdf-parse";
import { getEmbeddingsTransformer, searchArgs } from "@/utils/openai";
import { MongoDBAtlasVectorSearch } from "@langchain/community/vectorstores/mongodb_atlas";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

async function processPDFFile(file: File) {
    const fileName = file.name.toLowerCase();
    const tempFilePath = `/tmp/${fileName}`;

    try {
        // Write file to temp location
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(tempFilePath, fileBuffer);

        // Read and parse PDF
        const dataBuffer = await fs.readFile(tempFilePath);
        const pdfData = await pdf(dataBuffer);

        // Clean up temp file
        await fs.unlink(tempFilePath).catch(console.error);

        return pdfData.text;
    } catch (error: any) {
        console.error(`Error processing PDF ${fileName}:`, error);
        // Clean up temp file if it exists
        await fs.unlink(tempFilePath).catch(() => {});
        throw new Error(
            `Failed to process PDF ${fileName}: ${error?.message || "Unknown error"}`,
        );
    }
}

async function splitTextIntoChunks(text: string) {
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 2000,
        chunkOverlap: 200,
        separators: ["\n\n", "\n", ". ", " ", ""],
    });

    return await textSplitter.splitText(text);
}

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const uploadedFiles = formData.getAll("filepond");

        if (!uploadedFiles.length) {
            return NextResponse.json(
                { message: "No files found" },
                { status: 400 },
            );
        }

        const processedFiles = [];
        let totalChunks = 0;

        // Get MongoDB configuration
        const vectorStoreArgs = await searchArgs();

        // Process each file in the array
        for (const uploadedFile of uploadedFiles) {
            if (!(uploadedFile instanceof File)) {
                console.warn("Skipping non-file upload:", uploadedFile);
                continue;
            }

            try {
                console.log(`Processing ${uploadedFile.name}...`);

                // Process PDF and get text
                const parsedText = await processPDFFile(uploadedFile);

                // Split text into chunks
                const chunks = await splitTextIntoChunks(parsedText);
                console.log(
                    `Split ${uploadedFile.name} into ${chunks.length} chunks`,
                );

                // Create metadata for chunks
                const chunksWithMetadata = chunks.map((chunk, index) => ({
                    text: chunk,
                    pageContent: chunk, // Required by LangChain Document interface
                    metadata: {
                        filename: uploadedFile.name,
                        uploadTime: new Date().toISOString(),
                        chunkIndex: index,
                        chunkLength: chunk.length,
                        totalChunks: chunks.length,
                    },
                }));

                // Create vector store instance
                const vectorStore = new MongoDBAtlasVectorSearch(
                    getEmbeddingsTransformer(),
                    vectorStoreArgs,
                );

                // Store documents
                await vectorStore.addDocuments(chunksWithMetadata);

                totalChunks += chunks.length;
                processedFiles.push({
                    filename: uploadedFile.name,
                    chunks: chunks.length,
                });

                console.log(`Successfully processed ${uploadedFile.name}`);
            } catch (error: any) {
                console.error(`Error processing ${uploadedFile.name}:`, error);
                return NextResponse.json(
                    {
                        message: `Error processing ${uploadedFile.name}`,
                        error: error?.message || "Unknown error",
                    },
                    { status: 500 },
                );
            }
        }

        return NextResponse.json(
            {
                message: "Files processed successfully",
                details: {
                    filesProcessed: processedFiles.length,
                    totalChunks: totalChunks,
                    files: processedFiles,
                },
            },
            { status: 200 },
        );
    } catch (error: any) {
        console.error("Error in upload handler:", error);
        return NextResponse.json(
            {
                message: "An error occurred during processing",
                error: error?.message || "Unknown error",
            },
            { status: 500 },
        );
    }
}
