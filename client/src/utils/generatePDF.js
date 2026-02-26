import jsPDF from 'jspdf';

const ACCENT = [200, 75, 47];
const INK = [15, 14, 12];
const INK_MUTED = [74, 71, 64];
const INK_FAINT = [138, 134, 128];
const GREEN = [45, 122, 79];
const GOLD = [201, 168, 76];
const BLUE = [43, 95, 142];
const PAPER_WARM = [240, 236, 228];
const WHITE = [255, 255, 255];
const LIGHT_GRAY = [248, 245, 240];

function scoreColor(score) {
  if (score >= 80) return GREEN;
  if (score >= 60) return GOLD;
  return ACCENT;
}

function priorityColor(priority) {
  if (priority === 'high') return ACCENT;
  if (priority === 'medium') return GOLD;
  return BLUE;
}

function drawRect(doc, x, y, w, h, color, radius = 0) {
  doc.setFillColor(...color);
  if (radius > 0) {
    doc.roundedRect(x, y, w, h, radius, radius, 'F');
  } else {
    doc.rect(x, y, w, h, 'F');
  }
}

function drawProgressBar(doc, x, y, w, h, value, color) {
  // Background
  doc.setFillColor(...PAPER_WARM);
  doc.roundedRect(x, y, w, h, h / 2, h / 2, 'F');
  // Fill
  const fillW = Math.max((value / 100) * w, h);
  doc.setFillColor(...color);
  doc.roundedRect(x, y, fillW, h, h / 2, h / 2, 'F');
}

function drawSectionHeader(doc, y, title, pageW, margin) {
  // Left accent bar
  drawRect(doc, margin, y, 3, 7, ACCENT);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  doc.text(title.toUpperCase(), margin + 8, y + 5.5);
  // Separator line
  doc.setDrawColor(...PAPER_WARM);
  doc.setLineWidth(0.5);
  doc.line(margin, y + 10, pageW - margin, y + 10);
  return y + 16;
}

function checkPageBreak(doc, y, needed, pageH, margin, addHeader) {
  if (y + needed > pageH - margin) {
    doc.addPage();
    addHeader(doc);
    return margin + 20;
  }
  return y;
}

function addPageHeader(doc, pageW) {
  drawRect(doc, 0, 0, pageW, 12, INK);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('ResumeIQ', 14, 8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 180, 180);
  doc.text('Resume Analysis Report', pageW - 14, 8, { align: 'right' });
}

