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
        const fullRouterStatus = response.data

        return {
          wifiSettings: {
            enabled: fullRouterStatus.wifiSettings.enabled,
            ssid: fullRouterStatus.wifiSettings.ssid,
            securityType: fullRouterStatus.wifiSettings.securityType,
            channel: fullRouterStatus.wifiSettings.channel,
            frequency: fullRouterStatus.wifiSettings.frequency
            // Note: password is intentionally omitted
          },
          networkSettings: {
            ipAddress: fullRouterStatus.networkSettings.ipAddress,
            subnetMask: fullRouterStatus.networkSettings.subnetMask,
            gateway: fullRouterStatus.networkSettings.gateway,
            primaryDNS: fullRouterStatus.networkSettings.primaryDNS,
            secondaryDNS: fullRouterStatus.networkSettings.secondaryDNS
          },
          securitySettings: {
            firewallEnabled: fullRouterStatus.securitySettings.firewallEnabled,
            vpnEnabled: fullRouterStatus.securitySettings.vpnEnabled,
            parentalControlsEnabled:
              fullRouterStatus.securitySettings.parentalControlsEnabled
          },
          connectedDevices: fullRouterStatus.connectedDevices || []
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
   * Get the current WiFi status
   */
  public static async getWifiStatus(): Promise<boolean> {
    try {
      const routerStatus = await this.getRouterStatus()
      return routerStatus.wifiSettings.enabled
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching WiFi status:', error)
        throw new Error(`Failed to get WiFi status: ${error.message}`)
      } else {
        console.error('Unknown error fetching WiFi status:', error)
        throw new Error('Failed to get WiFi status: Unknown error')
      }
    }
  }

  /**
   * Enable WiFi on the router
   */
  public static async enableWifi(): Promise<RouterResponse> {
    try {
      const isEnabled = await this.getWifiStatus()
      if (isEnabled) {
        return {
          success: true,
          message: 'WiFi is already enabled'
        }
      }

      const token = await RouterAuth.getAuthToken()
      const routerIp = config.router.ipAddress

      const response = await axios.post(
        `http://${routerIp}${config.router.wifiEndpoint}`,
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
      const isEnabled = await this.getWifiStatus()

      if (!isEnabled) {
        return {
          success: true,
          message: 'WiFi is already disabled'
        }
      }

      const token = await RouterAuth.getAuthToken()
      const routerIp = config.router.ipAddress

      const response = await axios.post(
        `http://${routerIp}${config.router.wifiEndpoint}`,
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
   * Get the current firewall status
   */
  public static async getFirewallStatus(): Promise<boolean> {
    try {
      const routerStatus = await this.getRouterStatus()
      return routerStatus.securitySettings.firewallEnabled
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching firewall status:', error)
        throw new Error(`Failed to get firewall status: ${error.message}`)
      } else {
        console.error('Unknown error fetching firewall status:', error)
        throw new Error('Failed to get firewall status: Unknown error')
      }
    }
  }

  /**
   * Enable firewall on the router
   */
  public static async enableFirewall(): Promise<RouterResponse> {
    try {
      const isEnabled = await this.getFirewallStatus()

      if (isEnabled) {
        return {
          success: true,
          message: 'Firewall is already enabled'
        }
      }

      const token = await RouterAuth.getAuthToken()
      const routerIp = config.router.ipAddress

      const response = await axios.post(
        `http://${routerIp}${config.router.firewallEndpoint}`,
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
      const isEnabled = await this.getFirewallStatus()

      if (!isEnabled) {
        return {
          success: true,
          message: 'Firewall is already disabled'
        }
      }

      const token = await RouterAuth.getAuthToken()
      const routerIp = config.router.ipAddress

      const response = await axios.post(
        `http://${routerIp}${config.router.firewallEndpoint}`,
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
        `http://${routerIp}${config.router.passwordEndpoint}`,
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

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError
        if (error.response?.data?.message) {
          console.error('Error changing password:', error.response.data.message)
          throw new Error(
            `Failed to change password: ${error.response.data.message}`
          )
        }

        throw new Error(`Failed to change password: ${axiosError.message}`)
      } else if (error instanceof Error) {
        console.error('Error changing password:', error)
        throw new Error(`Failed to change password: ${error.message}`)
      } else {
        console.error('Unknown error changing password:', error)
        throw new Error('Failed to change password: Unknown error')
      }
    }
  }
}
