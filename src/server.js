import express from "express"
import authorsRouter from "./apis/authors/index.js"
import postsRouter from "./apis/posts/index.js"
import filesRouter from "./apis/files/index.js"
import { join } from "path"
import listEndpoints from "express-list-endpoints"
import createError from "http-errors"
import cors from "cors"
import {
  badRequestError,
  notFoundError,
  unauthorizedError,
  genericServerError,
} from "./handleErrors.js"
import swaggerUIExpress from "swagger-ui-express"
import yaml from "yamljs"

const server = express()
const port = process.env.PORT || 3001

const publicFolderPath = join(process.cwd(), "./public")
const yamlDocument = yaml.load(
  join(process.cwd(), "./src/docs/apiDefinitions.yml")
)

// CORS Configuration
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]
const corsOptions = {
  origin: (origin, next) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      next(null, true)
    } else {
      next(
        createError(
          400,
          `Cors Error! your origin ${origin} is not in the list!`
        )
      )
    }
  },
}
// middleWares
server.use(express.json())
server.use(cors(corsOptions))
server.use(express.static(publicFolderPath))

// endpoints
server.use("/authors", authorsRouter)
server.use("/blogPosts", postsRouter)
server.use("/files", filesRouter)
server.use(
  "/docs",
  swaggerUIExpress.serve,
  swaggerUIExpress.setup(yamlDocument)
)
// error handlers
server.use(badRequestError)
server.use(notFoundError)
server.use(unauthorizedError)
server.use(genericServerError)
// Server is running on port 3001
server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log(`Server is running on port ${port}!!`)
})
