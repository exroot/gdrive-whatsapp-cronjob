import {
  initializeWhatsappClient,
  sendMessageMedia,
} from "./services/whatsapp.js";
import { getFilePath } from "./utils/files.js";
import { loadDriveAuthAndOptions } from "./services/basic.js";
import { getKeyFilePath, readAndDownloadFile } from "./services/google.js";
import cron from "node-cron";
import dotenv from "dotenv";

const loadDriveFile = async () => {
  const keyFilePath = getKeyFilePath("config/creds.json");
  const googleDriveScopes = ["https://www.googleapis.com/auth/drive"];
  const driveVersion = "v3";
  const { options } = loadDriveAuthAndOptions(
    keyFilePath,
    googleDriveScopes,
    driveVersion
  );
  const filenameQuery = "Formulario";
  const { data } = await readAndDownloadFile(filenameQuery, options);
  return data;
};

const scheduleMessages = (chatId, filePath, wsClient) => {
  const runEvery8Hours = "0 */8 * * *";
  cron.schedule(runEvery8Hours, () => {
    sendMessageMedia(chatId, filePath, wsClient);
    const localDateTime = new Date().toUTCString();
    console.log(`Message sended at ${localDateTime}`);
  });
};

const main = async () => {
  dotenv.config();
  try {
    console.log("Loading drive file... ");
    const fileData = await loadDriveFile();
    console.log("Initialize whatsapp client session... ");
    const wsClient = await initializeWhatsappClient("client123");
    console.log("Getting Chat ID from env... ");
    const chatId = process.env.CHAT_ID;
    console.log("Getting file path... ");
    const filePathToSearch = `downloads/${fileData.filename}`;
    const filePath = await getFilePath(filePathToSearch);
    console.log("Scheduling whatsapp messages: ");
    scheduleMessages(chatId, filePath, wsClient);
  } catch (err) {
    console.error(err);
  }
};

main();
