import loadFilesFromFolder from "./getFiles.js";
import Tesseract from "tesseract.js";
import fs from "fs";

const getDirectories = (source) =>
    fs
        .readdirSync(source, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);

// Get all directories from the specified path
const directories = getDirectories("../../data-img");

// Filter out unwanted directories
const filteredDirectories = directories.filter(
    (dir) =>
        !["backups"].includes(dir)
);
directories.length = 0; // Clear the original array
directories.push(...filteredDirectories); // Repopulate with filtered results

console.log("Directories found:", directories);
console.log("Total directories = ", directories.length);

const CORE_COUNT = 6; // Utilize 6 CPU cores

(async () => {
    const scheduler = Tesseract.createScheduler();

    // Create workers and add to the scheduler
    await Promise.all(
        Array.from({ length: CORE_COUNT }, async () => {
            const worker = await Tesseract.createWorker(["eng", "hin"]);
            //   await worker.loadLanguage("eng+hin");
            //   await worker.initialize("eng+hin");
            scheduler.addWorker(worker);
        })
    );

    console.time("OCR Processing Time");

    // Process directories in parallel
    for (let j = 0; j < directories.length; j++) {
        const filePath = `../../data-img/${directories[j]}`;
        const imgFolders = getDirectories(filePath);

        for (let i = 0; i < imgFolders.length; i++) {
            let results = [];
            const allFiles = loadFilesFromFolder(
                `../../data-img/${directories[j]}/${imgFolders[i]}`
            );

            // Sort files for proper page order
            allFiles.sort((a, b) => {
                const pageNumA = parseInt(a.name.match(/\.(\d+)\./)?.[1] || 0);
                const pageNumB = parseInt(b.name.match(/\.(\d+)\./)?.[1] || 0);
                return pageNumA - pageNumB;
            });

            console.log(`${j + 1} out of ${directories.length}`);

            // Add OCR jobs to the scheduler for all files in the folder
            const fileResults = await Promise.all(
                allFiles.map((file, index) =>
                    scheduler
                        .addJob(
                            "recognize",
                            `../../data-img/${directories[j]}/${imgFolders[i]}/${file.name}`
                        )
                        .then(({ data: { text } }) => ({
                            content: text,
                            page: index + 1,
                        }))
                )
            );

            results.push(...fileResults);

            // Save results to JSON
            const outputDir = `../../llamaStorage/${directories[j]}`;
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            fs.writeFileSync(
                `${outputDir}/${imgFolders[i]}.pdf.json`,
                JSON.stringify(results, null, 2)
            );
            console.log("Saved results to JSON");

            results = [];
        }
    }

    console.timeEnd("OCR Processing Time");

    // Terminate scheduler and workers
    await scheduler.terminate();

    console.log("done");
})();
