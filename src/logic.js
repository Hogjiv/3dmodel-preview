import fs from "fs";
import { readdir } from "fs/promises";
import axios from "axios";
import jimp from "jimp";
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

export async function fetchData(modelsList, imagePath, titleText, eventSender) {
  const result = [];
  for (const model of modelsList) {
    let imageFound = false;

    try {
      await postData(model);
    } catch (err) {
      console.error(`Error processing model ${model}:`, err);
    }

    async function postData(model) {
      try {
        const response = await axios.post("https://3ddd.ru/api/models", {
          query: model,
        });
        console.log(`Received response for model: ${model}`);

        const backends3dd = [
          "https://b5.3ddd.ru/media/cache/tuk_model_custom_filter_ang_ru/",
          "https://b6.3ddd.ru/media/cache/tuk_model_custom_filter_ang_ru/",
          "https://b7.3ddd.ru/media/cache/tuk_model_custom_filter_ang_ru/",
        ];

        const modelData = response.data.data.models[0];
        if (!modelData) {
          console.log(`No model data found for model: ${model}`);
          const defaultImageUrl = fs.readFileSync("./src/assets/noImageFound.jpg");
          const imgBase64 = Buffer.from(defaultImageUrl, "binary").toString("base64");
          eventSender.send("modelImageEvent", {
            modelName: model,
            title: "Model not found",
            image: "data:image/png;base64," + imgBase64,
          });
          const imageName = "noImageFound.jpg";
          const newImagePath = `${imagePath}/${imageName}`;
          result.push({ model, title: "NO TITLE", path: newImagePath });
          return;
        }

        const firstImage = modelData.images[0];
        const titleEn = modelData.title_en;
        const slug = modelData.slug;

        if (firstImage) {
          for (const backend of backends3dd) {
            const fullImageUrl = `${backend}${firstImage.web_path}`;
            imageFound = true;
            console.log(fullImageUrl, "fullImageUrl");

            const rxName = /\/([^\/]+)$/;
            const imageNameMatch = fullImageUrl.match(rxName);
            const imageName = imageNameMatch && imageNameMatch[1];
            if (!imageName) {
              console.error("Failed to extract image name from URL:", fullImageUrl);
              continue;
            }

            const newImagePath = `${imagePath}/${imageName}`;
            console.log(titleEn);
            console.log(slug);

            const imageResponse = await axios.get(fullImageUrl, {
              responseType: "arraybuffer",
              timeout: 40000,
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
            console.log(`Completed processing for model: ${model}`);
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
          console.error(`Error processing model ${model}:`, error);
        }
      }
    }
  }
  return result;
}

