import createError from "http-errors"
import { getPosts, writePosts } from "../fsTools.js"
import uniqid from "uniqid"

export const saveNewPost = async (newPostsData) => {
  const newPost = {
    ...newPostsData,
    createdAt: new Date(),
    id: uniqid(),
    comments: [],
  }
  const posts = await getPosts()
  posts.push(newPost)
  await writePosts(posts)
  return newPost.id
}

export const findPost = () => getPosts()

export const findPostById = async (postId) => {
  const posts = await getPosts()
  const foundPost = posts.find((post) => post.id === postId)
  if (foundPost) return foundPost
  else throw createError(404, `post with id ${postId} not found`)
}

export const findPostByIdAndUpdate = async (postId, updates) => {
  const posts = await getPosts()
  const index = posts.findIndex((post) => post.id === postId)
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updates, updatedAt: new Date() }
    await writePosts(posts)
    return posts[index]
  } else {
    throw createError(404, `post with id ${postId} not found`)
  }
}

export const findPostByIdAndDelete = async (postId) => {
  const posts = await getPosts()
  const remainingPosts = posts.filter((post) => post.id !== postId)
  if (posts.length === remainingPosts.length)
    throw createError(404, `post with id ${postId} not found`)
  await writePosts(remainingPosts)
}
