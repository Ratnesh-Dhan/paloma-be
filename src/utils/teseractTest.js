import { createWorker } from "tesseract.js";
import pdfToImages from "../data/folder 1/new.js";

const worker = await createWorker('eng');
const path = '../data/folder 1/test.pdf';

(async ()=>{
    const ary = await pdfToImages(path);
    console.log("this is the array", ary);
    for (let i = 0; i < ary.length; i++) {
    const { data: { text } } = await worker.recognize(ary[i]);
    console.log(text);
    }
    await worker.terminate();
})();

// extractor('../data/Documents for Mutation/Scan_20241011.pdf').then(console.log);