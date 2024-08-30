//import fs from 'fs';
// import axios, { AxiosResponse } from 'axios';
// import Jimp from 'jimp';
import { readdir } from 'fs/promises';


async function ScanFiles(modelPath: string, excluded: string[] = []): Promise<string[]> {
  let files: string[] = [];
  try {
    files = await readdir(modelPath);
    const uniqueFiles: string[] = [];
    const replacedFiles: string[] = files
      .map((file: string) =>
        file
          .replace(/[-(].*|\s+$/gi, "")
          .replace(/\.(rar|zip|jpeg|png|jpg)$/i, "")
          .trim()
      )
      .filter((file: string) => {
        if (excluded.includes(file)) {
          return false;
        }
        if (uniqueFiles.includes(file)) {
          return false;
        }
        uniqueFiles.push(file);
        return true;
      });

    return replacedFiles;
  } catch (err) {
    console.log("scan files error", err);
    throw err;
  }
}
 
export { ScanFiles };