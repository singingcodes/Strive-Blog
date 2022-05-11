import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"

const authorsRouter = express.Router()
const currentFile = import.meta.url
console.log(currentFile)
const currentFilePath = fileURLToPath(currentFile)
const currentDirectory = dirname(currentFilePath)
console.log(currentDirectory)
const authorsJSONPath = join(currentDirectory, "authors.json")

// POST /authors
authorsRouter.post("/", (req, res) => {
  const newAuthor = { ...req.body, id: uniqid(), createdAt: new Date() }
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
  authors.push(newAuthor)
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authors))
  res.status(201).send(newAuthor)
})
// GET /authors
authorsRouter.get("/", (req, res) => {
  const blogFileContent = fs.readFileSync(authorsJSONPath)
  const authors = JSON.parse(blogFileContent)
  res.send(authors)
})
// GET /authors/:id
authorsRouter.get("/:id", (req, res) => {
  const blogFileContent = fs.readFileSync(authorsJSONPath)
  const authors = JSON.parse(blogFileContent)
  const author = authors.find((author) => author.id === req.params.id)
  if (author) {
    res.send(author)
  } else {
    res.status(404).send({ error: "Author not found" })
  }
})
// PUT /authors/:id
authorsRouter.put("/:authorId", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
  const author = authors.findIndex(
    (author) => author.id === req.params.authorId
  )
  if (author === -1) {
    res.status(404).send({ error: "Author not found" })
  } else {
    const oldAuthor = authors[author]
    const newAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() }

    authors[author] = newAuthor

    fs.writeFileSync(authorsJSONPath, JSON.stringify(authors))
    res.send(newAuthor)
  }
})

// DELETE /authors/:id
authorsRouter.delete("/:authorId", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
  const authorsLeft = authors.filter(
    (author) => author.id !== req.params.authorId
  )
  fs.writeFileSync(authorsJSONPath, JSON.stringify(authorsLeft))
  res.status(204).send()
})

//POST authors/checkEmail => check if another author has the same email. The parameter should be passed in the body. It should return true or false.
//It should not be possible to add a new author (with POST /authors) if another has the same email
authorsRouter.post("/checkEmail", (req, res) => {
  const { email } = req.body
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
  const author = authors.find((author) => author.email === email)
  if (author) {
    res.status(404).json({
      message: "Email already exists",
      success: false,
    })
  } else {
    res.status(200).json({
      message: "Email is available",
      success: true,
    })
  }
})

export default authorsRouter
