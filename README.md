# Payatu Assignment

A Node.js API written in TypeScript that interacts with your home router to fetch information and manage settings.

## Features

- **Router Status Retrieval**: Fetch information about your router including model, firmware version, MAC address, serial number, and uptime.
- **WiFi Management**: Enable or disable WiFi on your router.
- **Firewall Management**: Enable or disable the firewall on your router.
- **Password Management**: Change your router's password.

## Technology Stack

- Node.js
- TypeScript
- Express.js
- Axios for HTTP requests
- Jest for testing

## Project Structure

```
src/
├── config/             # Configuration files
├── /api/controllers/   # Route handlers
├── /api/routes/        # API routes
├── /api/services/      # Business logic
├── interfaces/         # TypeScript interfaces
├── middleware/         # Express middleware
├── utils/              # Utility functions
├── __tests__/          # Test files
├── index.ts            # Application entry point
└── server.ts           # Express server setup
```

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:

   ```
   PORT=3000
   ROUTER_USERNAME=your_router_username
   ROUTER_PASSWORD=your_router_password
   ROUTER_IP_ADDRESS=your_router_ip
   LOGIN_ENDPOINT=your_router_login_endpoint
   STATUS_ENDPOINT=your_router_status_endpoint
   WIFI_ENDPOINT=your_router_wifi_endpoint
   FIREWALL_ENDPOINT=your_router_firewall_endpoint
   PASSWORD_ENDPOINT=your_router_password_endpoint
   ```

3. Build the TypeScript code:

   ```bash
   npm run build
   ```

4. Start the application:
   ```bash
   npm start
   ```

## API Endpoints

### Router Status

- **GET** `/api/router/status`: Retrieves the router's status information.

  **Response Example:**

  ```json
  {
    "wifiSettings": {
      "enabled": true,
      "ssid": "Home_Network",
      "securityType": "WPA2",
      "channel": 6,
      "frequency": "2.4GHz"
    },
    "networkSettings": {
      "ipAddress": "192.168.1.1",
      "subnetMask": "255.255.255.0",
      "gateway": "192.168.1.1",
      "primaryDNS": "8.8.8.8",
      "secondaryDNS": "8.8.4.4"
    },
    "securitySettings": {
      "firewallEnabled": false,
      "vpnEnabled": false,
      "parentalControlsEnabled": false
    },
    "connectedDevices": [
      {
        "id": 1,
        "name": "Living Room TV",
        "macAddress": "AA:BB:CC:DD:EE:FF",
        "ipAddress": "192.168.1.100",
        "connectionType": "Wireless"
      },
      {
        "id": 2,
        "name": "John's Laptop",
        "macAddress": "11:22:33:44:55:66",
        "ipAddress": "192.168.1.101",
        "connectionType": "Wireless"
      },
      {
        "id": 3,
        "name": "Network Printer",
        "macAddress": "AA:11:BB:22:CC:33",
        "ipAddress": "192.168.1.102",
        "connectionType": "Wired"
      }
    ]
  }
  ```

### WiFi Settings

- **POST** `/api/router/settings/wifi/enable`: Enables WiFi on the router.

  **Response Example:**

  ```json
  {
    "success": true,
    "message": "WiFi has been enabled."
  }
  ```

- **POST** `/api/router/settings/wifi/disable`: Disables WiFi on the router.

  **Response Example:**

  ```json
  {
    "success": true,
    "message": "WiFi has been disabled."
  }
  ```

### Firewall Settings

- **POST** `/api/router/settings/firewall/enable`: Enables the firewall on the router.

  **Response Example:**

  ```json
  {
    "success": true,
    "message": "Firewall has been enabled."
  }
  ```

- **POST** `/api/router/settings/firewall/disable`: Disables the firewall on the router.

  **Response Example:**

  ```json
  {
    "success": true,
    "message": "Firewall has been disabled."
  }
  ```

### Password Management

- **POST** `/api/router/settings/password/change`: Changes the router password.

  **Request Body:**

  ```json
  {
    "newPassword": "YourNewPassword123"
  }
  ```

  **Response Example:**

  ```json
  {
    "success": true,
    "message": "Router password has been changed."
  }
  ```

## Running Tests

Execute the test suite with:

```bash
npm test
```
