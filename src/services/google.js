import { ExceptionHandler } from "../utils/ExceptionHandler.js";
import { ResponseHandler } from "../utils/ResponseHandler.js";
import { getRootPath, saveFile } from "../utils/files.js";
import { getDriveService } from "./basic.js";

export const readAndDownloadFile = async (filenameQuery, options) => {
  try {
    // Init drive service, it will handle all authorization from now on
    const driveService = getDriveService(options);

    // Create the request
    const response = await driveService.files.list({
      q: `name contains '${filenameQuery}'`,
    });

    const files = response?.data?.files;

    if (!files || !files.length) {
      throw new ExceptionHandler(
        404,
        "Files not found",
        `Files with ${filenameQuery} as filename were not found.`
      );
    }

    const firstFileId = files[0].id;

    const file = await driveService.files.get(
      {
        fileId: firstFileId,
        alt: "media",
      },
      {
        responseType: "stream",
      }
    );

    const filename = response?.data?.files[0].name;

    // Save file
    await saveFile("downloads", filename, file.data);

    // // Handle response
    return { data: { ...response.data, filename } };
  } catch (err) {
    console.error("Error at read file: ", err);
  }
};

export const getKeyFilePath = (credsPath) => getRootPath() + credsPath;
