import { Router } from 'express'
import { RouterController } from '../controllers/router.controller'

const router = Router()

// Status endpoint
router.get('/router/status', RouterController.getStatus)

// WiFi settings endpoints
router.post('/router/settings/wifi/enable', RouterController.enableWifi)
router.post('/router/settings/wifi/disable', RouterController.disableWifi)

// Firewall settings endpoints
router.post('/router/settings/firewall/enable', RouterController.enableFirewall)
router.post(
  '/router/settings/firewall/disable',
  RouterController.disableFirewall
)

// Password change endpoint
router.post('/router/settings/password/change', RouterController.changePassword)

export default router
