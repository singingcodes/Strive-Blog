import PdfPrinter from "pdfmake"
import striptags from "striptags"
import axios from "axios"
import fs from "fs-extra"
import { pipeline } from "stream"
import { promisify } from "util"
import { getPDFsPath } from "./fsTools.js"

const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
}
const printer = new PdfPrinter(fonts)
export const getPDFReadableStream = async (post) => {
  let imagePart = {}
  if (post.cover) {
    const response = await axios.get(post.cover, {
      responseType: "arraybuffer",
    })
    console.log(response)
    const blogCoverURLParts = post.cover.split("/")
    const fileName = blogCoverURLParts[blogCoverURLParts.length - 1]
    const [id, extension] = fileName.split(".")
    const base64 = response.data.toString("base64")
    const base64Image = `data:image/${extension};base64,${base64}`
    imagePart = { image: base64Image, width: 400, margin: [0, 0, 0, 40] }
  }

  const docDefinition = {
    content: [
      imagePart,
      { text: post.title, style: "header" },
      { text: striptags(post.content), lineHeight: 1.5 },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 20],
      },
      subheader: {
        fontSize: 15,
        bold: true,
      },
      small: {
        fontSize: 8,
      },
      defaultStyle: {
        font: "Helvetica",
      },
    },
  }

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {})

  pdfReadableStream.end()

  return pdfReadableStream
}
export const generatePDFAsync = async (post) => {
  const asyncPipeline = promisify(pipeline) // Promisify is a veeeeery cool function from 'util' core module, which transforms a function that uses callbacks (error-first callbacks) into a function that uses Promises instead (and so Async/Await). Pipeline is a function which works with error-first callbac --> I can promisify a pipeline, obtaining a "Promises-based pipeline"

  const pdfReadableStream = await getPDFReadableStream(post)

  const path = getPDFsPath("test.pdf")

  await asyncPipeline(pdfReadableStream, fs.createWriteStream(path))
  return path
}
