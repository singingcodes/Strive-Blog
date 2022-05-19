import PdfPrinter from "pdfmake"
import striptags from "striptags"
import axios from "axios"

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
    imagePart = { image: base64Image, width: 500, margin: [0, 0, 0, 40] }
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
