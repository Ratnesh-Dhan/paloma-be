import {
    VectorStoreIndex,
    storageContextFromDefaults,
  } from "llamaindex";

import dotenv from "dotenv";
dotenv.config({ path: '../../.env' });

console.log(process.env.OPENAI_API_KEY);
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

import getDocuments from "./tools/getDocument.js";
  
const storageContext = await storageContextFromDefaults({
    persistDir: "../llamaIndexStorage",
  });
    
const document = await getDocuments("../llamaStorage");
const index = await VectorStoreIndex.fromDocuments(document, {
  storageContext,
});

//console.log(index.documentCount);
console.log("Indexed!");

export default index;