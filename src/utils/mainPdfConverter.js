import convertPdfToJpg from "./tools/pdfToImages.js";
import loadFilesFromFolder from "./tools/getFiles.js";


const allFiles = loadFilesFromFolder('../data');

console.log(allFiles);
console.log("total files = ", allFiles.length);

for ( let i = 0; i < allFiles.length; i++) {
    console.log(allFiles[i].name, ` ${1+i} out of ${allFiles.length}`);
    console.log(await convertPdfToJpg(allFiles[i].path, '../data-img'));
}
console.log("done");