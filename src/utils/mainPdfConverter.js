import convertPdfToJpg from "./tools/pdfToImages.js";
import loadFilesFromFolder from "./tools/getFiles.js";


const f1 = loadFilesFromFolder('../data/drive-1');
const f2 = loadFilesFromFolder('../data/drive-2');
const f3 = loadFilesFromFolder('../data/drive-3');
const allFiles = [...f1, ...f2, ...f3];

// console.log(allFiles);
console.log("total files = ", allFiles.length);

for ( let i = 0; i < allFiles.length; i++) {
    console.log(allFiles[i].name, ` ${1+i} out of ${allFiles.length}`);
    console.log(await convertPdfToJpg(allFiles[i].path, '../data-img'));

    // const ary = allFiles[i].path.split("/");
    // console.log(ary[ary.length - 2]);
}
console.log("done");