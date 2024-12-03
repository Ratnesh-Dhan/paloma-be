
import Tesseract from 'tesseract.js';

const worker = await Tesseract.createWorker();

const {data: {text}} = await worker.recognize('./scan.jpg');
console.log(text);

await worker.terminate();