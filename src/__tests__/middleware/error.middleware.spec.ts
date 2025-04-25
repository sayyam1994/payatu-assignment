import { Request, Response, NextFunction } from 'express'
import { errorHandler } from '../../middleware/error.middleware'

describe('Error Middleware', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction
  let consoleErrorSpy: jest.SpyInstance

  beforeEach(() => {
    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    mockNext = jest.fn()

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
  })

  afterEach(() => {
    consoleErrorSpy.mockRestore()
  })

  it('should respond with 500 status and error message', () => {
    const testError = new Error('Test error message')

    errorHandler(
      testError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    )

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Test error message')
    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Test error message'
    })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should use default message when error has no message', () => {
    const errorWithoutMessage = new Error()
    errorWithoutMessage.message = ''

    errorHandler(
      errorWithoutMessage,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    )

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: ')
    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal Server Error'
    })
  })

  it('should handle errors with custom properties', () => {
    class CustomError extends Error {
      statusCode: number

      constructor(message: string, statusCode: number) {
        super(message)
        this.statusCode = statusCode
      }
    }

    const customError = new CustomError('Custom error', 400)

    errorHandler(
      customError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    )

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Custom error')
    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Custom error'
    })
  })
})
