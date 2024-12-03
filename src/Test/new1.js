import { fromPath } from 'pdf2pic';
import fs from "fs";

import { createWorker } from "tesseract.js";


const convertPdfToJpg = async (pdfPath, outputPath) => {
    
    try {


        const options = {
            density: 300, // Image quality in DPI
            saveFilename: fileName, // Base filename
            savePath: outputPath, // Output directory
            format: "jpg", // Image format
            width: 1240, // Optional, set image width
            height: 1754 // Optional, set image heightt
        };

        const pdfConverter = fromPath(pdfPath, options);

        const result = await pdfConverter.bulk(-1); // Convert all pages (-1) or specify page numbers
        console.log("Conversion complete:", result);
    } catch (error) {
        console.error("Error during conversion:", error);
    }
};

// Replace with your PDF file path and output directory

// await convertPdfToJpg("./palomaDoc.pdf", "./");
// console.log("Conversion completed by mitthi parrot.");
const pdfPath = './shadique.pdf';
const st = pdfPath.split("/");
const fileName = st[st.length - 1];
const dirName = fileName.replace('.pdf', '');

const outputPath = `${dirName}`;
if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath);
}

await convertPdfToJpg( pdfPath, outputPath);

const folder = outputPath;
const worker = await createWorker('eng');
const files = fs.readdirSync(folder);

for (const file of files) {
    // magic of tessaract
    const {data: {text}} = await worker.recognize(fs.readFileSync(`${folder}/${file}`));
    console.log(text);
}
await worker.terminate();