import * as fs from 'fs'
import { Logger } from './Logger'

jest.mock('fs')

const logger = {
  info: jest.fn(),
  warn: jest.fn(),
} as Record<keyof Console, jest.Mock>

/* eslint-disable @typescript-eslint/no-empty-function */
jest.mock('console', () => ({
  __esModule: true,
  Console: class ConsoleMock {
    constructor() {}

    warn = logger.warn
    info = logger.info
  },
}))
/* eslint-enable @typescript-eslint/no-empty-function */

test('should init without error', () => {
  // const log = new Logger()

  expect(fs.createWriteStream).toHaveBeenCalled()
})

test('`info` should work without error', () => {
  const log = new Logger()

  log.info('foo')

  expect(logger.info).toHaveBeenCalled()
})

test('`warn` should work without error', () => {
  const log = new Logger()

  log.warn('baz')

  expect(logger.warn).toHaveBeenCalled()
})
