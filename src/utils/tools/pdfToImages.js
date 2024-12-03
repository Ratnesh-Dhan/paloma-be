import { fromPath } from "pdf2pic";
import fs from "fs";

const convertPdfToJpg = async (pdfPath, outputDir) => {
    const st = pdfPath.split("/");
    const fileName = st[st.length - 1];
    const dirName = fileName.replace('.pdf', '');
    try {
        const outputPath = `${outputDir}/${dirName}`;
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath);
        }

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
        return dirName;
        // console.log("Conversion complete:", result);
    } catch (error) {
        console.error("Error during conversion:", error);
    }
};

export default convertPdfToJpg;