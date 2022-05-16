import { checkSchema, validationResult } from "express-validator"
import createError from "http-errors"

const postSchema = {
  category: {
    in: ["body"],
    isString: { errorMessage: "Category is required", options: { min: 1 } },
  },
  title: {
    in: ["body"],
    isString: { errorMessage: "Title is required", min: 1 },
  },

  "readTime.value": {
    in: ["body"],
    isInt: { errorMessage: "Read time is required" },
  },

  "readTime.unit": {
    in: ["body"],
    isString: { errorMessage: "Unit is required" },
  },

  "author.name": {
    in: ["body"],
    isString: { errorMessage: "Author's Name is required" },
  },
  "author.avatar": {
    in: ["body"],
    isString: { errorMessage: "Author's Avatar is required" },
  },

  content: {
    in: ["body"],
    isString: { errorMessage: "Content is required", min: 1 },
  },
}

const postUpdateSchema = {
  category: {
    in: ["body"],
    isString: { errorMessage: "Category is required", options: { min: 1 } },
    optional: true,
  },
  title: {
    in: ["body"],
    isString: { errorMessage: "Title is required", min: 1 },
    optional: true,
  },

  cover: {
    in: ["body"],
    isURL: { errorMessage: "Cover is required" },
    optional: true,
  },

  "readTime.value": {
    in: ["body"],
    isInt: { errorMessage: "Read time is required" },
    optional: true,
  },

  "readTime.unit": {
    in: ["body"],
    isString: { errorMessage: "Unit is required" },
    optional: true,
  },

  "author.name": {
    in: ["body"],
    isString: { errorMessage: "Author's Name is required" },
    optional: true,
  },
  "author.avatar": {
    in: ["body"],
    isString: { errorMessage: "Author's Avatar is required" },
    optional: true,
  },
  content: {
    in: ["body"],
    isString: { errorMessage: "Content is required", min: 1 },
    optional: true,
  },
}

export const checkPostSchema = checkSchema(postSchema)
export const checkPostUpdateSchema = checkSchema(postUpdateSchema)
export const checkPostValidationResult = (req, res, next) => {
  const errors = validationResult(req)
  console.log(errors)
  if (!errors.isEmpty()) {
    next(createError(400, "validation errors", { errorsList: errors.array() }))
  } else {
    next()
  }
}
