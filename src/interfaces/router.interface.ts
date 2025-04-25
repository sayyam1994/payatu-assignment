export interface RouterStatus {
  model: string
  firmwareVersion: string
  macAddress: string
  serialNumber: string
  uptime: string
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
