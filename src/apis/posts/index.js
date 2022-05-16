import express from "express"
import uniqid from "uniqid"
import multer from "multer"
import createError from "http-errors"
import {
  checkPostSchema,
  checkPostUpdateSchema,
  checkPostValidationResult,
} from "./postValidation.js"
import {
  getPosts,
  writePosts,
  savePostsCovers,
  deletePostsImages,
} from "../../lib/fsTools.js"
import {
  findPost,
  findPostById,
  findPostByIdAndDelete,
  findPostByIdAndUpdate,
  saveNewPost,
} from "../../lib/db/posts.js"
import { saveNewComment } from "../../lib/db/comments.js"
import { checkCommentSchema } from "./commentsValidation.js"

const postsRouter = express.Router()

// GET /blogPosts
postsRouter.get("/", async (req, res, next) => {
  try {
    const posts = await findPost()
    if (req.query && req.query.title) {
      const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(req.query.title.toLowerCase())
      )
      res.send(filteredPosts)
    } else {
      res.send(posts)
    }
  } catch (error) {
    next(error)
  }
})

// POST /blogPosts
postsRouter.post(
  "/",
  checkPostSchema,
  checkPostValidationResult,
  async (req, res, next) => {
    try {
      const id = await saveNewPost(req.body)
      res.status(201).send({ id })
    } catch (error) {
      next(error)
    }
  }
)

// GET /blogPosts/:id
postsRouter.get("/:postId", async (req, res, next) => {
  try {
    const post = await findPostById(req.params.postId)
    res.send(post)
  } catch (error) {
    next(error)
  }
})

// PUT /blogPosts/:id
postsRouter.put(
  "/:postId",
  checkPostUpdateSchema,
  checkPostValidationResult,
  async (req, res, next) => {
    try {
      const updatedPost = await findPostByIdAndUpdate(
        req.params.postId,
        req.body
      )
      res.send(updatedPost)
    } catch (error) {
      next(error)
    }
  }
)

// DELETE /blogPosts/:id
postsRouter.delete("/:postId", async (req, res, next) => {
  try {
    const post = await findPostById(req.params.postId)
    await deletePostsImages(post.cover)
    await findPostByIdAndDelete(req.params.postId)
  } catch (error) {
    next(error)
  }
})
//POST /blogPosts/:id/uploadCover, uploads a picture (save as idOfTheBlogPost.jpg in the public/img/blogPosts folder) for the blog post specified by the id. Store the newly created URL into the corresponding post in blogPosts.json

postsRouter.post(
  "/:postId/cover",
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
      const fileName = req.params.postId + extname(req.file.originalname)
      await savePostsCovers(fileName, req.file.buffer)
      const updatedPost = await findPostByIdAndUpdate(req.params.postId, {
        cover: "/img/posts" + fileName,
      })
      res.send(updatedPost)
    } catch (error) {
      next(error)
    }
  }
)
//GET /blogPosts/:id/comments, get all the comments for a specific post
postsRouter.get("/:postId/comments", async (req, res, next) => {
  try {
    const { comments } = await findPostById(req.params.postId)
    res.send(comments)
  } catch (error) {
    next(error)
  }
})
//POST /blogPosts/:id/comments, create a new comment for a specific post
postsRouter.post(
  "/:postId/comments",
  checkCommentSchema,
  checkPostValidationResult,
  async (req, res, next) => {
    try {
      const updatedPost = await saveNewComment(req.params.postId, req.body)
      res.send(updatedPost)
    } catch (error) {
      next(error)
    }
  }
)

export default postsRouter
