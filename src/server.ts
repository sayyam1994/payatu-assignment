import express, { Application } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import routerRoutes from './api/routes/router.routes'
import { errorHandler } from './middleware/error.middleware'
import { config } from './config/config'

export class Server {
  private app: Application

  constructor() {
    this.app = express()
    this.configureMiddleware()
    this.configureRoutes()
    this.configureErrorHandling()
  }

  private configureMiddleware(): void {
    this.app.use(helmet())
    this.app.use(cors())
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))
  }

  private configureRoutes(): void {
    this.app.use('/api', routerRoutes)
  }

  private configureErrorHandling(): void {
    this.app.use(errorHandler)
  }

  public start(): void {
    const port = config.port

    this.app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  }
}
