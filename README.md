# Payatu Assignment

A Node.js API written in TypeScript that interacts with your home router to fetch information and manage settings.

## Important Note

My router did not have API endpoints to configure it, so I was unable to test the APIs with a real router. For testing purposes, you need to add your own router's API endpoints in the `.env` file to test this application with a real router.

Please be aware that since I couldn't test with actual hardware, some of the API endpoints implemented in this application are based on guesses and may differ from your router's actual APIs. You might need to modify the code to match your specific router's API specifications.

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
    "model": "RouterModel123",
    "firmwareVersion": "1.0.0",
    "macAddress": "AA:BB:CC:DD:EE:FF",
    "serialNumber": "SN123456789",
    "uptime": "48 hours"
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
