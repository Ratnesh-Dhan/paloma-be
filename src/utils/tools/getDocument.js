import fs from "fs";
import { Document } from "llamaindex";

const getDocuments = async (folderPath) => {
    const documents = [];
    const allFiles = [];
    // const folderPath = '../llamaStorage';
    let files;

    try {
        const folders = fs.readdirSync(folderPath);
        // console.log("folders = ", folders);
        folders.forEach((folder) => {
            const folderLocation = `${folderPath}/${folder}`;
            files = fs.readdirSync(folderLocation);
            files.forEach((file) => {
                const filePath = `${folderLocation}/${file}`;
                if (fs.statSync(filePath).isFile()) {
                    const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
                    allFiles.push({ file: file, pages: content });
                }
            });
        });
        // console.log("allFiles = ", allFiles);
    } catch (error) {
        console.error("Error reading directory:", error);
    }
    // console.log(allFiles[0]);
    // console.log(files.length);
    allFiles.forEach((file) => {
        file.pages.forEach((page) => {
            documents.push(
                new Document({
                    text: page.content,
                    metadata: {
                        fileName: file.file.replace(".json", ""),
                        pageNumber: page.page,
                    },
                })
            );
        });
    });
    // console.log("Documents = ", documents);
    return documents;
};

export default getDocuments;
