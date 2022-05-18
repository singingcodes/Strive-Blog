import express from "express"
import { getPDFReadableStream } from "../../lib/pdf.js"
import { getPosts } from "../../lib/fsTools.js"
import { pipeline } from "stream"
import { findPostById } from "../../lib/db/posts.js"

const filesRouter = express.Router()
filesRouter.get("/:postId/pdf", async (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=example.pdf")
    const post = await findPostById(req.params.postId)
    const source = getPDFReadableStream(post)

    const destination = res

    pipeline(source, destination, (err) => {
      if (err) console.log(err)
    })
  } catch (error) {
    next(error)
  }
})
export default filesRouter
