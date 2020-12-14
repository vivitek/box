import { BaseError } from './BaseError'

export class ErrQueueNotDefined extends BaseError {
  constructor(msg?: string) {
    super(msg || 'Queue is not defined')
  }
}

export class ErrInvalidConnectionString extends BaseError {
  constructor(msg?: string) {
    super(msg || 'Invalid Connection String')
  }
}

export class ErrConnectionFailed extends BaseError {
  constructor(msg?: string) {
    super(msg || 'Error While Connecting to RabbitMQ')
  }
}
