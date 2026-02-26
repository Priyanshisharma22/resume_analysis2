const pdf = require('pdf-parse');
const pdfParse = pdf.default || pdf;

async function extractText(buffer) {
  const data = await pdfParse(buffer);
  return data.text.trim();
}

module.exports = { extractText };