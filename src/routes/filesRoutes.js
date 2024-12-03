import fs from "fs";
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    try {
        const filePath = "./src/llamaStorage";
        const files = fs.readdirSync(filePath);
        const fileNames = files.map((file) => file.replace(".json", ""));
        const allFiles = [];
        for (const fileName of fileNames) {
            if (fileName.includes(".pdf")) {
                allFiles.push({
                    name: fileName,
                    type: "file",
                });
            }
        }
        console.log(allFiles);
        res.status(200).send(allFiles);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

export default router;
