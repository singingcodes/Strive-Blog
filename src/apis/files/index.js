import express from "express"
import multer from "multer"

import { saveAuthorsAvatars, savePostsCovers } from "../../lib/fsTools.js"

const filesRouter = express.Router()

// filesRouter.post(
//   "/authors/:authorId/avatar",
//   multer({
//     fileFilter: (req, file, multerNext) => {
//       if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
//         multerNext(createError(400, "Only png/jpeg allowed!"))
//       } else {
//         multerNext(null, true)
//       }
//     },
//     limits: { fileSize: 1024 * 1024 * 5 },
//   }).single("avatar"),
//   async (req, res, next) => {
//     try {
//       //   const postId = req.params.postId

//       await saveAuthorsAvatars(req.file.originalname, req.file.buffer)
//       res.send({ success: true })
//     } catch (error) {
//       next(error)
//     }
//   }
// )

filesRouter.post(
  "/posts/:postId/cover",
  multer({
    fileFilter: (req, file, multerNext) => {
      if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
        multerNext(createError(400, "Only png/jpeg allowed!"))
      } else {
        multerNext(null, true)
      }
    },
    limits: { fileSize: 1024 * 1024 * 5 },
  }).single("cover"),
  async (req, res, next) => {
    try {
      //   const postId = req.params.postId

      await savePostsCovers(req.file.originalname, req.file.buffer)
      res.send({ success: true })
    } catch (error) {
      next(error)
    }
  }
)

export default filesRouter
