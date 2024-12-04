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

for ( let j = 0; j < directories.length; j++) {
    const file_path = `../../data-img/${directories[j]}`;
    const img_folders = getDirectories(file_path);

    for ( let i = 0; i < img_folders.length; i++) {
        let results = [];
        const allFiles = loadFilesFromFolder(`../../data-img/${directories[j]}/${img_folders[i]}`);
        allFiles.sort((a, b) => {
            const pageNumA = parseInt(a.name.match(/\.(\d+)\./)?.[1] || 0);
            const pageNumB = parseInt(b.name.match(/\.(\d+)\./)?.[1] || 0);
            return pageNumA - pageNumB;
        });
        // console.log("allFiles = ", allFiles);
        console.log(`${j+1} out of ${directories.length}`);
        for ( let l = 0; l < allFiles.length; l++) {
            const {data: {text}} = await worker.recognize(`../../data-img/${directories[j]}/${img_folders[i]}/${allFiles[l].name}`);
            // console.log(text);
            results.push({
                content: text,
                page: l + 1
            });
    
        }
        // console.log(results);
        // Create directory if it doesn't exist
        if (!fs.existsSync(`../../llamaStorage/${directories[j]}`)) {
            fs.mkdirSync(`../../llamaStorage/${directories[j]}`);
        }
        fs.writeFileSync(`../../llamaStorage/${directories[j]}/${img_folders[i]}.pdf.json`, JSON.stringify(results, null, 2));
        results = [];
    }
}



console.log("done");

await worker.terminate();

