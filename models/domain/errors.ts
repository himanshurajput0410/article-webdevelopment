export class RepositoryError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number | null = null,
  ) {
    super(message)
    this.name = 'RepositoryError'
  }
}

export class NotFoundError extends RepositoryError {
  constructor(message = 'Not found') {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends RepositoryError {
  constructor(message = 'You need to log in to do that.') {
    super(message, 401)
    this.name = 'UnauthorizedError'
  }
}

export class ValidationError extends RepositoryError {
  constructor(
    message: string,
    public readonly fieldErrors?: Record<string, string>,
  ) {
    super(message, 422)
    this.name = 'ValidationError'
  }
}

export class CancelledError extends RepositoryError {
  constructor(message = 'Request was cancelled') {
    super(message, null)
    this.name = 'CancelledError'
  }
}
