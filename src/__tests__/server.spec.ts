import { Server } from '../server'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import routerRoutes from '../api/routes/router.routes'
import { errorHandler } from '../middleware/error.middleware'
import { config } from '../config/config'

jest.mock('express', () => {
  const mockApp = {
    use: jest.fn(),
    listen: jest.fn().mockImplementation((port, callback) => {
      callback()
      return { on: jest.fn() }
    })
  }
  const mockExpress: any = jest.fn(() => mockApp)
  mockExpress.json = jest.fn()
  mockExpress.urlencoded = jest.fn()
  return mockExpress
})

jest.mock('cors', () => jest.fn())
jest.mock('helmet', () => jest.fn())
jest.mock('../api/routes/router.routes', () => ({}))
jest.mock('../middleware/error.middleware', () => ({
  errorHandler: jest.fn()
}))
jest.mock('../config/config', () => ({
  config: {
    port: 3000
  }
}))

describe('Server', () => {
  let server: Server
  let mockExpressApp: any
  let consoleSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()

    mockExpressApp = express()
    consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    server = new Server()
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('should configure middleware correctly on initialization', () => {
    expect(mockExpressApp.use).toHaveBeenCalledWith(helmet())
    expect(mockExpressApp.use).toHaveBeenCalledWith(cors())
    expect(mockExpressApp.use).toHaveBeenCalledWith(express.json())
    expect(mockExpressApp.use).toHaveBeenCalledWith(
      express.urlencoded({ extended: true })
    )
  })

  it('should configure routes correctly on initialization', () => {
    expect(mockExpressApp.use).toHaveBeenCalledWith('/api', routerRoutes)
  })

  it('should configure error handling correctly on initialization', () => {
    expect(mockExpressApp.use).toHaveBeenCalledWith(errorHandler)
  })

  it('should start server on specified port', () => {
    server.start()

    expect(mockExpressApp.listen).toHaveBeenCalledWith(
      config.port,
      expect.any(Function)
    )
    expect(consoleSpy).toHaveBeenCalledWith(
      `Server is running on port ${config.port}`
    )
  })

  it('should initialize all configurations in constructor', () => {
    const configureMiddlewareSpy = jest.spyOn(
      Server.prototype as any,
      'configureMiddleware'
    )
    const configureRoutesSpy = jest.spyOn(
      Server.prototype as any,
      'configureRoutes'
    )
    const configureErrorHandlingSpy = jest.spyOn(
      Server.prototype as any,
      'configureErrorHandling'
    )

    const newServer = new Server()

    expect(configureMiddlewareSpy).toHaveBeenCalledTimes(1)
    expect(configureRoutesSpy).toHaveBeenCalledTimes(1)
    expect(configureErrorHandlingSpy).toHaveBeenCalledTimes(1)

    configureMiddlewareSpy.mockRestore()
    configureRoutesSpy.mockRestore()
    configureErrorHandlingSpy.mockRestore()
  })
})
