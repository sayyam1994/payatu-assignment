import axios, { AxiosError } from 'axios'
import { RouterCredentials } from '../interfaces/router.interface'
import { config } from '../config/config'

export class RouterAuth {
  private static authToken: string | null = null

  /**
   * Authenticate with the router and get an auth token
   */
  public static async authenticate(): Promise<string> {
    try {
      const routerCredentials: RouterCredentials = {
        username: config.router.username,
        password: config.router.password,
        ipAddress: config.router.ipAddress
      }

      const response = await axios.post(
        `http://${routerCredentials.ipAddress}${config.router.loginEndpoint}`,
        {
          username: routerCredentials.username,
          password: routerCredentials.password
        }
      )

      if (response.data && response.data.token) {
        this.authToken = response.data.token
        return this.authToken!
      }

      throw new Error('Failed to authenticate with router')
    } catch (error) {
      console.error('Router authentication error:', error)

      if (error instanceof Error) {
        throw new Error(`Authentication failed: ${error.message}`)
      } else {
        throw new Error('Authentication failed: Unknown error')
      }
    }
  }

  /**
   * Get the current auth token or acquire a new one
   */
  public static async getAuthToken(): Promise<string> {
    if (!this.authToken) {
      return await this.authenticate()
    }
    return this.authToken
  }

  /**
   * Reset the auth token
   */
  public static resetAuthToken(): void {
    this.authToken = null
  }
}
