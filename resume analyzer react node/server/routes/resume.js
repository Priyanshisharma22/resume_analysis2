const express = require('express');
const router = express.Router();
const resumeService = require('../services/resumeService');
const pdfService = require('../services/pdfService');

/**
 * POST /api/resume/parse-pdf
 * Upload a PDF and extract text from it
 */
router.post('/parse-pdf', async (req, res) => {
  try {
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ error: 'No PDF file uploaded' });
    }

    const file = req.files.resume;
    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'File must be a PDF' });
    }

    const text = await pdfService.extractText(file.data);
    res.json({ text, filename: file.name });
  } catch (err) {
    console.error('PDF parse error:', err);
    res.status(500).json({ error: 'Failed to parse PDF: ' + err.message });
  }
});

/**
 * POST /api/resume/analyze
 * Full analysis: parse, score, extract info, suggest improvements
 * Body: { resumeText: string }
 */
router.post('/analyze', async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({ error: 'Resume text is too short or missing' });
    }

    const analysis = await resumeService.analyzeResume(resumeText);
    res.json(analysis);
  } catch (err) {
    console.error('Analyze error:', err);
    res.status(500).json({ error: 'Failed to analyze resume: ' + err.message });
  }
});

/**
 * POST /api/resume/match
 * Match resume against a job description
 * Body: { resumeText: string, jobDescription: string }
 */
router.post('/match', async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;
    if (!resumeText || !jobDescription) {
      return res.status(400).json({ error: 'Both resumeText and jobDescription are required' });
    }

    const match = await resumeService.matchJobDescription(resumeText, jobDescription);
    res.json(match);
  } catch (err) {
    console.error('Match error:', err);
    res.status(500).json({ error: 'Failed to match job description: ' + err.message });
  }
});

module.exports = router;