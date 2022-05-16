import createError from "http-errors"
import uniqid from "uniqid"
import { getPosts, writePosts } from "../fsTools.js"
export const saveNewComment = async (postId, newCommentData) => {
  const posts = getPosts()
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
