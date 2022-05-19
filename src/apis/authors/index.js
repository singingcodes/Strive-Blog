import express from "express"
import createError from "http-errors"
import uniqid from "uniqid"
import multer from "multer"
import {
  getAuthors,
  writeAuthors,
  saveAuthorsAvatars,
} from "../../lib/fsTools.js"
import { sendRegistrationEmail } from "../../lib/email-tools.js"

const authorsRouter = express.Router()

// POST /authors
authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = { ...req.body, id: uniqid(), createdAt: new Date() }
    const authors = await getAuthors()
    authors.push(newAuthor)
    await writeAuthors(authors)
    const { email } = req.body
    await sendRegistrationEmail(email)
    res.status(201).send({ message: "Author created successfully" })
  } catch (error) {
    next(error)
  }
})

// GET /authors
authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await getAuthors()
    if (req.query && req.query.title) {
      const filteredAuthors = authors.filter((author) =>
        author.title.toLowerCase().includes(req.query.title.toLowerCase())
      )
      res.send(filteredAuthors)
    } else {
      res.send(authors)
    }
  } catch (error) {
    next(error)
  }
})
// GET /authors/:id
authorsRouter.get("/:authorId", async (req, res, next) => {
  try {
    const authors = await getAuthors()
    const author = authors.find((author) => author.id === req.params.id)
    if (author) {
      res.send(author)
    } else {
      next(createError(404, "author with ${req.params.id} not found"))
    }
  } catch (error) {
    next(error)
  }
})
// PUT /authors/:id
authorsRouter.put("/:authorId", async (req, res, next) => {
  try {
    const authors = await getAuthors()
    const author = authors.findIndex(
      (author) => author.id === req.params.authorId
    )
    if (author === -1) {
      const oldAuthor = authors[author]
      const newAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() }
      authors[author] = newAuthor
      await writeAuthors(authors)
      res.send(newAuthor)
    } else {
      next(createError(404, "Author not found"))
    }
  } catch (error) {
    next(error)
  }
})

// DELETE /authors/:id
authorsRouter.delete("/:authorId", async (req, res) => {
  try {
    const authors = await getAuthors()
    const authorsLeft = authors.filter(
      (author) => author.id !== req.params.authorId
    )
    await writeAuthors(authorsLeft)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

//POST authors/checkEmail => check if another author has the same email. The parameter should be passed in the body. It should return true or false.
//It should not be possible to add a new author (with POST /authors) if another has the same email
authorsRouter.post("/checkEmail", async (req, res) => {
  const { email } = req.body
  const authors = await getAuthors
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
authorsRouter.post(
  "/:authorId/avatar",
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
      const url = await saveAuthorsAvatars(
        req.file.originalname,
        req.file.buffer
      )
      const authors = await getAuthors()
      const author = authors.findIndex(
        (author) => author.id === req.params.authorId
      )
      if (author !== -1) {
        const oldAuthor = authors[author]
        const newAuthor = { ...oldAuthor, avatar: url, updatedAt: new Date() }
        authors[author] = newAuthor
        await writeAuthors(authors)
        res.send(newAuthor)
      } else {
        next(createError(404, "Author not found"))
      }
    } catch (error) {
      next(error)
    }
  }
)

export default authorsRouter
