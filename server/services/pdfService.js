const pdfParse = require('pdf-parse');

/**
 * Extracts plain text from a PDF buffer
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<string>} - Extracted text
 */
async function extractText(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text.trim();
  } catch (err) {
    throw new Error('Failed to parse PDF: ' + err.message);
  }
}

module.exports = { extractText };