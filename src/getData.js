import fs from "fs";
import axios from "axios";
import jimp from "jimp";

export async function fetchData(modelsList, imagePath, titleText, eventSender) {
  const result = [];
  for (const model of modelsList) {
    try {
      await postDataWithRetry(model, 3); // Попробуем 3 раза
    } catch (err) {
      console.error(`Error processing model ${model}:`, err);
    }
  }

  async function postDataWithRetry(model, retries, delay = 3000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await postData(model);
        break; // Если запрос успешен, выходим из цикла
      } catch (error) {
        if (attempt === retries || !isSocketError(error)) {
          console.error(`Final attempt failed for model ${model}:`, error);
          throw error; // Если исчерпали попытки или ошибка не связана с socket, выбрасываем ошибку
        }
        console.warn(
          `Attempt ${attempt} failed for model ${model}, retrying in ${
            delay / 1000
          } seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, delay)); // Ждём перед следующей попыткой
      }
    }
  }

  async function postData(model) {
    try {
      const response = await axios.post(
        "https://3ddd.ru/api/models",
        { query: model },
        { timeout: 60000 }
      );

      console.log(`Received response for model: ${model}`);

      const backends3dd = [
        "https://b5.3ddd.ru/media/cache/tuk_model_custom_filter_ang_ru/",
        "https://b6.3ddd.ru/media/cache/tuk_model_custom_filter_ang_ru/",
        "https://b7.3ddd.ru/media/cache/tuk_model_custom_filter_ang_ru/",
      ];

      const modelData = response.data.data.models[0];
      //if image not found

      
      if (!modelData) {
        console.log(`No model data found for model: ${model}`);
        const defaultImageUrl = fs.readFileSync(
          "./src/assets/noImageFound.jpg"
        );
         
        // const safeModelName = model.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        // const newImagePath = `${imagePath}/${safeModelName}.jpg`;
        const newImagePath = `${imagePath}/${model}.jpg`;
        fs.writeFileSync(newImagePath, defaultImageUrl);

        const imgBase64 = Buffer.from(defaultImageUrl, "binary").toString(
          "base64"
        );

        eventSender.send("modelImageEvent", {
          modelName: model,
          title: "Model not found",
          image: "./src/assets/noImageFound.jpg", // Используем оригинальный путь для отображения
        });
        
        result.push({ model, title: "NO TITLE", path: newImagePath });

        return;
      }

      const firstImage = modelData.images[0];
      const titleEn = modelData.title_en;
      const slug = modelData.slug;

      let imageFound = false;
      if (firstImage) {
        for (const backend of backends3dd) {
          const fullImageUrl = `${backend}${firstImage.web_path}`;
          imageFound = true;
          console.log(fullImageUrl, "fullImageUrl");

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
            timeout: 60000,
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
      console.error(`Error processing model ${model}:`, error.message);
      if (error.response) {
        console.error(`Response status: ${error.response.status}`);
        console.error(`Response data: ${error.response.data}`);
      }
      throw error;
    }
  }

  function isSocketError(error) {
    return error.code === "ECONNRESET" || error.code === "ECONNABORTED";
  }

  return result;
}
