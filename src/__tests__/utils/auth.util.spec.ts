import axios from 'axios'
import { RouterAuth } from '../../utils/auth.util'
import { config } from '../../config/config'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('RouterAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    RouterAuth.resetAuthToken()
  })

  describe('authenticate', () => {
    it('should authenticate successfully and return token', async () => {
      const mockToken = 'mock-auth-token-12345'
      mockedAxios.post.mockResolvedValueOnce({
        data: { token: mockToken }
      })

      const token = await RouterAuth.authenticate()

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `http://${config.router.ipAddress}${config.router.loginEndpoint}`,
        {
          username: config.router.username,
          password: config.router.password
        }
      )
      expect(token).toBe(mockToken)
    })

    it('should throw error when no token is returned', async () => {
      mockedAxios.post.mockResolvedValueOnce({
        data: { success: true }
      })

      await expect(RouterAuth.authenticate()).rejects.toThrow(
        'Failed to authenticate with router'
      )
    })

    it('should throw error when authentication fails with standard error', async () => {
      const error = new Error('Connection refused')
      mockedAxios.post.mockRejectedValueOnce(error)

      await expect(RouterAuth.authenticate()).rejects.toThrow(
        'Authentication failed: Connection refused'
      )
    })

    it('should throw error when authentication fails with unknown error', async () => {
      mockedAxios.post.mockRejectedValueOnce('Unknown error')

      await expect(RouterAuth.authenticate()).rejects.toThrow(
        'Authentication failed: Unknown error'
      )
    })
  })

  describe('getAuthToken', () => {
    it('should get existing token without authenticating again', async () => {
      const mockToken = 'mock-auth-token-12345'
      mockedAxios.post.mockResolvedValueOnce({
        data: { token: mockToken }
      })

      const firstToken = await RouterAuth.getAuthToken()
      expect(mockedAxios.post).toHaveBeenCalledTimes(1)
      expect(firstToken).toBe(mockToken)

      mockedAxios.post.mockClear()

      const secondToken = await RouterAuth.getAuthToken()
      expect(mockedAxios.post).not.toHaveBeenCalled()
      expect(secondToken).toBe(mockToken)
    })

    it('should authenticate when no token exists', async () => {
      RouterAuth.resetAuthToken()

      const mockToken = 'new-auth-token'
      mockedAxios.post.mockResolvedValueOnce({
        data: { token: mockToken }
      })

      const token = await RouterAuth.getAuthToken()

      expect(mockedAxios.post).toHaveBeenCalledTimes(1)
      expect(token).toBe(mockToken)
    })
  })

  describe('resetAuthToken', () => {
    it('should reset the auth token', async () => {
      const mockToken = 'token-to-be-reset'
      mockedAxios.post.mockResolvedValueOnce({
        data: { token: mockToken }
      })

      await RouterAuth.getAuthToken()

      mockedAxios.post.mockClear()
      RouterAuth.resetAuthToken()

      const newToken = 'new-token-after-reset'
      mockedAxios.post.mockResolvedValueOnce({
        data: { token: newToken }
      })

      const tokenAfterReset = await RouterAuth.getAuthToken()

      expect(mockedAxios.post).toHaveBeenCalledTimes(1)
      expect(tokenAfterReset).toBe(newToken)
    })
  })
})
