class CustomError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const errorMessages: Record<number, string> = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict",
};

const ErrorHandler = (
  status: number,
  message: string = errorMessages[status]
) => {
  const error = new CustomError(status, message);
  error.status = status;
  return error;
};

export default ErrorHandler;
