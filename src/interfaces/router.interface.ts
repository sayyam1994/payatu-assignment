export interface RouterStatus {
  wifiSettings: {
    enabled: boolean
    ssid: string
    // password: string // Intentionally omitted for security
    securityType: string
    channel: number
    frequency: string
  }
  networkSettings: {
    ipAddress: string
    subnetMask: string
    gateway: string
    primaryDNS: string
    secondaryDNS: string
  }
  securitySettings: {
    firewallEnabled: boolean
    vpnEnabled: boolean
    parentalControlsEnabled: boolean
  }
  connectedDevices: {
    id: number
    name: string
    macAddress: string
    ipAddress: string
    connectionType: string
  }[]
}

export interface ConnectedDevice {
  id: number
  name: string
  macAddress: string
  ipAddress: string
  connectionType: string
}

export interface RouterResponse {
  success: boolean
  message: string
  data?: any
}

export interface RouterCredentials {
  username: string
  password: string
  ipAddress: string
}
