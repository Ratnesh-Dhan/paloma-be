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
        systemPrompt: 'you are a filesystem assistant, your job is to help the user with their filesystem questions.If there are text in hindi language then just give it as it is. ',
        chatModel: new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            model: "gpt-4",
        })
    });
    return chatEngine;
};

export default chatEngine;