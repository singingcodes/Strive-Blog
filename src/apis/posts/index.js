import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"
import createError from "http-errors"
import { checkPostSchema, checkPostValidationResult } from "./postValidation.js"

const postsRouter = express.Router()

const postJsonPath = join(dirname(fileURLToPath(import.meta.url)), "posts.json")
const getPosts = () => JSON.parse(fs.readFileSync(postJsonPath))
const writePosts = (posts) =>
  fs.writeFileSync(postJsonPath, JSON.stringify(posts))

// GET /blogPosts
postsRouter.get("/", (req, res, next) => {
  try {
    const posts = getPosts()
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
  (req, res, next) => {
    try {
      console.log(req.body)
      const newPost = { ...req.body, id: uniqid(), createdAt: new Date() }
      const posts = getPosts()
      posts.push(newPost)
      writePosts(posts)
      res.status(201).send(newPost)
    } catch (error) {
      next(error)
    }
  }
)

// GET /blogPosts/:id
postsRouter.get("/:postId", (req, res, next) => {
  try {
    const posts = getPosts()
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
postsRouter.put("/:postId", (req, res, next) => {
  try {
    const posts = getPosts()
    const post = posts.findIndex((post) => post.id === req.params.postId)
    if (post === -1) {
      const oldPost = posts[post]
      const newPost = { ...oldPost, ...req.body, updatedAt: new Date() }
      posts[post] = newPost
      writePosts(posts)
      res.send(newPost)
    } else {
      next(createError(404, "Post not found"))
    }
  } catch (error) {
    next(error)
  }
})

// DELETE /blogPosts/:id
postsRouter.delete("/:postId", (req, res, next) => {
  try {
    const posts = getPosts()
    const postsLeft = posts.filter((post) => post.id !== req.params.postId)
    writePosts(postsLeft)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})
export default postsRouter