export function generatePDF(analysis, matchData) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentW = pageW - margin * 2;

  const a = analysis;
  const m = matchData;
  const name = a.candidate?.name || 'Resume Analysis';
  const date = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // ─── COVER PAGE ───────────────────────────────────────────────
  // Top dark band
  drawRect(doc, 0, 0, pageW, 80, INK);

  // ResumeIQ logo text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(200, 75, 47);
  doc.text('ResumeIQ', margin, 18);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text('Resume Analysis', margin, 38);
  doc.text('Report', margin, 50);

  // Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(160, 155, 148);
  doc.text(`Generated on ${date}`, margin, 62);

  // Score circle on cover
  const cx = pageW - 45, cy = 40, cr = 22;
  const sc = scoreColor(a.score.overall);
  // Outer ring bg
  doc.setDrawColor(...PAPER_WARM);
  doc.setLineWidth(3);
  doc.circle(cx, cy, cr, 'S');
  // Score arc (approximate with filled circle overlay)
  doc.setDrawColor(...sc);
  doc.setLineWidth(3);
  doc.circle(cx, cy, cr, 'S');
  // Score number
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text(String(a.score.overall), cx, cy + 2, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(160, 155, 148);
  doc.text('/100', cx, cy + 8, { align: 'center' });

  // Candidate info card
  drawRect(doc, margin, 88, contentW, 40, WHITE);
  doc.setDrawColor(...PAPER_WARM);
  doc.setLineWidth(0.5);
  doc.rect(margin, 88, contentW, 40, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...INK);
  doc.text(name, margin + 10, 103);

  if (a.candidate?.summary) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...INK_MUTED);
    const lines = doc.splitTextToSize(a.candidate.summary, contentW - 20);
    doc.text(lines.slice(0, 2), margin + 10, 112);
  }

  // Grade badge
  const grade = a.score.grade;
  drawRect(doc, pageW - margin - 30, 92, 28, 14, PAPER_WARM, 3);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...INK_MUTED);
  doc.text(`Grade: ${grade}`, pageW - margin - 16, 100.5, { align: 'center' });

  // Score summary boxes
  const boxes = [
    { label: 'Overall Score', value: `${a.score.overall}/100`, color: scoreColor(a.score.overall) },
    { label: 'Grade', value: a.score.grade, color: INK },
    { label: 'Job Match', value: m ? `${m.matchScore}/100` : 'N/A', color: m ? scoreColor(m.matchScore) : INK_FAINT },
    { label: 'ATS Score', value: m?.atsOptimization ? `${m.atsOptimization.score}/100` : 'N/A', color: INK_MUTED },
  ];

  const boxW = (contentW - 12) / 4;
  boxes.forEach((box, i) => {
    const bx = margin + i * (boxW + 4);
    const by = 140;
    drawRect(doc, bx, by, boxW, 28, LIGHT_GRAY, 3);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(...box.color);
    doc.text(box.value, bx + boxW / 2, by + 13, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...INK_FAINT);
    doc.text(box.label, bx + boxW / 2, by + 22, { align: 'center' });
  });

  // Footer on cover
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...INK_FAINT);
  doc.text('Powered by ResumeIQ · AI-driven career intelligence', pageW / 2, pageH - 10, { align: 'center' });

  // ─── PAGE 2+ CONTENT ──────────────────────────────────────────
  doc.addPage();
  addPageHeader(doc, pageW);
  let y = 22;

  const addHeader = (d) => { addPageHeader(d, pageW); };

  // ─── SCORE BREAKDOWN ─────────────────────────────────────────
  y = drawSectionHeader(doc, y, 'Score Breakdown', pageW, margin);

  Object.entries(a.score.breakdown).forEach(([key, val]) => {
    y = checkPageBreak(doc, y, 14, pageH, margin, addHeader);
    const label = key.charAt(0).toUpperCase() + key.slice(1);
    const col = scoreColor(val);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...INK);
    doc.text(label, margin, y + 4);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...col);
    doc.text(String(val), pageW - margin, y + 4, { align: 'right' });
    drawProgressBar(doc, margin, y + 6, contentW, 4, val, col);
    y += 14;
  });

  y += 6;

  // ─── STRENGTHS ───────────────────────────────────────────────
  if (a.strengths?.length > 0) {
    y = checkPageBreak(doc, y, 20, pageH, margin, addHeader);
    y = drawSectionHeader(doc, y, 'Strengths', pageW, margin);
    a.strengths.forEach((str) => {
      y = checkPageBreak(doc, y, 12, pageH, margin, addHeader);
      drawRect(doc, margin, y, 4, 4, GREEN, 1);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...INK_MUTED);
      const lines = doc.splitTextToSize(str, contentW - 12);
      doc.text(lines, margin + 8, y + 3.5);
      y += lines.length * 5 + 4;
    });
    y += 4;
  }

  // ─── IMPROVEMENTS ────────────────────────────────────────────
  if (a.improvements?.length > 0) {
    y = checkPageBreak(doc, y, 20, pageH, margin, addHeader);
    y = drawSectionHeader(doc, y, 'Improvements', pageW, margin);
    a.improvements.forEach((item) => {
      const pc = priorityColor(item.priority);
      y = checkPageBreak(doc, y, 28, pageH, margin, addHeader);
      // Card background
      drawRect(doc, margin, y, contentW, 2, pc);
      drawRect(doc, margin, y + 2, contentW, 24, LIGHT_GRAY);
      // Priority badge
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(...pc);
      doc.text(item.priority.toUpperCase(), margin + 4, y + 8);
      // Category
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...INK_FAINT);
      doc.text(item.category || '', margin + 30, y + 8);
      // Issue
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(...INK);
      const issueLines = doc.splitTextToSize(`Issue: ${item.issue}`, contentW - 8);
      doc.text(issueLines, margin + 4, y + 14);
      // Suggestion
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...GREEN);
      const sugLines = doc.splitTextToSize(`Fix: ${item.suggestion}`, contentW - 8);
      doc.text(sugLines, margin + 4, y + 14 + issueLines.length * 4.5);
      y += 28 + (issueLines.length + sugLines.length - 2) * 4 + 4;
    });
    y += 4;
  }

  // ─── SKILLS ──────────────────────────────────────────────────
  if (a.skills) {
    y = checkPageBreak(doc, y, 20, pageH, margin, addHeader);
    y = drawSectionHeader(doc, y, 'Skills Detected', pageW, margin);
    Object.entries(a.skills).forEach(([category, items]) => {
      if (!items?.length) return;
      y = checkPageBreak(doc, y, 16, pageH, margin, addHeader);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...INK_FAINT);
      doc.text(category.toUpperCase(), margin, y + 4);
      y += 8;
      // Draw skill tags in rows
      let tx = margin;
      items.forEach((skill) => {
        const sw = doc.getTextWidth(skill) + 8;
        if (tx + sw > pageW - margin) { tx = margin; y += 9; }
        y = checkPageBreak(doc, y, 10, pageH, margin, addHeader);
        drawRect(doc, tx, y - 3, sw, 7, PAPER_WARM, 2);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...INK_MUTED);
        doc.text(skill, tx + 4, y + 1.5);
        tx += sw + 4;
      });
      y += 12;
    });
    y += 4;
  }

  // ─── KEYWORDS ────────────────────────────────────────────────
  if (a.keywords?.length > 0 || a.missingKeywords?.length > 0) {
    y = checkPageBreak(doc, y, 20, pageH, margin, addHeader);
    y = drawSectionHeader(doc, y, 'Keywords Analysis', pageW, margin);

    if (a.keywords?.length > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...GREEN);
      doc.text('PRESENT IN RESUME', margin, y + 4);
      y += 8;
      let tx = margin;
      a.keywords.forEach((k) => {
        const kw = doc.getTextWidth(k) + 8;
        if (tx + kw > pageW - margin) { tx = margin; y += 9; }
        drawRect(doc, tx, y - 3, kw, 7, [208, 235, 218], 2);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...GREEN);
        doc.text(k, tx + 4, y + 1.5);
        tx += kw + 4;
      });
      y += 12;
    }

    if (a.missingKeywords?.length > 0) {
      y = checkPageBreak(doc, y, 16, pageH, margin, addHeader);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...ACCENT);
      doc.text('MISSING / SUGGESTED', margin, y + 4);
      y += 8;
      let tx = margin;
      a.missingKeywords.forEach((k) => {
        const kw = doc.getTextWidth(k) + 8;
        if (tx + kw > pageW - margin) { tx = margin; y += 9; }
        drawRect(doc, tx, y - 3, kw, 7, [240, 213, 206], 2);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(...ACCENT);
        doc.text(k, tx + 4, y + 1.5);
        tx += kw + 4;
      });
      y += 12;
    }
    y += 4;
  }

  // ─── JOB MATCH ───────────────────────────────────────────────
  if (m) {
    y = checkPageBreak(doc, y, 30, pageH, margin, addHeader);
    y = drawSectionHeader(doc, y, `Job Match · ${m.matchScore}/100`, pageW, margin);

    // Match score bar
    const mc = scoreColor(m.matchScore);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...mc);
    doc.text(`${m.matchScore}/100  ·  Grade: ${m.matchGrade}`, margin, y + 4);
    drawProgressBar(doc, margin, y + 7, contentW, 5, m.matchScore, mc);
    if (m.verdict) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...INK_MUTED);
      const vLines = doc.splitTextToSize(m.verdict, contentW);
      doc.text(vLines, margin, y + 18);
      y += 18 + vLines.length * 5;
    } else {
      y += 16;
    }

    if (m.matchedRequirements?.length > 0) {
      y = checkPageBreak(doc, y, 16, pageH, margin, addHeader);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...GREEN);
      doc.text('MATCHED REQUIREMENTS', margin, y + 4);
      y += 8;
      m.matchedRequirements.forEach((r) => {
        y = checkPageBreak(doc, y, 14, pageH, margin, addHeader);
        drawRect(doc, margin, y, 3, 3, GREEN, 1);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...INK);
        doc.text(r.requirement, margin + 7, y + 2.5);
        if (r.evidence) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(...INK_MUTED);
          const eLines = doc.splitTextToSize(r.evidence, contentW - 10);
          doc.text(eLines, margin + 7, y + 7);
          y += 8 + eLines.length * 4;
        } else {
          y += 8;
        }
      });
      y += 4;
    }

    if (m.missingRequirements?.length > 0) {
      y = checkPageBreak(doc, y, 16, pageH, margin, addHeader);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...ACCENT);
      doc.text('GAPS FOUND', margin, y + 4);
      y += 8;
      m.missingRequirements.forEach((r) => {
        y = checkPageBreak(doc, y, 16, pageH, margin, addHeader);
        drawRect(doc, margin, y, 3, 3, ACCENT, 1);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...INK);
        doc.text(r.requirement, margin + 7, y + 2.5);
        if (r.gap) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(8);
          doc.setTextColor(...INK_MUTED);
          const gLines = doc.splitTextToSize(r.gap, contentW - 10);
          doc.text(gLines, margin + 7, y + 7);
          y += 5 + gLines.length * 4;
        }
        if (r.howToAddress) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(8);
          doc.setTextColor(...BLUE);
          const hLines = doc.splitTextToSize(`How to fix: ${r.howToAddress}`, contentW - 10);
          doc.text(hLines, margin + 7, y + 4);
          y += 4 + hLines.length * 4;
        }
        y += 4;
      });
    }

    if (m.atsOptimization) {
      y = checkPageBreak(doc, y, 20, pageH, margin, addHeader);
      drawRect(doc, margin, y, contentW, 18, LIGHT_GRAY, 3);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...INK);
      doc.text(`ATS Score: ${m.atsOptimization.score}/100`, margin + 6, y + 7);
      drawProgressBar(doc, margin + 6, y + 10, contentW - 12, 4, m.atsOptimization.score, scoreColor(m.atsOptimization.score));
      y += 22;
    }
  }

  // ─── PAGE NUMBERS ─────────────────────────────────────────────
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 2; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...INK_FAINT);
    doc.text(`Page ${i} of ${totalPages}`, pageW / 2, pageH - 6, { align: 'center' });
    doc.text('ResumeIQ Report', margin, pageH - 6);
    doc.text(date, pageW - margin, pageH - 6, { align: 'right' });
  }

  // ─── SAVE ─────────────────────────────────────────────────────
  const fileName = `ResumeIQ_Report_${name.replace(/\s+/g, '_')}_${new Date().getFullYear()}.pdf`;
  doc.save(fileName);
}