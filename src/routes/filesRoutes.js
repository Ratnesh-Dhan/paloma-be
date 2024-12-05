import fs from "fs";
import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    try {
        const filePath = "./src/llamaStorage";
        const folders = fs.readdirSync(filePath);
        const all = [];
        for (const folder of folders) {
            const files = fs.readdirSync(`${filePath}/${folder}`);
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
            all.push({
                name: folder,
                type: "folder",
                children: allFiles,
            });
        }
        // console.log(all);
        res.status(200).send(all);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

export default router;
