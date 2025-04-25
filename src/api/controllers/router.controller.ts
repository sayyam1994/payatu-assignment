import { Request, Response, NextFunction } from 'express'
import { RouterService } from '../services/router.service'

export class RouterController {
  /**
   * Get router status information
   */
  public static async getStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const routerStatus = await RouterService.getRouterStatus()
      res.status(200).json(routerStatus)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Enable WiFi
   */
  public static async enableWifi(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = await RouterService.enableWifi()
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Disable WiFi
   */
  public static async disableWifi(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = await RouterService.disableWifi()
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Enable firewall
   */
  public static async enableFirewall(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = await RouterService.enableFirewall()
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Disable firewall
   */
  public static async disableFirewall(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response = await RouterService.disableFirewall()
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Change router password
   */
  public static async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { newPassword } = req.body

      if (!newPassword) {
        res.status(400).json({
          success: false,
          message: 'New password is required'
        })
        return
      }

      const response = await RouterService.changePassword(newPassword)
      res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }
}
