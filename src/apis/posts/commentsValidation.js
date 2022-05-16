import { checkSchema } from "express-validator"

const commentSchema = {
  comment: {
    in: ["body"],
    isString: { errorMessage: "comment is required", min: 1 },
  },
}
export const checkCommentSchema = checkSchema(commentSchema)
