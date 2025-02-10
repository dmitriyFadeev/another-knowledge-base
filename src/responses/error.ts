export class ErrorResponse {
  constructor(error: Error) {
    this.success = false;
    this.data = null;
    this.error = error.message;
  }

  public success: boolean;

  public data: null;

  public error: string;
}
