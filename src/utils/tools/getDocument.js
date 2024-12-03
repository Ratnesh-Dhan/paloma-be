import fs from "fs";
import { Document } from "llamaindex";


const getDocuments = async(folderPath) => {
    const documents = [];
    const allFiles = [];
    // const folderPath = '../llamaStorage';
    let files;
    try {
      files = fs.readdirSync(folderPath);
      files.forEach(file => {
        const filePath = `${folderPath}/${file}`;
        if (fs.statSync(filePath).isFile()) {
          const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          allFiles.push({file: file, pages: content});
        }
      });
    } catch (error) {
      console.error('Error reading directory:', error);
    }
    // console.log(allFiles[0]);
    // console.log(files.length);
    allFiles.forEach(file => {
      file.pages.forEach(page => {
        documents.push(new Document({
          text: page.content,
          metadata: {
            fileName: file.file,
            pageNumber: page.page,
          },
        }));
      });
    });
    return documents;

  }

export default getDocuments;