import express from "express"
import { getPDFReadableStream } from "../../lib/pdf.js"
import { getBooksReadableStream } from "../../lib/fsTools.js"
import json2csv from "json2csv"

import { pipeline } from "stream"
import { findPostById } from "../../lib/db/posts.js"

const filesRouter = express.Router()
filesRouter.get("/:postId/pdf", async (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=blogPost.pdf")
    const post = await findPostById(req.params.postId)
    const source = await getPDFReadableStream(post)

    const destination = res

    pipeline(source, destination, (err) => {
      if (err) console.log(err)
    })
  } catch (error) {
    next(error)
  }
})
filesRouter.get("/authorCSV", (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=author.csv")

    const source = getBooksReadableStream()
    const destination = res
    const transform = new json2csv.Transform({
      fields: ["name", "email"],
    })

    pipeline(source, transform, destination, (err) => {
      if (err) console.log(err)
    })
  } catch (error) {
    next(error)
  }
})
export default filesRouter
