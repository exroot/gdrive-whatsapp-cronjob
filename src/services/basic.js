import { google } from "googleapis";

export const getDriveService = (options) => {
  return google.drive(options);
};

export const loadDriveAuthAndOptions = (keyFile, scopes, driveVersion) => {
  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes,
  });
  return {
    auth,
    options: {
      auth,
      version: driveVersion,
    },
  };
};
