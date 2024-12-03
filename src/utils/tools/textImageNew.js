import loadFilesFromFolder from "./getFiles.js";
import Tesseract from 'tesseract.js';
import fs from 'fs';

const getDirectories = (source) =>
    fs.readdirSync(source, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
  
  // Get all directories from the specified path
const directories = getDirectories('../../data-img');
// Filter out any directory named 'node_modules' or '.git' if they exist
const filteredDirectories = directories.filter(dir => !['backups'].includes(dir));
directories.length = 0; // Clear the original array
directories.push(...filteredDirectories); // Repopulate with filtered results

console.log("Directories found:", directories);
console.log("Total directories = ", directories.length);

const worker = await Tesseract.createWorker(['eng', 'hin']);
// await worker.loadLanguage('eng+hin');
// await worker.initialize('eng+hin');

for ( let i = 0; i < directories.length; i++) {
    let results = [];
    const allFiles = loadFilesFromFolder(`../../data-img/${directories[i]}`);
    allFiles.sort((a, b) => {
        const pageNumA = parseInt(a.name.match(/\.(\d+)\./)?.[1] || 0);
        const pageNumB = parseInt(b.name.match(/\.(\d+)\./)?.[1] || 0);
        return pageNumA - pageNumB;
    });
    // console.log("allFiles = ", allFiles);
    console.log(`${i+1} out of ${directories.length}`);
    for ( let j = 0; j < allFiles.length; j++) {
        const {data: {text}} = await worker.recognize(`../../data-img/${directories[i]}/${allFiles[j].name}`);
        // console.log(text);
        results.push({
            content: text,
            page: j + 1
        });

    }
    console.log(results);
    fs.writeFileSync(`../../llamaStorage/${directories[i]}.pdf.json`, JSON.stringify(results, null, 2));
    results = [];
}
console.log("done");

await worker.terminate();

