import getDocuments from "./tools/getDocument.js";
import {
    VectorStoreIndex,
    storageContextFromDefaults,
    Settings,
    OpenAIEmbedding
  } from "llamaindex";

import dotenv from "dotenv";
dotenv.config({ path: '../../.env' });

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

Settings.embedModel = new OpenAIEmbedding({
  model: "text-embedding-ada-002",
});

const storageContext = await storageContextFromDefaults({
    persistDir: "../llamaIndexStorage",
  });
    
const document = await getDocuments("../llamaStorage");


const index = await VectorStoreIndex.fromDocuments(document, {
  logProgress: true,
  Settings,
  verbose: true,  // Add verbose logging
  showProgressBar: true,  // Show a progress bar during indexing
  storageContext,
});

// console.log(index.documentCount);
console.log("Indexed!");

export default index;