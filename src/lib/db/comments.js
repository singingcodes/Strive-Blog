import createError from "http-errors"
import uniqid from "uniqid"
import { getPosts, writePosts } from "../fsTools.js"
import { findPostById } from "./posts.js"
export const saveNewComment = async (postId, newCommentData) => {
  const posts = await getPosts()
  const postIndex = posts.findIndex((post) => post.id === postId)
  if (postIndex !== -1) {
    posts[postIndex].comments.push({
      ...newCommentData,
      id: uniqid(),
      createdAt: new Date(),
    })
    await writePosts(posts)
    return posts[postIndex]
  } else {
    throw createError(404, `post with id ${postId} not found`)
  }
}

export const findCommentById = async (postId, commentId) => {
  const { comments } = await findPostById(postId)

  const foundComment = comments.find((Comment) => Comment.id === commentId)

  if (foundComment) return foundComment
  else throw createError(404, `Comment with id ${commentId} not found!`)
}

export const findCommentByIdAndUpdate = async (postId, commentId, updates) => {
  const posts = await getPosts()

  const postIndex = posts.findIndex((post) => post.id === postId)
  if (postIndex !== -1) {
    const commentIndex = posts[postIndex].comments.findIndex(
      (Comment) => Comment.id === commentId
    )

    if (commentIndex !== -1) {
      posts[postIndex].comments[commentIndex] = {
        ...posts[postIndex].comments[commentIndex],
        ...updates,
        updatedAt: new Date(),
      }

      await writePosts(posts)

      return posts[postIndex].comments[commentIndex]
    } else {
      throw createError(404, `Comment with id ${commentId} not found!`)
    }
  } else {
    throw createError(404, `post with id ${postId} not found!`)
  }
}

export const findCommentByIdAndDelete = async (postId, commentId) => {
  const posts = await getPosts()

  const postIndex = posts.findIndex((post) => post.id === postId)
  if (postIndex !== -1) {
    const lengthBefore = posts[postIndex].comments.length

    posts[postIndex].comments = posts[postIndex].comments.filter(
      (comment) => comment.id !== commentId
    )

    if (lengthBefore === posts[postIndex].comments.length)
      throw createError(404, `Comment with id ${commentId} not found!`)
    await writePosts(posts)

    return posts[postIndex].reviews
  } else {
    throw createError(404, `Post with id ${postId} not found!`)
  }
}
