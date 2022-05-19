import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
const { readJSON, writeJSON, writeFile, unlink, createReadStream } = fs

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

export const saveAuthorsAvatars = (fileName, contentAsBuffer) => {
  const filePath = join(authorsPublicFolderPath, fileName)
  const savedPath = `/img/authors/${fileName}`
  console.log(savedPath)
  writeFile(filePath, contentAsBuffer)
  const url = `http://localhost:3000${savedPath}`
  return url
}
export const getBooksReadableStream = () => createReadStream(authorsJSONPath)

// export const savePostsCovers = (fileName, contentAsBuffer) => {
//   const filePath = join(postsPublicFolderPath, fileName)
//   const savedPath = `/img/posts/${fileName}`
//   console.log(savedPath)
//   writeFile(filePath, contentAsBuffer)
//   const url = `http://localhost:3000${savedPath}`
//   return url
// }
export const savePostsCovers = (filename, contentAsBuffer) =>
  writeFile(join(postsPublicFolderPath, filename), contentAsBuffer)

export const deletePostsImages = (fileName) =>
  unlink(postsPublicFolderPath, "../../", fileName)
export const getPDFsPath = (filename) => join(dataFolderPath, "./pdf", filename)
