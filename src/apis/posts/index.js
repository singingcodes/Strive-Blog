import express from "express"
import uniqid from "uniqid"
import multer from "multer"
import createError from "http-errors"
import { checkPostSchema, checkPostValidationResult } from "./postValidation.js"
import { getPosts, writePosts, savePostsCovers } from "../../lib/fsTools.js"

const postsRouter = express.Router()

// const postJsonPath = join(dirname(fileURLToPath(import.meta.url)), "posts.json")
// const getPosts = () => JSON.parse(fs.readFileSync(postJsonPath))
// const writePosts = (posts) =>
//   fs.writeFileSync(postJsonPath, JSON.stringify(posts))

// GET /blogPosts
postsRouter.get("/", async (req, res, next) => {
  try {
    const posts = await getPosts()
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
      const newPost = { ...req.body, id: uniqid(), createdAt: new Date() }
      const posts = await getPosts()
      posts.push(newPost)
      await writePosts(posts)
      res.status(201).send(newPost)
    } catch (error) {
      next(error)
    }
  }
)

// GET /blogPosts/:id
postsRouter.get("/:postId", async (req, res, next) => {
  try {
    const posts = await getPosts()
    const post = posts.find((post) => post.id === req.params.postId)
    if (post) {
      res.send(post)
    } else {
      next(createError(404, "Post with ${req.params.postId} not found"))
    }
  } catch (error) {
    next(error)
  }
})

// PUT /blogPosts/:id
postsRouter.put("/:postId", async (req, res, next) => {
  try {
    const posts = await getPosts()
    const post = posts.findIndex((post) => post.id === req.params.postId)
    if (post === -1) {
      const oldPost = posts[post]
      const newPost = { ...oldPost, ...req.body, updatedAt: new Date() }
      posts[post] = newPost
      await writePosts(posts)
      res.send(newPost)
    } else {
      next(createError(404, "Post not found"))
    }
  } catch (error) {
    next(error)
  }
})

// DELETE /blogPosts/:id
postsRouter.delete("/:postId", async (req, res, next) => {
  try {
    const posts = await getPosts()
    const postsLeft = posts.filter((post) => post.id !== req.params.postId)
    await writePosts(postsLeft)
    res.status(204).send()
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
      const posts = await getPosts()
      const post = posts.findIndex((post) => post.id === req.params.postId)
      const url = await savePostsCovers(req.file.fieldname, req.file.buffer)
      if (post !== -1) {
        const oldPost = posts[post]
        const newPost = { ...oldPost, cover: url, updatedAt: new Date() }
        posts[post] = newPost
        await writePosts(posts)
        res.send(newPost)
      } else {
        next(createError(404, "Post not found"))
      }
    } catch (error) {
      next(error)
    }
  }
)
//GET /blogPosts/:id/comments, get all the comments for a specific post
postsRouter.get("/:postId/comments", async (req, res, next) => {
  try {
    const posts = await getPosts()
    const post = posts.findIndex((post) => post.id === req.params.postId)
    if (post !== -1) {
      res.send(posts[post].comments)
    } else {
      next(createError(404, "Post not found"))
    }
  } catch (error) {
    next(error)
  }
})
//POST /blogPosts/:id/comments, create a new comment for a specific post
postsRouter.post("/:postId/comments", async (req, res, next) => {
  try {
    const posts = await getPosts()
    const post = posts.findIndex((post) => post.id === req.params.postId)
    if (post !== -1) {
      const newComment = { ...req.body, id: uniqid(), createdAt: new Date() }
      posts[post].comments.push(newComment)
      await writePosts(posts)
      res.send(newComment)
    } else {
      next(createError(404, "Post not found"))
    }
  } catch (error) {
    next(error)
  }
})

export default postsRouter
