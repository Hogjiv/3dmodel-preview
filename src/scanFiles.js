 import { readdir } from "fs/promises"; 

export async function ScanFiles(modelPath, excluded = []) {
  let files = []; 
  try {
    files = await readdir(modelPath);
    const uniqueFiles = new Set();

    const replacedFiles = files
      .filter((file) => /\.(rar|7z|zip)$/i.test(file))
      .map((file) =>
        file
          .replace(/[-(].*|\s+.*$/gi, "")
          .replace(/\.(rar|7z|zip)$/i, "")
          .trim()
      )
      .filter((file) => {
        if (excluded.includes(file)) {
          return false;
        }
        if (uniqueFiles.has(file)) {
          return false;
        }
        uniqueFiles.add(file);
        return true;
      }); 
    console.log("LOGIC::all files::", files);
    console.log("LOGIC::replacedFiles:", replacedFiles, "unique:", [
      ...uniqueFiles,
    ]);

    return [...uniqueFiles];
  } catch (err) {
    console.log("LOGIC::scan files error", err);
    throw err;
  }
}

 