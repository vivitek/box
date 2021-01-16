import { BaseError } from './BaseError'

export class FailedToBind extends BaseError {
  constructor(msg?: string) {
    super(msg || 'Failed to bind MAC address')
  }
}

export class DHCPError extends BaseError {
  constructor(msg?: string) {
    super(msg || 'An Error Occured in the DHCP Server')
  }
}

export class RequestError extends BaseError {
  constructor(msg?: string) {
    super(msg || 'Error in received message')
  }
}

export class ListeningError extends BaseError {
  constructor(msg?: string) {
    super(msg || 'Error while listening on designated port')
  }
}