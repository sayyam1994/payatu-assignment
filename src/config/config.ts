import dotenv from 'dotenv'

dotenv.config()

export const config = {
  port: process.env.PORT || 3000,
  router: {
    username: process.env.ROUTER_USERNAME || 'admin',
    password: process.env.ROUTER_PASSWORD || 'admin',
    ipAddress: process.env.ROUTER_IP_ADDRESS || 'wifi-admin.netlify.app',
    loginEndpoint: process.env.LOGIN_ENDPOINT || '/api/login',
    statusEndpoint: process.env.STATUS_ENDPOINT || '/api/router-config',
    wifiEndpoint: process.env.WIFI_ENDPOINT || '/api/toggle-wifi',
    firewallEndpoint: process.env.FIREWALL_ENDPOINT || '/api/toggle-firewall',
    passwordEndpoint: process.env.PASSWORD_ENDPOINT || '/api/update-password'
  }
}
