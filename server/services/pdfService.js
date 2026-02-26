const pdf = require('pdf-parse');
const pdfParse = pdf.default || pdf;

/**
 * Extracts plain text from a PDF buffer
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<string>} - Extracted text
 */
async function extractText(buffer) {
  const data = await pdfParse(buffer);
  return data.text.trim();
}

module.exports = { extractText };