import axios from 'axios'
import { RouterService } from '../../api/services/router.service'
import { RouterAuth } from '../../utils/auth.util'
import { config } from '../../config/config'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>
jest.mock('../../utils/auth.util', () => ({
  RouterAuth: {
    getAuthToken: jest.fn().mockResolvedValue('mock-token'),
    resetAuthToken: jest.fn()
  }
}))

describe('RouterService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getRouterStatus', () => {
    it('should return router status when API call is successful', async () => {
      const mockResponseData = {
        wifiSettings: {
          enabled: true,
          ssid: 'TestWiFi',
          securityType: 'WPA2',
          channel: 6,
          frequency: '2.4GHz'
        },
        networkSettings: {
          ipAddress: '192.168.1.1',
          subnetMask: '255.255.255.0',
          gateway: '192.168.1.1',
          primaryDNS: '8.8.8.8',
          secondaryDNS: '8.8.4.4'
        },
        securitySettings: {
          firewallEnabled: true,
          vpnEnabled: false,
          parentalControlsEnabled: false
        },
        connectedDevices: []
      }

      mockedAxios.get.mockResolvedValueOnce({ data: mockResponseData })

      const result = await RouterService.getRouterStatus()

      expect(mockedAxios.get).toHaveBeenCalledWith(
        `http://${config.router.ipAddress}${config.router.statusEndpoint}`,
        { headers: { Authorization: `Bearer mock-token` } }
      )
      expect(result).toEqual({
        wifiSettings: {
          enabled: true,
          ssid: 'TestWiFi',
          securityType: 'WPA2',
          channel: 6,
          frequency: '2.4GHz'
        },
        networkSettings: {
          ipAddress: '192.168.1.1',
          subnetMask: '255.255.255.0',
          gateway: '192.168.1.1',
          primaryDNS: '8.8.8.8',
          secondaryDNS: '8.8.4.4'
        },
        securitySettings: {
          firewallEnabled: true,
          vpnEnabled: false,
          parentalControlsEnabled: false
        },
        connectedDevices: []
      })
    })

    it('should retry when receiving 401 unauthorized error', async () => {
      const mockResponseData = {
        wifiSettings: {
          enabled: true,
          ssid: 'TestWiFi',
          securityType: 'WPA2',
          channel: 6,
          frequency: '2.4GHz'
        },
        networkSettings: {
          ipAddress: '192.168.1.1',
          subnetMask: '255.255.255.0',
          gateway: '192.168.1.1',
          primaryDNS: '8.8.8.8',
          secondaryDNS: '8.8.4.4'
        },
        securitySettings: {
          firewallEnabled: true,
          vpnEnabled: false,
          parentalControlsEnabled: false
        },
        connectedDevices: []
      }

      const axiosError = new Error('Unauthorized')
      Object.defineProperty(axiosError, 'response', { value: { status: 401 } })

      mockedAxios.get
        .mockRejectedValueOnce(axiosError)
        .mockResolvedValueOnce({ data: mockResponseData })

      jest.spyOn(axios, 'isAxiosError').mockReturnValue(true)

      const result = await RouterService.getRouterStatus()

      expect(RouterAuth.resetAuthToken).toHaveBeenCalled()
      expect(mockedAxios.get).toHaveBeenCalledTimes(2)
      expect(result).toEqual({
        wifiSettings: {
          enabled: true,
          ssid: 'TestWiFi',
          securityType: 'WPA2',
          channel: 6,
          frequency: '2.4GHz'
        },
        networkSettings: {
          ipAddress: '192.168.1.1',
          subnetMask: '255.255.255.0',
          gateway: '192.168.1.1',
          primaryDNS: '8.8.8.8',
          secondaryDNS: '8.8.4.4'
        },
        securitySettings: {
          firewallEnabled: true,
          vpnEnabled: false,
          parentalControlsEnabled: false
        },
        connectedDevices: []
      })
    })

    it('should throw error when API call returns no data', async () => {
      mockedAxios.get.mockResolvedValueOnce({ data: null })

      await expect(RouterService.getRouterStatus()).rejects.toThrow(
        'Failed to retrieve router status'
      )
    })

    it('should throw error when API call fails with Axios error', async () => {
      const axiosError = new Error('Network error')
      Object.defineProperty(axiosError, 'isAxiosError', { value: true })

      mockedAxios.get.mockRejectedValueOnce(axiosError)
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(true)

      await expect(RouterService.getRouterStatus()).rejects.toThrow(
        'Failed to get router status: Network error'
      )
    })

    it('should throw error when API call fails with standard error', async () => {
      const error = new Error('Standard error')
      mockedAxios.get.mockRejectedValueOnce(error)
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(false)

      await expect(RouterService.getRouterStatus()).rejects.toThrow(
        'Failed to get router status: Standard error'
      )
    })

    it('should throw error when API call fails with unknown error', async () => {
      mockedAxios.get.mockRejectedValueOnce('Unknown error')
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(false)

      await expect(RouterService.getRouterStatus()).rejects.toThrow(
        'Failed to get router status: Unknown error'
      )
    })
  })

  describe('getWifiStatus', () => {
    it('should return wifi enabled status from router status', async () => {
      const mockRouterStatus = {
        wifiSettings: {
          enabled: true,
          ssid: 'TestWiFi',
          securityType: 'WPA2',
          channel: 6,
          frequency: '2.4GHz'
        },
        networkSettings: {
          ipAddress: '192.168.1.1',
          subnetMask: '255.255.255.0',
          gateway: '192.168.1.1',
          primaryDNS: '8.8.8.8',
          secondaryDNS: '8.8.4.4'
        },
        securitySettings: {
          firewallEnabled: true,
          vpnEnabled: false,
          parentalControlsEnabled: false
        },
        connectedDevices: []
      }

      jest
        .spyOn(RouterService, 'getRouterStatus')
        .mockResolvedValueOnce(mockRouterStatus)

      const result = await RouterService.getWifiStatus()

      expect(result).toBe(true)
    })

    it('should throw error when getRouterStatus fails', async () => {
      const error = new Error('Failed to get router status')
      jest.spyOn(RouterService, 'getRouterStatus').mockRejectedValueOnce(error)

      await expect(RouterService.getWifiStatus()).rejects.toThrow(
        'Failed to get WiFi status: Failed to get router status'
      )
    })

    it('should handle unknown errors', async () => {
      jest
        .spyOn(RouterService, 'getRouterStatus')
        .mockRejectedValueOnce('Unknown error')

      await expect(RouterService.getWifiStatus()).rejects.toThrow(
        'Failed to get WiFi status: Unknown error'
      )
    })
  })

  describe('enableWifi', () => {
    it('should return success message when WiFi is already enabled', async () => {
      jest.spyOn(RouterService, 'getWifiStatus').mockResolvedValueOnce(true)

      const result = await RouterService.enableWifi()

      expect(mockedAxios.post).not.toHaveBeenCalled()
      expect(result).toEqual({
        success: true,
        message: 'WiFi is already enabled'
      })
    })

    it('should enable WiFi when API call is successful', async () => {
      jest.spyOn(RouterService, 'getWifiStatus').mockResolvedValueOnce(false)
      mockedAxios.post.mockResolvedValueOnce({ data: { success: true } })

      const result = await RouterService.enableWifi()

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `http://${config.router.ipAddress}${config.router.wifiEndpoint}`,
        {},
        { headers: { Authorization: `Bearer mock-token` } }
      )
      expect(result).toEqual({
        success: true,
        message: 'WiFi has been enabled'
      })
    })

    it('should throw error when API call fails with standard error', async () => {
      jest.spyOn(RouterService, 'getWifiStatus').mockResolvedValueOnce(false)
      const error = new Error('Failed to enable WiFi')
      mockedAxios.post.mockRejectedValueOnce(error)

      await expect(RouterService.enableWifi()).rejects.toThrow(
        'Failed to enable WiFi: Failed to enable WiFi'
      )
    })

    it('should throw error when API call fails with unknown error', async () => {
      jest.spyOn(RouterService, 'getWifiStatus').mockResolvedValueOnce(false)
      mockedAxios.post.mockRejectedValueOnce('Unknown error')

      await expect(RouterService.enableWifi()).rejects.toThrow(
        'Failed to enable WiFi: Unknown error'
      )
    })
  })

  describe('disableWifi', () => {
    it('should return success message when WiFi is already disabled', async () => {
      jest.spyOn(RouterService, 'getWifiStatus').mockResolvedValueOnce(false)

      const result = await RouterService.disableWifi()

      expect(mockedAxios.post).not.toHaveBeenCalled()
      expect(result).toEqual({
        success: true,
        message: 'WiFi is already disabled'
      })
    })

    it('should disable WiFi when API call is successful', async () => {
      jest.spyOn(RouterService, 'getWifiStatus').mockResolvedValueOnce(true)
      mockedAxios.post.mockResolvedValueOnce({ data: { success: true } })

      const result = await RouterService.disableWifi()

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `http://${config.router.ipAddress}${config.router.wifiEndpoint}`,
        {},
        { headers: { Authorization: `Bearer mock-token` } }
      )
      expect(result).toEqual({
        success: true,
        message: 'WiFi has been disabled'
      })
    })

    it('should throw error when API call fails with standard error', async () => {
      jest.spyOn(RouterService, 'getWifiStatus').mockResolvedValueOnce(true)
      const error = new Error('Failed to disable WiFi')
      mockedAxios.post.mockRejectedValueOnce(error)

      await expect(RouterService.disableWifi()).rejects.toThrow(
        'Failed to disable WiFi: Failed to disable WiFi'
      )
    })

    it('should throw error when API call fails with unknown error', async () => {
      jest.spyOn(RouterService, 'getWifiStatus').mockResolvedValueOnce(true)
      mockedAxios.post.mockRejectedValueOnce('Unknown error')

      await expect(RouterService.disableWifi()).rejects.toThrow(
        'Failed to disable WiFi: Unknown error'
      )
    })
  })

  describe('getFirewallStatus', () => {
    it('should return firewall enabled status from router status', async () => {
      const mockRouterStatus = {
        wifiSettings: {
          enabled: true,
          ssid: 'TestWiFi',
          securityType: 'WPA2',
          channel: 6,
          frequency: '2.4GHz'
        },
        networkSettings: {
          ipAddress: '192.168.1.1',
          subnetMask: '255.255.255.0',
          gateway: '192.168.1.1',
          primaryDNS: '8.8.8.8',
          secondaryDNS: '8.8.4.4'
        },
        securitySettings: {
          firewallEnabled: true,
          vpnEnabled: false,
          parentalControlsEnabled: false
        },
        connectedDevices: []
      }

      jest
        .spyOn(RouterService, 'getRouterStatus')
        .mockResolvedValueOnce(mockRouterStatus)

      const result = await RouterService.getFirewallStatus()

      expect(result).toBe(true)
    })

    it('should throw error when getRouterStatus fails', async () => {
      const error = new Error('Failed to get router status')
      jest.spyOn(RouterService, 'getRouterStatus').mockRejectedValueOnce(error)

      await expect(RouterService.getFirewallStatus()).rejects.toThrow(
        'Failed to get firewall status: Failed to get router status'
      )
    })

    it('should handle unknown errors', async () => {
      jest
        .spyOn(RouterService, 'getRouterStatus')
        .mockRejectedValueOnce('Unknown error')

      await expect(RouterService.getFirewallStatus()).rejects.toThrow(
        'Failed to get firewall status: Unknown error'
      )
    })
  })

  describe('enableFirewall', () => {
    it('should return success message when Firewall is already enabled', async () => {
      jest.spyOn(RouterService, 'getFirewallStatus').mockResolvedValueOnce(true)

      const result = await RouterService.enableFirewall()

      expect(mockedAxios.post).not.toHaveBeenCalled()
      expect(result).toEqual({
        success: true,
        message: 'Firewall is already enabled'
      })
    })

    it('should enable firewall when API call is successful', async () => {
      jest
        .spyOn(RouterService, 'getFirewallStatus')
        .mockResolvedValueOnce(false)
      mockedAxios.post.mockResolvedValueOnce({ data: { success: true } })

      const result = await RouterService.enableFirewall()

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `http://${config.router.ipAddress}${config.router.firewallEndpoint}`,
        {},
        { headers: { Authorization: `Bearer mock-token` } }
      )
      expect(result).toEqual({
        success: true,
        message: 'Firewall has been enabled'
      })
    })

    it('should throw error when API call fails with standard error', async () => {
      jest
        .spyOn(RouterService, 'getFirewallStatus')
        .mockResolvedValueOnce(false)
      const error = new Error('Failed to enable firewall')
      mockedAxios.post.mockRejectedValueOnce(error)

      await expect(RouterService.enableFirewall()).rejects.toThrow(
        'Failed to enable firewall: Failed to enable firewall'
      )
    })

    it('should throw error when API call fails with unknown error', async () => {
      jest
        .spyOn(RouterService, 'getFirewallStatus')
        .mockResolvedValueOnce(false)
      mockedAxios.post.mockRejectedValueOnce('Unknown error')

      await expect(RouterService.enableFirewall()).rejects.toThrow(
        'Failed to enable firewall: Unknown error'
      )
    })
  })

  describe('disableFirewall', () => {
    it('should return success message when Firewall is already disabled', async () => {
      jest
        .spyOn(RouterService, 'getFirewallStatus')
        .mockResolvedValueOnce(false)

      const result = await RouterService.disableFirewall()

      expect(mockedAxios.post).not.toHaveBeenCalled()
      expect(result).toEqual({
        success: true,
        message: 'Firewall is already disabled'
      })
    })

    it('should disable firewall when API call is successful', async () => {
      jest.spyOn(RouterService, 'getFirewallStatus').mockResolvedValueOnce(true)
      mockedAxios.post.mockResolvedValueOnce({ data: { success: true } })

      const result = await RouterService.disableFirewall()

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `http://${config.router.ipAddress}${config.router.firewallEndpoint}`,
        {},
        { headers: { Authorization: `Bearer mock-token` } }
      )
      expect(result).toEqual({
        success: true,
        message: 'Firewall has been disabled'
      })
    })

    it('should throw error when API call fails with standard error', async () => {
      jest.spyOn(RouterService, 'getFirewallStatus').mockResolvedValueOnce(true)
      const error = new Error('Failed to disable firewall')
      mockedAxios.post.mockRejectedValueOnce(error)

      await expect(RouterService.disableFirewall()).rejects.toThrow(
        'Failed to disable firewall: Failed to disable firewall'
      )
    })

    it('should throw error when API call fails with unknown error', async () => {
      jest.spyOn(RouterService, 'getFirewallStatus').mockResolvedValueOnce(true)
      mockedAxios.post.mockRejectedValueOnce('Unknown error')

      await expect(RouterService.disableFirewall()).rejects.toThrow(
        'Failed to disable firewall: Unknown error'
      )
    })
  })

  describe('changePassword', () => {
    it('should change password when API call is successful', async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: { success: true } })
      const newPassword = 'new-secure-password'

      const result = await RouterService.changePassword(newPassword)

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `http://${config.router.ipAddress}${config.router.passwordEndpoint}`,
        { newPassword },
        { headers: { Authorization: `Bearer mock-token` } }
      )
      expect(RouterAuth.resetAuthToken).toHaveBeenCalled()
      expect(result).toEqual({
        success: true,
        message: 'Router password has been changed'
      })
    })

    it('should throw error when API call fails with Axios error containing response data message', async () => {
      const axiosError = new Error('Network error') as any
      axiosError.isAxiosError = true
      axiosError.response = {
        data: { message: 'Password format invalid' }
      }

      mockedAxios.post.mockRejectedValueOnce(axiosError)
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(true)

      const newPassword = 'new-secure-password'

      await expect(RouterService.changePassword(newPassword)).rejects.toThrow(
        'Failed to change password: Password format invalid'
      )
    })

    it('should throw error when API call fails with regular Axios error', async () => {
      const axiosError = new Error('Network error') as any
      axiosError.isAxiosError = true

      mockedAxios.post.mockRejectedValueOnce(axiosError)
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(true)

      const newPassword = 'new-secure-password'

      await expect(RouterService.changePassword(newPassword)).rejects.toThrow(
        'Failed to change password: Network error'
      )
    })

    it('should throw error when API call fails with standard error', async () => {
      const error = new Error('Failed to change password')
      mockedAxios.post.mockRejectedValueOnce(error)
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(false)

      const newPassword = 'new-secure-password'

      await expect(RouterService.changePassword(newPassword)).rejects.toThrow(
        'Failed to change password: Failed to change password'
      )
    })

    it('should throw error when API call fails with unknown error', async () => {
      mockedAxios.post.mockRejectedValueOnce('Unknown error')
      jest.spyOn(axios, 'isAxiosError').mockReturnValue(false)

      const newPassword = 'new-secure-password'

      await expect(RouterService.changePassword(newPassword)).rejects.toThrow(
        'Failed to change password: Unknown error'
      )
    })
  })
})
