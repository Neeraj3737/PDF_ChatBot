import dotenv from "dotenv";
dotenv.config();


import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

let memoryStore;

async function getMemoryStore() {
  try {
    if (!memoryStore) {
      console.log("Creating GoogleGenerativeAIEmbeddings...");
      memoryStore = await MemoryVectorStore.fromTexts(
        [],
        [],
        new GoogleGenerativeAIEmbeddings({
          apiKey: process.env.GEMINI_API_KEY,
        })
      );
      console.log("MemoryVectorStore created.");
    }
    return memoryStore;
  } catch (err) {
    console.error("Error in getMemoryStore:", err);
    throw err;
  }
}

export async function storeDocumentChunks(text) {
  try {
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 100,
    });

    const docs = await splitter.createDocuments([text]);
    const store = await getMemoryStore();

    await store.addDocuments(docs);

    return docs.map((doc, i) => ({ chunk: doc.pageContent, id: i }));
  } catch (err) {
    console.error("Error in storeDocumentChunks:", err);
    throw err;
  }
}

export async function answerQuestion(question) {
  try {
    const store = await getMemoryStore();
    const results = await store.similaritySearch(question, 4);
    const context = results.map((doc) => doc.pageContent).join("\n\n");

    let model;
    try {
      model = new ChatGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY,
        model: "gemini-2.5-flash",
        temperature: 0.7,
      });
      console.log("✅ Model created successfully");
    } catch (err) {
      console.error("Error creating ChatGoogleGenerativeAI:", err);
      throw err;
    }

    const prompt = `You are a helpful and friendly assistant. You can engage in general conversation and also answer questions about documents when relevant.

${
  context
    ? `Here is some relevant document content that might be helpful:\n${context}\n`
    : ""
}

Please respond to the user's message in a natural, conversational way. If the question is related to the document content above, use that information in your response. If it's a general question or greeting, respond normally without forcing document content into the answer.

User message: ${question}

Response:`;

    let response;
    try {
      response = await model.invoke(prompt);
      console.log("✅ Response received");
    } catch (err) {
      console.error("Error invoking model:", err);
      throw err;
    }

    return response.content || response;
  } catch (error) {
    console.error("❌ Error in answerQuestion:", error);
    throw error;
  }
}