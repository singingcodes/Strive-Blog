import express from "express"
import authorsRouter from "./apis/authors/index.js"
import listEndpoints from "express-list-endpoints"
import cors from "cors"

const server = express()
const port = 3001
server.use(express.json())
server.use(cors())

server.use("/authors", authorsRouter)
server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log(`Server is running on port ${port}!!`)
})
