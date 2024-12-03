import express from "express";
const router = express.Router();

import chatEngine from "../utils/chatEngine.js";

// let chatengine;
// (async()=>{
//     chatengine = await chatEngine();
//     console.log("ChatEngine initialized");
// })();

const chatUuid = {};

router.post("/", async (req, res) => {
    console.log("chat route called");
    let chatengine;
    const uuid = req.headers["x-chat-uuid"];
    console.log({ uuid });
    console.log(req.headers)
    if (!uuid) {
        res.status(400).send("UUID is required in header");
        return;
    }
    try {
        // FIND UUID IN KEY IN chatUuid
        if (chatUuid[uuid]) {
            chatengine = chatUuid[uuid];
        } else {
            chatengine = await chatEngine();
            chatUuid[uuid] = chatengine;
            console.log("ChatEngine initialized");
        }
        const query = req.body.query;
        console.log({ query });
        const response = await chatengine.chat({ message: query });
        console.log({ response });
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.delete("/", async (req, res) => {
    const uuid = req.headers["x-chat-uuid"];
    if (!uuid) {
        res.status(400).send("UUID is required in header");
        return;
    }
    try {
        if (chatUuid[uuid]) {
            // chatUuid[uuid].close();
            delete chatUuid[uuid];
            console.log("ChatEngine closed");
        }
        res.status(200).send("ChatEngine closed");
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

export default router;
