class CustomError extends Error {
  public readonly statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class BadRequestError extends CustomError {
  constructor(message: string = "Bad Request") {
    super(400, message);
  }
}

class AuthenticationError extends CustomError {
  constructor(message = "Unauthenticated") {
    super(401, message);
  }
}

class AuthorizationError extends CustomError {
  constructor(message = "Forbidden") {
    super(403, message);
  }
}

class NotFoundError extends CustomError {
  constructor(message = "Resource not found") {
    super(404, message);
  }
}

class NotAllowedError extends CustomError {
  constructor(message = "Method Not Allowed") {
    super(405, message);
  }
}

class ConflictError extends CustomError {
  constructor(message = "Conflict Error") {
    super(409, message);
  }
}

export {
  NotAllowedError,
  NotFoundError,
  BadRequestError,
  AuthenticationError,
  AuthorizationError,
  ConflictError,
  CustomError,
};
