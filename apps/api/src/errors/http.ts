export class HttpError extends Error {
  status: number;
  body: { message: string; [index: string]: unknown };

  constructor(
    status: number,
    body: { message: string; [index: string]: unknown },
    options?: ErrorOptions
  ) {
    super(body.message, options);
    this.name = this.constructor.name;
    this.status = status;
    this.body = body;
  }
}
