import jsPDF from 'jspdf';
import { ExamPaperData, ExamAttemptResult } from '../types';

export function generatePdfReport(report: ExamAttemptResult, paper: ExamPaperData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 15) {
      // Add page number footer before adding new page
      doc.setFontSize(8);
      doc.setTextColor(140, 140, 140);
      doc.setFont('helvetica', 'normal');
      doc.text(
        `Page ${doc.getNumberOfPages()} · PaceMark Revision Diagnostics`,
        pageWidth / 2,
        pageHeight - 8,
        { align: 'center' }
      );

      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  };

  // --- Header & Document Info ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(margin, y, contentWidth, 22, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('PaceMark Revision · Exam Performance & Pacing Report', margin + 5, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(203, 213, 225); // slate-300
  const dateStr = new Date(report.completedAt).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  doc.text(`${paper.subject} (${paper.examBoard || 'Standard Academic'})  |  Completed: ${dateStr}`, margin + 5, y + 15);

  y += 26;

  // --- Paper Title ---
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(report.paperTitle, margin, y);
  y += 6;

  // --- Executive KPI Summary Cards (4 columns) ---
  const kpiWidth = (contentWidth - 6) / 4;
  const kpiHeight = 18;

  const kpis = [
    { label: 'Score Awarded', val: `${report.totalMarksAwarded} / ${report.maxPossibleMarks}`, sub: `${report.percentage}% overall` },
    { label: 'Est. Grade', val: report.gradeEstimated.split(' ')[0], sub: 'Academic Scale' },
    { label: 'Pacing Discipline', val: `${report.pacingDisciplineScore}%`, sub: `${report.panicTrapsCount} time traps` },
    {
      label: 'Time Taken',
      val: `${Math.floor(report.totalTimeSpentSeconds / 60)}m ${report.totalTimeSpentSeconds % 60}s`,
      sub: `of ${Math.round(report.allocatedTimeSeconds / 60)}m allocated`
    },
  ];

  kpis.forEach((kpi, index) => {
    const kpiX = margin + index * (kpiWidth + 2);
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.rect(kpiX, y, kpiWidth, kpiHeight, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, kpiX + 3, y + 4.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(kpi.val, kpiX + 3, y + 10.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.sub, kpiX + 3, y + 15);
  });

  y += kpiHeight + 6;

  // --- Section 1: Question Pacing Table ---
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Question Time Pacing Breakdown', margin, y);
  y += 4;

  // Table header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 6, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);

  doc.text('Question', margin + 2, y + 4.2);
  doc.text('Topic', margin + 22, y + 4.2);
  doc.text('Marks', margin + 85, y + 4.2);
  doc.text('Actual Time', margin + 105, y + 4.2);
  doc.text('Target', margin + 130, y + 4.2);
  doc.text('Pacing Diagnosis', margin + 150, y + 4.2);
  y += 7;

  paper.questions.forEach((q) => {
    checkPageBreak(7);
    const ans = report.studentAnswers[q.id];
    const timeSpent = ans?.timeSpentSeconds || 0;
    const spentStr = `${Math.floor(timeSpent / 60)}m ${(timeSpent % 60).toString().padStart(2, '0')}s`;
    const targetStr = `${q.recommendedMinutes}m`;
    const evalData = report.questionEvaluations[q.id];
    const marksStr = `${evalData?.marksAwarded ?? 0} / ${q.marks}`;
    const status = evalData?.pacingEvaluation?.status || 'optimal';

    let statusLabel = 'Optimal Pace';
    if (status === 'panic_risk') statusLabel = 'Time Trap (Panic)';
    else if (status === 'slow_trap') statusLabel = 'Slow Pace';
    else if (status === 'rushed') statusLabel = 'Rushed';

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(30, 41, 59);

    doc.text(`Q${q.number}`, margin + 2, y + 3.5);

    // Truncate topic if too long
    const topicText = q.topic.length > 32 ? q.topic.slice(0, 30) + '...' : q.topic;
    doc.text(topicText, margin + 22, y + 3.5);

    doc.text(marksStr, margin + 85, y + 3.5);
    doc.text(spentStr, margin + 105, y + 3.5);
    doc.text(targetStr, margin + 130, y + 3.5);

    if (status === 'panic_risk') {
      doc.setTextColor(225, 29, 72); // rose-600
      doc.setFont('helvetica', 'bold');
    } else if (status === 'slow_trap') {
      doc.setTextColor(217, 119, 6); // amber-600
    } else if (status === 'optimal') {
      doc.setTextColor(22, 101, 52); // emerald-800
    }
    doc.text(statusLabel, margin + 150, y + 3.5);

    // subtle hairline separator
    doc.setDrawColor(241, 245, 249);
    doc.line(margin, y + 5.5, margin + contentWidth, y + 5.5);
    y += 6;
  });

  y += 4;

  // --- Section 2: Identified Weak Topics (if any) ---
  if (report.weakTopics.length > 0) {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text('2. Identified Weak Topics & Gaps', margin, y);
    y += 5;

    report.weakTopics.forEach((wt) => {
      checkPageBreak(8);
      doc.setFillColor(254, 242, 242); // rose-50
      doc.setDrawColor(254, 205, 211);
      doc.rect(margin, y, contentWidth, 7, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(159, 18, 57);
      doc.text(`• ${wt.topic}`, margin + 3, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      const gapInfo = `Lost: -${wt.marksLost} marks  |  Excess Time: ${Math.round(wt.timeLostSeconds / 60)}m`;
      doc.text(gapInfo, margin + contentWidth - 4, y + 4.5, { align: 'right' });
      y += 8.5;
    });
    y += 3;
  }

  // --- Section 3: Question-by-Question Detailed Examiner Audit ---
  checkPageBreak(20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('3. Detailed Examiner Feedback & Mark Scheme Audit', margin, y);
  y += 6;

  paper.questions.forEach((q) => {
    checkPageBreak(40);
    const evalData = report.questionEvaluations[q.id];
    const ans = report.studentAnswers[q.id];
    const studentAnswerText = ans?.answerText?.trim() || '(No response written)';
    const marksAwarded = evalData?.marksAwarded ?? 0;

    // Question box header
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin, y, contentWidth, 7, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Question ${q.number}: ${q.topic}  [Command Word: ${q.commandWord}]`, margin + 3, y + 4.8);

    doc.setTextColor(30, 41, 59);
    doc.text(`Score: ${marksAwarded} / ${q.marks} Marks`, margin + contentWidth - 3, y + 4.8, { align: 'right' });
    y += 9;

    // Prompt text
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    const splitPrompt = doc.splitTextToSize(`Prompt: ${q.questionText}`, contentWidth - 4);
    checkPageBreak(splitPrompt.length * 3.5 + 2);
    doc.text(splitPrompt, margin + 2, y);
    y += splitPrompt.length * 3.5 + 2;

    // Student response box
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Student's Script:", margin + 2, y);
    y += 3.5;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const splitScript = doc.splitTextToSize(studentAnswerText, contentWidth - 6);
    checkPageBreak(splitScript.length * 3.5 + 3);
    doc.text(splitScript, margin + 4, y);
    y += splitScript.length * 3.5 + 3;

    // Official Mark Scheme Points
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(29, 78, 216); // blue-700
    doc.text('Official Mark Scheme Criteria:', margin + 2, y);
    y += 3.5;

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    q.markScheme.points.forEach((pt) => {
      const splitPt = doc.splitTextToSize(`- ${pt}`, contentWidth - 6);
      checkPageBreak(splitPt.length * 3.5 + 1);
      doc.text(splitPt, margin + 4, y);
      y += splitPt.length * 3.5 + 1;
    });
    y += 2;

    // Examiner points hit & missed
    if (evalData) {
      if (evalData.awardedPoints && evalData.awardedPoints.length > 0) {
        checkPageBreak(8);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(22, 101, 52); // green-800
        doc.text('Awarded Points: ' + evalData.awardedPoints.join(' | '), margin + 2, y);
        y += 4;
      }

      if (evalData.missedPoints && evalData.missedPoints.length > 0) {
        checkPageBreak(8);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(185, 28, 28); // red-700
        doc.text('Missed Points: ' + evalData.missedPoints.join(' | '), margin + 2, y);
        y += 4;
      }

      // Pacing observation
      if (evalData.pacingEvaluation?.feedback) {
        checkPageBreak(8);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(146, 64, 14); // amber-800
        const paceLine = `Pacing Note: ${evalData.pacingEvaluation.feedback}`;
        const splitPace = doc.splitTextToSize(paceLine, contentWidth - 4);
        doc.text(splitPace, margin + 2, y);
        y += splitPace.length * 3.5 + 2;
      }

      // Examiner Tip
      if (evalData.examinerTip) {
        checkPageBreak(8);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(71, 85, 105);
        const tipLine = `Examiner Tip: ${evalData.examinerTip}`;
        const splitTip = doc.splitTextToSize(tipLine, contentWidth - 4);
        doc.text(splitTip, margin + 2, y);
        y += splitTip.length * 3.5 + 3;
      }
    }

    y += 5; // spacing between questions
  });

  // Footer on last page
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Page ${doc.getNumberOfPages()} · PaceMark Revision Diagnostics`,
    pageWidth / 2,
    pageHeight - 8,
    { align: 'center' }
  );

  // Trigger download with sanitized filename
  const cleanSubject = paper.subject.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `PaceMark_Report_${cleanSubject}_${Date.now()}.pdf`;
  doc.save(filename);
}
