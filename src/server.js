import express from "express"
import authorsRouter from "./apis/authors/index.js"
import postsRouter from "./apis/posts/index.js"
import { join } from "path"
import listEndpoints from "express-list-endpoints"
import createError from "http-errors"
import cors from "cors"
import {
  handleBadRequestError,
  handleNotFoundError,
  handleUnauthorizedError,
  handleServerError,
} from "./handleErrors.js"

const server = express()
const port = process.env.PORT || 3001

const publicFolderPath = join(process.cwd(), "./public")
console.log(publicFolderPath)

// CORS Configuration
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]
const corsOptions = {
  origin: (origin, next) => {
    console.log("CURRENT ORIGIN IS: ", origin)
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
// server.use("/files", filesRouter)
// error handlers
server.use(handleBadRequestError)
server.use(handleNotFoundError)
server.use(handleUnauthorizedError)
server.use(handleServerError)
// Server is running on port 3001
server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log(`Server is running on port ${port}!!`)
})
