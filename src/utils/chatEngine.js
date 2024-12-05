import dotenv from 'dotenv';
import { ContextChatEngine, OpenAI, storageContextFromDefaults, VectorStoreIndex } from 'llamaindex';
dotenv.config();


const chatEngine = async () => {
    const storageContext = await storageContextFromDefaults({
        persistDir: './src/llamaIndexStorage',
    });

    const index = await VectorStoreIndex.init({
        logProgress: true,
        storageContext: storageContext,
        settings:{
            maxWorkersCount: 4, 
        }
    });
    
    const retriever = index.asRetriever();

    const chatEngine = new ContextChatEngine({ 
        retriever,
        contextRole: 'system',
        systemPrompt: `You are a knowledgeable filesystem assistant designed to help users with their filesystem queries , which you will find in the index.
                    - if something is listable, list it.
                    - if you are asked something which is not in the index, then dont give sources or sourceNodes.
                    
                    `,
        // systemPrompt: `You are an assistant specifically trained to answer questions based on the indexed document content.

        //             Your responsibilities:
        //             - Only provide information that exists within the indexed documents
        //             - If information isn't found in the documents, clearly state that
        //             - Keep any Hindi text exactly as it appears in the documents
        //             - Stay faithful to the source material without making assumptions
        //             - When quoting from documents, indicate the source if available
        //             - If a question is unclear, ask for clarification rather than making assumptions

        //             Remember: Your knowledge is limited to the content of the indexed documents.`,
        chatModel: new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            model: "gpt-4",
        })
    });
    return chatEngine;
};

export default chatEngine;