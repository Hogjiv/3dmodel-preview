 
import fs from 'fs';
import { readdir } from 'fs/promises';
import axios from 'axios';
import jimp from 'jimp';
export async function ScanFiles(modelPath, excluded = []) {
  let files = [];

  try {
    files = await readdir(modelPath);
    const uniqueFiles = new Set();

    // Обрабатываем имена файлов, удаляя нежелательные части
    const replacedFiles = files
      .map((file) =>
        file
          // Удаляем все, что идет после расширения файла, включая любые слова или пробелы
          .replace(/[-(].*|\s+.*$/gi, "")
          // Удаляем расширения и любые пробелы перед ними
          .replace(/\.(rar|zip|jpeg|png|jpg)$/i, "")
          .trim()
      )
      .filter((file) => {
        // Пропускаем исключенные и повторяющиеся файлы
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
    console.log("LOGIC::replacedFiles:", replacedFiles, "unique:", [...uniqueFiles]);

    return [...uniqueFiles];
  } catch (err) {
    console.log("LOGIC::scan files error", err);
    throw err;
  }
}


export async function fetchData(modelsList, imagePath, titleText, eventSender) {
  const result = [];
  for (const model of modelsList) {
    let imageFound = false;
    await postData(model);

    if (imageFound) {
      continue;
    }

    async function postData(model) {
      try {
        const response = await axios.post("https://3ddd.ru/api/models", {
          query: model,
        });

        const backends3dd = [
          "https://b5.3ddd.ru/media/cache/tuk_model_custom_filter_ang_ru/",
          "https://b6.3ddd.ru/media/cache/tuk_model_custom_filter_ang_ru/",
          "https://b7.3ddd.ru/media/cache/tuk_model_custom_filter_ang_ru/",
        ];

        const modelData = response.data.data.models[0];
        if (!modelData) {
          console.log(`No model data found for model: ${model}`);

          const defaultImageUrl = fs.readFileSync(
            "./src/assets/noImageFound.jpg"
          );
          const imgBase64 = Buffer.from(defaultImageUrl, "binary").toString(
            "base64"
          );

          eventSender.send("modelImageEvent", {
            modelName: model,
            title: "Model not found",
            image: "data:image/png;base64," + imgBase64,
          });

          const imageName = "noImageFound.jpg";
          const newImagePath = `${imagePath}/${imageName}`;

          result.push({
            model,
            title: "NO TITLE",
            path: newImagePath,
          });

          return;
        }

        const firstImage = modelData.images[0];
        const titleEn = modelData.title_en;
        const slug = modelData.slug;

        if (firstImage && response.status >= 200 && response.status < 300) {
          for (const backend of backends3dd) {
            const fullImageUrl = `${backend}${firstImage.web_path}`;
            imageFound = true;
            console.log(fullImageUrl, "fullImageUrl!!!!!!");

            const rxName = /\/([^\/]+)$/;
            const imageNameMatch = fullImageUrl.match(rxName);
            const imageName = imageNameMatch && imageNameMatch[1];

            if (!imageName) {
              console.error(
                "Failed to extract image name from URL:",
                fullImageUrl
              );
              continue;
            }

            const newImagePath = `${imagePath}/${imageName}`;
            console.log(titleEn);
            console.log(slug);

            const imageResponse = await axios.get(fullImageUrl, {
              responseType: "arraybuffer",
              timeout: 30000,
            });

            const imageBinaryData = imageResponse.data;

            const compressedImage = await jimp.read(imageBinaryData);
            await compressedImage.writeAsync(newImagePath);
            const img64 = await compressedImage.getBase64Async(jimp.MIME_PNG);

            eventSender.send("modelImageEvent", {
              modelName: model,
              title: titleEn,
              image: img64,
            });

            result.push({
              model,
              title: titleEn,
              path: newImagePath,
            });

            eventSender.send("modelSavedEvent", model);

            break;
          }
        } else {
          console.log(`No image found for model: ${model}`);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`No image found for model: ${model}`);
        } else {
          console.log("NOT FOUND ", model);
        }
      }
    }
  }
  return result;
}