import { checkSchema } from "express-validator"

const commentSchema = {
  comment: {
    in: ["body"],
    isString: { errorMessage: "comment is required", min: 1 },
  },
}
const commentUpdateSchema = {
  comment: {
    in: ["body"],
    isString: { errorMessage: "comment is required", min: 1 },
  },
  optional: true,
}
export const checkCommentSchema = checkSchema(commentSchema)
export const checkCommentUpdateSchema = checkSchema(commentUpdateSchema)
