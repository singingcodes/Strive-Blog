import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
const { readJSON, writeJSON, writeFile } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const postsJSONPath = join(dataFolderPath, "posts.json")
const authorsJSONPath = join(dataFolderPath, "authors.json")

const authorsPublicFolderPath = join(process.cwd(), "./public/img/authors")

const postsPublicFolderPath = join(process.cwd(), "./public/img/posts")

export const getPosts = () => readJSON(postsJSONPath)
export const writePosts = (postsArray) => writeJSON(postsJSONPath, postsArray)

export const getAuthors = () => readJSON(authorsJSONPath)
export const writeAuthors = (authorsArray) =>
  writeJSON(authorsJSONPath, authorsArray)

export const saveAuthorsAvatars = (fileName, contentAsBuffer) =>
  writeFile(join(authorsPublicFolderPath, fileName), contentAsBuffer)
export const savePostsCovers = (fileName, contentAsBuffer) =>
  writeFile(join(postsPublicFolderPath, fileName), contentAsBuffer)
