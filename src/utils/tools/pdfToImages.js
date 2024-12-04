import { fromPath } from "pdf2pic";
import fs from "fs";

const convertPdfToJpg = async (pdfPath, outputDir) => {
    const st = pdfPath.split("/");
    const fileName = st[st.length - 1];
    const containingDir = st[st.length - 2];
    const dirName = fileName.replace('.pdf', '');
    try {
        // Create parent directory if it doesn't exist
        const parentPath = `${outputDir}/${containingDir}`;
        if (!fs.existsSync(parentPath)) {
            fs.mkdirSync(parentPath);
        }
        // Create subdirectory if it doesn't exist
        const outputPath = `${outputDir}/${containingDir}/${dirName}`;
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath);
        }
        // old working code
        // const options = {
        //     density: 300, // Image quality in DPI
        //     saveFilename: fileName, // Base filename
        //     savePath: outputPath, // Output directory
        //     format: "jpg", // Image format
        //     width: 1240, // Optional, set image width
        //     height: 1754, // Optional, set image heightt
        //     quality: 90 // Optional, set JPEG quality
        // };
        const options = {
            density: 600, // Increased DPI for better quality
            saveFilename: fileName,
            savePath: outputPath,
            format: "jpg",
            width: 2480, // Doubled width (A4 size at 300 DPI)
            height: 3508, // Doubled height (A4 size at 300 DPI)
            quality: 100 // Added maximum JPEG quality setting
        };

        const pdfConverter = fromPath(pdfPath, options);

        const result = await pdfConverter.bulk(-1); // Convert all pages (-1) or specify page numbers
        return dirName;
        // console.log("Conversion complete:", result);
    } catch (error) {
        console.error("Error during conversion:", error);
    }
};

export default convertPdfToJpg;