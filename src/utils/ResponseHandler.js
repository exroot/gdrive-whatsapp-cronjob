import { ExceptionHandler } from "./ExceptionHandler.js";

export class ResponseHandler {
  status;
  message;
  constructor(response) {
    this.status = response.status;
    this.message = message.message;
    this.logger(response);
  }

  logger(response) {
    switch (response.status) {
      case 200:
        console.log("Response: ", response.data);
        break;
      case 400:
        throw new ExceptionHandler(
          response.status,
          response.data,
          "Bad request"
        );
      default:
        break;
    }
  }
}
