import Tesseract from 'tesseract.js';
import convertPdfToJpg from "./pdfToImages.js";
import loadFilesFromFolder from "./getFiles.js";
import fs from "fs";

const allFiles = loadFilesFromFolder('../../data');
const worker = await Tesseract.createWorker();

console.log(allFiles);
console.log("total files = ", allFiles.length);
for ( let i = 0; i < allFiles.length; i++) {
    const results = {};
    console.log(allFiles[i].name, ` ${1+i} out of ${allFiles.length}`);
    const dirName = await convertPdfToJpg(allFiles[i].path, '../../data-img'); 
    results[allFiles[i].name] = [];
    try {
        const imgs = fs.readdirSync(`../../data-img/${dirName}`);
        for (const img of imgs) {
            console.log(img);
            const {data: {text}} = await worker.recognize(`../../data-img/${dirName}/${img}`);
            const pageMatch = img.match(/\.(\d+)\./);
            const pageNumber = pageMatch ? parseInt(pageMatch[1]) : 1;
            results[allFiles[i].name].push({
                content: text,
                page: pageNumber,
                imageName: img,
                fileName: allFiles[i].name
            });
            // console.log(text);
        }
    }
    catch(e){
        console.log("Error during text extraction.",e);
    }
}