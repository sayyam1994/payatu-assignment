import { Request, Response, NextFunction } from 'express'
import { RouterController } from '../../api/controllers/router.controller'
import { RouterService } from '../../api/services/router.service'

jest.mock('../../api/services/router.service')

describe('RouterController', () => {
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockNext: NextFunction

  beforeEach(() => {
    jest.clearAllMocks()

    mockRequest = {}
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    }
    mockNext = jest.fn()
  })

  describe('getStatus', () => {
    it('should return router status on success', async () => {
      const routerStatus = {
        model: 'RouterModel123',
        firmwareVersion: '1.0.0',
        macAddress: 'AA:BB:CC:DD:EE:FF',
        serialNumber: 'SN123456789',
        uptime: '48 hours'
      }

      jest
        .spyOn(RouterService, 'getRouterStatus')
        .mockResolvedValueOnce(routerStatus)

      await RouterController.getStatus(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      )

      expect(RouterService.getRouterStatus).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(routerStatus)
    })

    it('should call next with error when service throws error', async () => {
      const error = new Error('Failed to get router status')
      jest.spyOn(RouterService, 'getRouterStatus').mockRejectedValueOnce(error)

      await RouterController.getStatus(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      )

      expect(RouterService.getRouterStatus).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).not.toHaveBeenCalled()
      expect(mockResponse.json).not.toHaveBeenCalled()
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  describe('enableWifi', () => {
    it('should enable WiFi on success', async () => {
      const serviceResponse = {
        success: true,
        message: 'WiFi has been enabled'
      }

      jest
        .spyOn(RouterService, 'enableWifi')
        .mockResolvedValueOnce(serviceResponse)

      await RouterController.enableWifi(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      )

      expect(RouterService.enableWifi).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(serviceResponse)
    })

    it('should call next with error when service throws error', async () => {
      const error = new Error('Failed to enable WiFi')
      jest.spyOn(RouterService, 'enableWifi').mockRejectedValueOnce(error)

      await RouterController.enableWifi(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      )

      expect(RouterService.enableWifi).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).not.toHaveBeenCalled()
      expect(mockResponse.json).not.toHaveBeenCalled()
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  describe('disableWifi', () => {
    it('should disable WiFi on success', async () => {
      const serviceResponse = {
        success: true,
        message: 'WiFi has been disabled'
      }

      jest
        .spyOn(RouterService, 'disableWifi')
        .mockResolvedValueOnce(serviceResponse)

      await RouterController.disableWifi(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      )

      expect(RouterService.disableWifi).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(serviceResponse)
    })

    it('should call next with error when service throws error', async () => {
      const error = new Error('Failed to disable WiFi')
      jest.spyOn(RouterService, 'disableWifi').mockRejectedValueOnce(error)

      await RouterController.disableWifi(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      )

      expect(RouterService.disableWifi).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).not.toHaveBeenCalled()
      expect(mockResponse.json).not.toHaveBeenCalled()
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  describe('enableFirewall', () => {
    it('should enable firewall on success', async () => {
      const serviceResponse = {
        success: true,
        message: 'Firewall has been enabled'
      }

      jest
        .spyOn(RouterService, 'enableFirewall')
        .mockResolvedValueOnce(serviceResponse)

      await RouterController.enableFirewall(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      )

      expect(RouterService.enableFirewall).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(serviceResponse)
    })

    it('should call next with error when service throws error', async () => {
      const error = new Error('Failed to enable firewall')
      jest.spyOn(RouterService, 'enableFirewall').mockRejectedValueOnce(error)

      await RouterController.enableFirewall(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      )

      expect(RouterService.enableFirewall).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).not.toHaveBeenCalled()
      expect(mockResponse.json).not.toHaveBeenCalled()
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  describe('disableFirewall', () => {
    it('should disable firewall on success', async () => {
      const serviceResponse = {
        success: true,
        message: 'Firewall has been disabled'
      }

      jest
        .spyOn(RouterService, 'disableFirewall')
        .mockResolvedValueOnce(serviceResponse)

      await RouterController.disableFirewall(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      )

      expect(RouterService.disableFirewall).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(serviceResponse)
    })

    it('should call next with error when service throws error', async () => {
      const error = new Error('Failed to disable firewall')
      jest.spyOn(RouterService, 'disableFirewall').mockRejectedValueOnce(error)

      await RouterController.disableFirewall(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      )

      expect(RouterService.disableFirewall).toHaveBeenCalledTimes(1)
      expect(mockResponse.status).not.toHaveBeenCalled()
      expect(mockResponse.json).not.toHaveBeenCalled()
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })

  describe('changePassword', () => {
    it('should change password when valid password provided', async () => {
      mockRequest = {
        body: {
          newPassword: 'securePassword123'
        }
      }

      const serviceResponse = {
        success: true,
        message: 'Router password has been changed'
      }

      jest
        .spyOn(RouterService, 'changePassword')
        .mockResolvedValueOnce(serviceResponse)

      await RouterController.changePassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      )

      expect(RouterService.changePassword).toHaveBeenCalledWith(
        'securePassword123'
      )
      expect(mockResponse.status).toHaveBeenCalledWith(200)
      expect(mockResponse.json).toHaveBeenCalledWith(serviceResponse)
    })

    it('should return 400 when no password provided', async () => {
      mockRequest = {
        body: {}
      }

      await RouterController.changePassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      )

      expect(RouterService.changePassword).not.toHaveBeenCalled()
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'New password is required'
      })
    })

    it('should call next with error when service throws error', async () => {
      mockRequest = {
        body: {
          newPassword: 'securePassword123'
        }
      }

      const error = new Error('Failed to change password')
      jest.spyOn(RouterService, 'changePassword').mockRejectedValueOnce(error)

      await RouterController.changePassword(
        mockRequest as Request,
        mockResponse as Response,
        mockNext as NextFunction
      )

      expect(RouterService.changePassword).toHaveBeenCalledWith(
        'securePassword123'
      )
      expect(mockResponse.status).not.toHaveBeenCalled()
      expect(mockResponse.json).not.toHaveBeenCalled()
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })
})
