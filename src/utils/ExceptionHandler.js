export class ExceptionHandler {
  status;
  err;
  message;
  constructor(status, err, message) {
    this.status = status;
    this.err = err;
    this.message = message;
  }
}
