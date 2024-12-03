import fs from 'fs';
import path from 'path';

const loadFilesFromFolder = (folderPath) => {
    try {
        const files = fs.readdirSync(folderPath);
        let fileList = [];
        
        files.forEach(file => {
            const fullPath = path.join(folderPath, file);
            const stats = fs.statSync(fullPath);
            
            if (stats.isDirectory()) {
                // Recursively get files from subdirectories
                fileList = fileList.concat(loadFilesFromFolder(fullPath));
            } else {
                fileList.push({
                    name: file,
                    path: fullPath,
                    // Optional: add more file properties
                    // size: stats.size,
                    // created: stats.birthtime,
                    // modified: stats.mtime,
                });
            }
        });
        
        return fileList;
    } catch (error) {
        console.error('Error loading files:', error);
        return [];
    }
};

export default loadFilesFromFolder;