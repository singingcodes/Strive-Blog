import express from "express"
import authorsRouter from "./apis/authors/index.js"
import postsRouter from "./apis/posts/index.js"
import { join } from "path"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import {
  handleBadRequestError,
  handleNotFoundError,
  handleUnauthorizedError,
  handleServerError,
} from "./handleErrors.js"

const server = express()
const port = 3001

const publicFolderPath = join(process.cwd(), "./public")

// middleWares
server.use(express.json())
server.use(cors())

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
