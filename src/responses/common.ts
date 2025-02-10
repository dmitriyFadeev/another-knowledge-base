export class CommonResponse<T> {
  constructor(data: T) {
    this.success = true;
    this.data = data;
    this.error = null;
  }

  public success: boolean;

  public data: T;

  public error: null;
}
