import Whatsapp from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { ExceptionHandler } from "../utils/ExceptionHandler.js";

export const initializeWhatsappClient = async (clientId) => {
  try {
    const client = new Whatsapp.Client({
      authStrategy: new Whatsapp.LocalAuth({
        clientId,
      }),
    });

    return new Promise((resolve) => {
      client.initialize();

      client.on("qr", (qr) => {
        qrcode.generate(qr, { small: true });
      });

      client.on("ready", () => {
        resolve(client);
      });
    });
  } catch (err) {
    console.error(`Error at createWhatsappClient: `, err);
    throw new ExceptionHandler(
      500,
      `Error at createWhatsappClient`,
      `Error at createWhatsappClient`
    );
  }
};

export const sendMessageMedia = (chatId, filePath, client) => {
  try {
    const media = Whatsapp.MessageMedia.fromFilePath(filePath);
    client.sendMessage(chatId, media, {
      caption: "File updated",
    });
  } catch (err) {
    console.error("Error at sendMessageMedia:", err);
    throw err;
  }
};
