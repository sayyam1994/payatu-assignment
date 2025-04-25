/**
 * IMPORTANT DISCLAIMER:
 *
 * This router service is based on assumptions about router REST APIs.
 * The endpoints, authentication methods, and response structures are hypothetical
 * as they were created without access to a real router supporting REST APIs for configuration.
 *
 * For using this code with real router, these methods would need to be updated to match
 * the actual API specifications of the router being used.
 */

import axios, { AxiosError } from 'axios'
import { RouterAuth } from '../../utils/auth.util'
import { RouterStatus, RouterResponse } from '../../interfaces/router.interface'
import { config } from '../../config/config'

export class RouterService {
  /**
   * Get router status information
   */
  public static async getRouterStatus(): Promise<RouterStatus> {
    try {
      const token = await RouterAuth.getAuthToken()
      const routerIp = config.router.ipAddress

      const response = await axios.get(
        `http://${routerIp}${config.router.statusEndpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data) {
        return {
          model: response.data.model,
          firmwareVersion: response.data.firmwareVersion,
          macAddress: response.data.macAddress,
          serialNumber: response.data.serialNumber,
          uptime: response.data.uptime
        }
      }

      throw new Error('Failed to retrieve router status')
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError

        if (axiosError.response && axiosError.response.status === 401) {
          RouterAuth.resetAuthToken()
          return this.getRouterStatus()
        }

        console.error('Error fetching router status:', error)
        throw new Error(`Failed to get router status: ${axiosError.message}`)
      } else if (error instanceof Error) {
        console.error('Error fetching router status:', error)
        throw new Error(`Failed to get router status: ${error.message}`)
      } else {
        console.error('Unknown error fetching router status:', error)
        throw new Error('Failed to get router status: Unknown error')
      }
    }
  }

  /**
   * Enable WiFi on the router
   */
  public static async enableWifi(): Promise<RouterResponse> {
    try {
      const token = await RouterAuth.getAuthToken()
      const routerIp = config.router.ipAddress

      const response = await axios.post(
        `http://${routerIp}${config.router.wifiEndpoint}/enable`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      return {
        success: true,
        message: 'WiFi has been enabled'
      }
    } catch (error) {
      console.error('Error enabling WiFi:', error)

      if (error instanceof Error) {
        console.error('Error enabling WiFi:', error)
        throw new Error(`Failed to enable WiFi: ${error.message}`)
      } else {
        console.error('Unknown error enabling WiFi:', error)
        throw new Error('Failed to enable WiFi: Unknown error')
      }
    }
  }

  /**
   * Disable WiFi on the router
   */
  public static async disableWifi(): Promise<RouterResponse> {
    try {
      const token = await RouterAuth.getAuthToken()
      const routerIp = config.router.ipAddress

      const response = await axios.post(
        `http://${routerIp}${config.router.wifiEndpoint}/disable`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      return {
        success: true,
        message: 'WiFi has been disabled'
      }
    } catch (error) {
      console.error('Error disabling WiFi:', error)

      if (error instanceof Error) {
        console.error('Error disabling WiFi:', error)
        throw new Error(`Failed to disable WiFi: ${error.message}`)
      } else {
        console.error('Unknown error disabling WiFi:', error)
        throw new Error('Failed to disable WiFi: Unknown error')
      }
    }
  }

  /**
   * Enable firewall on the router
   */
  public static async enableFirewall(): Promise<RouterResponse> {
    try {
      const token = await RouterAuth.getAuthToken()
      const routerIp = config.router.ipAddress

      const response = await axios.post(
        `http://${routerIp}${config.router.firewallEndpoint}/enable`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      return {
        success: true,
        message: 'Firewall has been enabled'
      }
    } catch (error) {
      console.error('Error enabling firewall:', error)

      if (error instanceof Error) {
        console.error('Error enabling firewall:', error)
        throw new Error(`Failed to enable firewall: ${error.message}`)
      } else {
        console.error('Unknown error enabling firewall:', error)
        throw new Error('Failed to enable firewall: Unknown error')
      }
    }
  }

  /**
   * Disable firewall on the router
   */
  public static async disableFirewall(): Promise<RouterResponse> {
    try {
      const token = await RouterAuth.getAuthToken()
      const routerIp = config.router.ipAddress

      const response = await axios.post(
        `http://${routerIp}${config.router.firewallEndpoint}/disable`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      return {
        success: true,
        message: 'Firewall has been disabled'
      }
    } catch (error) {
      console.error('Error disabling firewall:', error)

      if (error instanceof Error) {
        console.error('Error disabling firewall:', error)
        throw new Error(`Failed to disable firewall: ${error.message}`)
      } else {
        console.error('Unknown error disabling firewall:', error)
        throw new Error('Failed to disable firewall: Unknown error')
      }
    }
  }

  /**
   * Change router password
   */
  public static async changePassword(
    newPassword: string
  ): Promise<RouterResponse> {
    try {
      const token = await RouterAuth.getAuthToken()
      const routerIp = config.router.ipAddress

      const response = await axios.post(
        `http://${routerIp}${config.router.passwordEndpoint}/change`,
        {
          newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      RouterAuth.resetAuthToken()

      return {
        success: true,
        message: 'Router password has been changed'
      }
    } catch (error) {
      console.error('Error changing password:', error)

      if (error instanceof Error) {
        console.error('Error changing password:', error)
        throw new Error(`Failed to change password: ${error.message}`)
      } else {
        console.error('Unknown error changing password:', error)
        throw new Error('Failed to change password: Unknown error')
      }
    }
  }
}
