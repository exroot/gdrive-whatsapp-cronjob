import { ExceptionHandler } from "./ExceptionHandler.js";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

const dirname = fileURLToPath(import.meta.url);
const rootPath = path.join(dirname + "/../../");

export const saveFile = async (foldername, filename, file) => {
  try {
    const folderPath = rootPath + foldername;
    await createOrEnsureDir(folderPath);
    const filePath = rootPath + path.join(foldername + "/" + filename);
    return fs.promises.writeFile(filePath, file);
  } catch (err) {
    if (err.status) {
      throw err;
    }
    throw new ExceptionHandler(
      500,
      "Error saving file",
      `An error while writring file on disk has occurred.`
    );
  }
};

export const getFile = async (foldername, filename) => {
  try {
    const folderPath = rootPath + foldername;
    await createOrEnsureDir(folderPath);
    const filePath = rootPath + path.join(foldername + "/" + filename);
    const fileExists = fs.existsSync(filePath);
    if (!fileExists) {
      throw new ExceptionHandler(
        500,
        "Error while getting file",
        "No se encuentra ningun archivo en la ruta: " +
          filePath +
          "\n\nPor favor agregue el archivo a la ruta."
      );
    }
    return fs.promises.readFileSync(filePath);
  } catch (err) {
    if (err.status) {
      throw err;
    }
    throw new ExceptionHandler(
      500,
      "Error getting file",
      `An error while reading file on disk has occurred.`
    );
  }
};

export const getFilePath = async (pathToSearch) => {
  try {
    const filePath = rootPath + path.join(pathToSearch);
    const fileExists = fs.existsSync(filePath);
    if (!fileExists) {
      throw new ExceptionHandler(
        500,
        "Error while getting file",
        "No se encuentra ningun archivo en la ruta: " +
          filePath +
          "\n\nPor favor agregue el archivo a la ruta."
      );
    }
    return filePath;
  } catch (err) {
    if (err.status) {
      throw err;
    }
    throw new ExceptionHandler(
      500,
      "Error getting file",
      `An error while reading file on disk has occurred.`
    );
  }
};

export const getRootPath = () => rootPath;

export const getGoogleServiceOptions = (auth) => {
  return {
    version: "v3",
    auth,
  };
};

const createOrEnsureDir = async (path) => {
  if (!fs.existsSync(path)) {
    console.log("path: ", path);
    return fs.promises.mkdir(path);
  }
};
