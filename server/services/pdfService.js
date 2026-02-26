const { PdfReader } = require('pdfreader');

/**
 * Extracts plain text from a PDF buffer
 * @param {Buffer} buffer - PDF file buffer
 * @returns {Promise<string>} - Extracted text
 */
async function extractText(buffer) {
  return new Promise((resolve, reject) => {
    const rows = {};
    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) {
        reject(new Error('Failed to parse PDF: ' + err.message));
      } else if (!item) {
        // End of file - join all rows
        const text = Object.keys(rows)
          .sort((a, b) => a - b)
          .map(y => rows[y].join(' '))
          .join('\n')
          .trim();
        resolve(text);
      } else if (item.text) {
        const y = item.y;
        if (!rows[y]) rows[y] = [];
        rows[y].push(item.text);
      }
    });
  });
}

module.exports = { extractText };