import { DIMENSIONS, RECOMMENDATIONS, type Question } from "./diagnosticData";

// ── Color palette ──────────────────────────────────────────────────────────
type RGB = [number, number, number];
const C: Record<string, RGB> = {
  coverBg:      [22, 19, 66],
  coverStripe:  [38, 34, 100],
  indigo:       [99, 102, 241],
  indigoLight:  [224, 231, 255],
  indigoDark:   [30, 27, 75],
  white:        [255, 255, 255],
  slate800:     [30, 41, 59],
  slate700:     [51, 65, 85],
  slate600:     [71, 85, 105],
  slate500:     [100, 116, 139],
  slate400:     [148, 163, 184],
  slate200:     [226, 232, 240],
  slate50:      [248, 250, 252],
  green:        [16, 185, 129],
  amber:        [245, 158, 11],
  red:          [239, 68, 68],
  greenLight:   [209, 250, 229],
  amberLight:   [254, 243, 199],
  redLight:     [254, 226, 226],
};

export type Answer = { score: number; idx: number };

interface ReportInput {
  name: string;
  answers: Record<string, Answer>;
  questions: Question[];
  filename?: string;
}

export async function generateReport({ name, answers, questions, filename }: ReportInput) {
  // jsPDF 2.x exports a named `jsPDF` AND a default — try named first
  const jsPDFModule = await import("jspdf");
  const JsPDF = (jsPDFModule as any).jsPDF ?? jsPDFModule.default;
  if (!JsPDF) throw new Error("jsPDF failed to load");
  const doc = new JsPDF({ unit: "mm", format: "a4" });
  const PW = 210, PH = 297, M = 20, CW = 170;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const displayName = name || "Assessment Recipient";

  // ── Score calculations ───────────────────────────────────────────────────
  const totalScore = Object.values(answers).reduce((a, b) => a + b.score, 0);
  const healthScore = Math.max(0, 100 - Math.round((totalScore / (questions.length * 5)) * 100));

  const calcDim = (ids: string[]): number => {
    const valid = ids.filter((id) => answers[id]);
    if (!valid.length) return 50;
    return Math.max(
      0,
      100 - Math.round((valid.reduce((s, id) => s + answers[id].score, 0) / (valid.length * 5)) * 100)
    );
  };

  const dims = DIMENSIONS.map((d) => ({ ...d, score: calcDim(d.ids) }));

  const recs = RECOMMENDATIONS.filter((r) => (answers[r.q]?.score || 0) >= 4).slice(0, 5);
  if (recs.length === 0)
    recs.push({
      q: "",
      area: "Ongoing Optimization",
      finding: "Your comp infrastructure is performing well relative to growth-stage peers.",
      action:
        "Schedule a semi-annual comp review to maintain alignment as your GTM strategy evolves. Strong plans still require proactive maintenance.",
    });

  const riskColor  = (s: number): RGB => (s >= 70 ? C.green  : s >= 40 ? C.amber  : C.red);
  const riskLight  = (s: number): RGB => (s >= 70 ? C.greenLight : s >= 40 ? C.amberLight : C.redLight);
  const riskLabel  = (s: number) => (s >= 70 ? "LOW RISK" : s >= 40 ? "MODERATE RISK" : "HIGH RISK");
  const riskSummary = (s: number) =>
    s >= 70
      ? "Your comp infrastructure shows strong alignment across key dimensions. Focus on maintaining discipline as the team scales."
      : s >= 40
      ? "Moderate risk identified across one or more dimensions. Targeted intervention now prevents compounding problems at scale."
      : "Significant structural risk detected. Left unaddressed, these patterns typically manifest as rep attrition, quota misses, and commission disputes.";

  // ── Helpers ──────────────────────────────────────────────────────────────

  const set = (font: "times" | "helvetica", style: "bold" | "normal" | "italic", size: number, color: RGB) => {
    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };

  const drawLogo = (cx: number, y: number, large: boolean, color: RGB = C.white) => {
    const gSz = large ? 26 : 13, pSz = large ? 15 : 8.5, gap = large ? 10 : 6, lh = large ? 11 : 6;
    doc.setFont("times", "bold"); doc.setFontSize(gSz); doc.setTextColor(...color);
    const gW = doc.getTextWidth("GILL");
    doc.setFont("helvetica", "normal"); doc.setFontSize(pSz);
    const pW = doc.getTextWidth("GTM PARTNERS");
    const lx = cx - (gW + gap + pW) / 2;
    doc.setFont("times", "bold"); doc.setFontSize(gSz); doc.setTextColor(...color);
    doc.text("GILL", lx, y);
    doc.setDrawColor(...color); doc.setLineWidth(0.6);
    doc.line(lx + gW + gap / 2, y - lh + 2, lx + gW + gap / 2, y + 2);
    doc.setFont("helvetica", "normal"); doc.setFontSize(pSz); doc.setTextColor(...color);
    doc.text("GTM PARTNERS", lx + gW + gap, y);
  };

  const drawPageHeader = (title: string, page: number) => {
    doc.setFillColor(...C.indigo);
    doc.rect(0, 0, PW, 26, "F");
    drawLogo(46, 11, false, C.white);
    set("helvetica", "bold", 8.5, C.white);
    doc.text(title, PW - M, 10, { align: "right" });
    set("helvetica", "normal", 6.5, C.indigoLight);
    doc.text(
      `${date}  ·  Prepared for ${displayName}  ·  Page ${page}`,
      PW / 2, 20, { align: "center" }
    );
  };

  const pageFooter = () => {
    doc.setDrawColor(...C.slate200); doc.setLineWidth(0.25);
    doc.line(M, PH - 14, PW - M, PH - 14);
    set("helvetica", "normal", 6.5, C.slate400);
    doc.text("Gill GTM Partners  ·  Confidential — prepared exclusively for the recipient named above  ·  gillgtmpartners.com", PW / 2, PH - 8, { align: "center" });
  };

  const drawGauge = (cx: number, cy: number, r: number, score: number, trackWidth = 7) => {
    const arcStart = 135, arcSweep = 270, steps = 100;
    doc.setDrawColor(...C.slate200); doc.setLineWidth(trackWidth);
    for (let i = 0; i < steps; i++) {
      const a1 = toRad(arcStart + (arcSweep * i) / steps);
      const a2 = toRad(arcStart + (arcSweep * (i + 1)) / steps);
      doc.line(cx + r * Math.cos(a1), cy + r * Math.sin(a1), cx + r * Math.cos(a2), cy + r * Math.sin(a2));
    }
    const filled = Math.max(1, Math.round(steps * score / 100));
    const sw = arcSweep * score / 100;
    doc.setDrawColor(...riskColor(score)); doc.setLineWidth(trackWidth);
    for (let i = 0; i < filled; i++) {
      const a1 = toRad(arcStart + (sw * i) / filled);
      const a2 = toRad(arcStart + (sw * (i + 1)) / filled);
      doc.line(cx + r * Math.cos(a1), cy + r * Math.sin(a1), cx + r * Math.cos(a2), cy + r * Math.sin(a2));
    }
  };

  const riskBadge = (cx: number, y: number, score: number, h = 8) => {
    const w = 54;
    doc.setFillColor(...riskColor(score));
    doc.roundedRect(cx - w / 2, y, w, h, 2, 2, "F");
    set("helvetica", "bold", 7.5, C.white);
    doc.text(riskLabel(score), cx, y + h - 1.8, { align: "center" });
  };

  // ════════════════════════════════════════════════════════════════════════════
  // PAGE 1 — COVER
  // ════════════════════════════════════════════════════════════════════════════
  doc.setFillColor(...C.coverBg);
  doc.rect(0, 0, PW, PH, "F");

  // Top accent strip
  doc.setFillColor(...C.coverStripe);
  doc.rect(0, 0, PW, 52, "F");

  // Indigo accent line
  doc.setDrawColor(...C.indigo); doc.setLineWidth(0.5);
  doc.line(M + 15, 57, PW - M - 15, 57);

  drawLogo(PW / 2, 34, true, C.white);

  // Report titles
  set("helvetica", "bold", 8, [148, 163, 184]);
  doc.text("SALES COMPENSATION", PW / 2, 67, { align: "center" });
  set("times", "bold", 34, C.white);
  doc.text("HEALTH REPORT", PW / 2, 82, { align: "center" });

  // Large score circle
  const cCX = PW / 2, cCY = 158, cR = 40;
  // Outer decorative ring
  doc.setDrawColor(...C.coverStripe); doc.setLineWidth(1.5);
  doc.circle(cCX, cCY, cR + 9, "D");
  // White background
  doc.setFillColor(...C.white);
  doc.circle(cCX, cCY, cR, "F");

  // Gauge inside the white circle
  drawGauge(cCX, cCY, cR * 0.8, healthScore, 8);

  // Score number
  set("helvetica", "bold", 48, C.indigoDark);
  doc.text(`${healthScore}`, cCX, cCY + 8, { align: "center" });
  set("helvetica", "normal", 7.5, C.slate600);
  doc.text("HEALTH SCORE", cCX, cCY + 17, { align: "center" });

  riskBadge(cCX, cCY + cR + 6, healthScore, 9);

  // Name & date
  set("helvetica", "bold", 12, C.white);
  doc.text(displayName, PW / 2, cCY + cR + 24, { align: "center" });
  set("helvetica", "normal", 8, [148, 163, 184]);
  doc.text(date, PW / 2, cCY + cR + 32, { align: "center" });

  // Bottom dimension strip
  const dimStripY = PH - 58;
  doc.setDrawColor(...C.coverStripe); doc.setLineWidth(0.3);
  doc.line(M, dimStripY, PW - M, dimStripY);
  set("helvetica", "bold", 6.5, [100, 116, 139]);
  doc.text("SCORE BY DIMENSION", PW / 2, dimStripY + 8, { align: "center" });
  const colW = CW / 4;
  dims.forEach(({ label, score: ds }, i) => {
    const dx = M + colW * i + colW / 2;
    set("helvetica", "bold", 16, riskColor(ds));
    doc.text(`${ds}%`, dx, dimStripY + 20, { align: "center" });
    set("helvetica", "normal", 6.5, [148, 163, 184]);
    doc.text(label.toUpperCase(), dx, dimStripY + 27, { align: "center" });
  });

  set("helvetica", "normal", 6, [71, 85, 105]);
  doc.text("CONFIDENTIAL — GILL GTM PARTNERS", PW / 2, PH - 8, { align: "center" });

  // ════════════════════════════════════════════════════════════════════════════
  // PAGE 2 — SCORE OVERVIEW + DIMENSION BREAKDOWN
  // ════════════════════════════════════════════════════════════════════════════
  doc.addPage();
  drawPageHeader("SCORE OVERVIEW", 2);

  let y = 36;

  // Gauge
  const p2gX = PW / 2, p2gY = y + 35, p2gR = 30;
  drawGauge(p2gX, p2gY, p2gR, healthScore, 8);
  set("helvetica", "bold", 44, C.indigoDark);
  doc.text(`${healthScore}`, p2gX, p2gY + 8, { align: "center" });
  set("helvetica", "normal", 8, C.slate400);
  doc.text("HEALTH SCORE", p2gX, p2gY + 17, { align: "center" });
  riskBadge(p2gX, p2gY + p2gR + 6, healthScore, 8);
  y = p2gY + p2gR + 22;

  // Risk summary card
  doc.setFillColor(...C.slate50);
  const summaryLines = doc.splitTextToSize(riskSummary(healthScore), CW - 14);
  const summaryH = summaryLines.length * 5 + 14;
  doc.roundedRect(M, y, CW, summaryH, 2, 2, "F");
  doc.setFillColor(...riskColor(healthScore));
  doc.roundedRect(M, y, 4, summaryH, 1, 1, "F");
  set("helvetica", "bold", 8, C.indigoDark);
  doc.text("What this score means:", M + 8, y + 7);
  set("helvetica", "normal", 8, C.slate700);
  doc.text(summaryLines, M + 8, y + 13);
  y += summaryH + 10;

  // Dimension header
  doc.setDrawColor(...C.slate200); doc.setLineWidth(0.3);
  doc.line(M, y, PW - M, y);
  y += 7;
  set("helvetica", "bold", 10, C.indigoDark);
  doc.text("DIMENSION BREAKDOWN", M, y);
  y += 8;

  // 2×2 dimension cards
  const cW2 = (CW - 8) / 2, cH2 = 32;
  dims.forEach(({ label, sub, score: ds }, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const cx2 = M + col * (cW2 + 8), cy2 = y + row * (cH2 + 6);
    doc.setFillColor(...riskLight(ds)); doc.roundedRect(cx2, cy2, cW2, cH2, 2, 2, "F");
    doc.setFillColor(...riskColor(ds)); doc.roundedRect(cx2, cy2, 4, cH2, 1, 1, "F");
    set("helvetica", "bold", 22, C.indigoDark);
    doc.text(`${ds}%`, cx2 + cW2 - 6, cy2 + 16, { align: "right" });
    set("helvetica", "bold", 9, C.indigoDark);
    doc.text(label, cx2 + 8, cy2 + 10);
    set("helvetica", "normal", 7, C.slate600);
    doc.text(sub, cx2 + 8, cy2 + 17);
    const bX = cx2 + 8, bY = cy2 + 24, bW = cW2 - 16;
    doc.setFillColor(...C.white); doc.roundedRect(bX, bY, bW, 4, 1, 1, "F");
    doc.setFillColor(...riskColor(ds)); doc.roundedRect(bX, bY, Math.max(3, bW * ds / 100), 4, 1, 1, "F");
  });

  pageFooter();

  // ════════════════════════════════════════════════════════════════════════════
  // PAGE 3 — DIMENSION ANALYSIS
  // ════════════════════════════════════════════════════════════════════════════
  doc.addPage();
  drawPageHeader("DIMENSION ANALYSIS", 3);
  y = 34;

  set("helvetica", "normal", 8.5, C.slate600);
  const p3intro = doc.splitTextToSize(
    "The following breakdown examines each comp dimension individually, including the specific answers provided. Dimensions scoring below 70 represent priority areas for intervention.",
    CW
  );
  doc.text(p3intro, M, y);
  y += p3intro.length * 5 + 8;

  dims.forEach(({ label, sub, ids, score: ds }) => {
    if (y > PH - 50) {
      pageFooter();
      doc.addPage();
      drawPageHeader("DIMENSION ANALYSIS (CONT.)", 3);
      y = 34;
    }

    // Dimension header row
    const dimH = 14;
    doc.setFillColor(...C.slate50); doc.roundedRect(M, y, CW, dimH, 2, 2, "F");
    doc.setFillColor(...riskColor(ds)); doc.roundedRect(M, y, 4, dimH, 1, 1, "F");
    set("helvetica", "bold", 10, C.indigoDark);
    doc.text(label, M + 8, y + 9);
    set("helvetica", "normal", 8, C.slate600);
    doc.text(sub, M + 44, y + 9);
    set("helvetica", "bold", 12, riskColor(ds));
    doc.text(`${ds}%`, PW - M, y + 9.5, { align: "right" });
    y += dimH + 4;

    // Score bar
    doc.setFillColor(...C.slate200); doc.roundedRect(M, y, CW, 5, 2, 2, "F");
    doc.setFillColor(...riskColor(ds)); doc.roundedRect(M, y, Math.max(4, CW * ds / 100), 5, 2, 2, "F");
    y += 10;

    // Answered questions
    ids.filter((id) => answers[id]).forEach((id) => {
      const q = questions.find((q) => q.id === id);
      const ans = answers[id];
      if (!q || ans === undefined) return;
      const answerLabel = q.options[ans.idx]?.label ?? "";
      const riskFlag = ans.score >= 4 ? " — HIGH RISK" : ans.score >= 3 ? " — MODERATE" : "";

      set("helvetica", "bold", 7, C.slate500);
      const qLines = doc.splitTextToSize(q.shortLabel + ":", CW - 6);
      doc.text(qLines, M + 2, y);
      y += qLines.length * 4;

      set("helvetica", "normal", 7.5, ans.score >= 4 ? C.red : ans.score >= 3 ? C.amber : C.slate800);
      const aLines = doc.splitTextToSize(`${answerLabel}${riskFlag}`, CW - 8);
      doc.text(aLines, M + 4, y);
      y += aLines.length * 4.5 + 3;
    });

    y += 3;
    doc.setDrawColor(...C.slate200); doc.setLineWidth(0.2);
    doc.line(M, y - 2, PW - M, y - 2);
    y += 3;
  });

  pageFooter();

  // ════════════════════════════════════════════════════════════════════════════
  // PAGES 4-5 — PRIORITY RECOMMENDATIONS
  // ════════════════════════════════════════════════════════════════════════════
  doc.addPage();
  drawPageHeader("PRIORITY RECOMMENDATIONS", 4);
  y = 34;

  set("helvetica", "normal", 8.5, C.slate600);
  const recIntro = doc.splitTextToSize(
    `Based on your responses, ${displayName}, the following action items represent your highest-priority opportunities. Each finding is derived directly from your answers and reflects patterns identified across hundreds of growth-stage sales organizations.`,
    CW
  );
  doc.text(recIntro, M, y);
  y += recIntro.length * 5 + 8;

  let pageNum = 4;
  recs.forEach(({ area, finding, action }, i) => {
    const fl = doc.splitTextToSize(`Finding: ${finding}`, CW - 10);
    const al = doc.splitTextToSize(`Recommended Action: ${action}`, CW - 10);
    const cardH = fl.length * 4.5 + al.length * 5 + 18;

    if (y + cardH + 20 > PH - 20) {
      pageFooter();
      pageNum++;
      doc.addPage();
      drawPageHeader("PRIORITY RECOMMENDATIONS (CONT.)", pageNum);
      y = 34;
    }

    // Numbered circle
    doc.setFillColor(...C.indigo);
    doc.circle(M + 4.5, y + 4.5, 4.5, "F");
    set("helvetica", "bold", 8, C.white);
    doc.text(`${i + 1}`, M + 4.5, y + 6.5, { align: "center" });

    // Area title
    set("helvetica", "bold", 11, C.indigoDark);
    doc.text(area, M + 12, y + 6.5);
    y += 13;

    // Card
    doc.setFillColor(...C.slate50); doc.roundedRect(M, y, CW, cardH, 2, 2, "F");
    doc.setFillColor(...C.indigo); doc.roundedRect(M, y, 3, cardH, 1, 1, "F");

    set("helvetica", "bold", 8, C.slate500);
    doc.text(fl, M + 7, y + 7);
    y += fl.length * 4.5 + 9;

    set("helvetica", "normal", 8.5, C.slate800);
    doc.text(al, M + 7, y);
    y += al.length * 5 + 10;

    if (i < recs.length - 1) {
      doc.setDrawColor(...C.slate200); doc.setLineWidth(0.2);
      doc.line(M, y - 2, PW - M, y - 2);
    }
  });

  pageFooter();

  // ════════════════════════════════════════════════════════════════════════════
  // LAST PAGE — ABOUT & NEXT STEPS
  // ════════════════════════════════════════════════════════════════════════════
  doc.addPage();
  drawPageHeader("YOUR NEXT STEP", pageNum + 1);
  y = 34;

  // CTA box
  const ctaH = 42;
  doc.setFillColor(...C.indigoDark); doc.roundedRect(M, y, CW, ctaH, 3, 3, "F");
  // Indigo accent strip inside
  doc.setFillColor(...C.indigo); doc.roundedRect(M, y, CW, 16, 3, 3, "F");
  doc.rect(M, y + 10, CW, 6, "F"); // square off the bottom corners of accent strip
  set("helvetica", "bold", 12, C.white);
  doc.text("Ready to close these gaps in 6–8 weeks?", PW / 2, y + 11, { align: "center" });
  set("helvetica", "normal", 9, [199, 210, 254]);
  doc.text("Book a complimentary 45-minute strategy call with Kelly.", PW / 2, y + 24, { align: "center" });
  set("helvetica", "bold", 9.5, C.indigoLight);
  doc.text("contact@gillgtmpartners.com  |  gillgtmpartners.com", PW / 2, y + 35, { align: "center" });
  y += ctaH + 10;

  doc.setDrawColor(...C.slate200); doc.setLineWidth(0.3);
  doc.line(M, y, PW - M, y);
  y += 9;

  // About section
  set("helvetica", "bold", 11, C.indigoDark);
  doc.text("About Gill GTM Partners", M, y);
  y += 7;
  set("helvetica", "normal", 8.5, C.slate700);
  const about = doc.splitTextToSize(
    "Gill GTM Partners is a fractional sales compensation consultancy specializing in rebuilding comp infrastructure for growth-stage B2B companies — typically Series A through post-Series C — where the comp plan has been outpaced by headcount growth, a GTM pivot, or both.",
    CW
  );
  doc.text(about, M, y);
  y += about.length * 5 + 8;

  // Kelly bio
  set("helvetica", "bold", 10, C.indigoDark);
  doc.text("Kelly Gill-Braxton — Founder & Principal", M, y);
  y += 6;
  set("helvetica", "normal", 8.5, C.slate700);
  const bio = doc.splitTextToSize(
    "Kelly has built and rebuilt comp infrastructure for sales teams at Fivetran, Motive, Pure Storage, and Block. She focuses exclusively on companies scaling faster than their comp plan can handle — typically in the 15–150 rep range — where structural misalignment creates the highest leverage for improvement.",
    CW
  );
  doc.text(bio, M, y);
  y += bio.length * 5 + 8;

  doc.setDrawColor(...C.slate200); doc.setLineWidth(0.3);
  doc.line(M, y, PW - M, y);
  y += 9;

  // What we deliver
  set("helvetica", "bold", 10, C.indigoDark);
  doc.text("What a 6–8 week engagement delivers:", M, y);
  y += 7;

  const deliverables = [
    "A fully rebuilt comp plan aligned to your current GTM motion and rep profile",
    "OTE benchmarking against top-quartile competitors in your segment",
    "Quota methodology with clear rep-level calibration",
    "Accelerator design that drives measurable above-quota behavior",
    "Documentation package — plan letters, change logs, and rep sign-off process",
  ];

  deliverables.forEach((d) => {
    if (y > PH - 30) return;
    doc.setFillColor(...C.indigo);
    doc.circle(M + 2.5, y + 1.5, 2, "F");
    set("helvetica", "normal", 8.5, C.slate700);
    const dl = doc.splitTextToSize(d, CW - 10);
    doc.text(dl, M + 8, y + 3);
    y += dl.length * 5 + 2;
  });

  pageFooter();

  // ── Save ─────────────────────────────────────────────────────────────────
  const safeName = (name || "Report").replace(/[^a-zA-Z0-9 -]/g, "").replace(/\s+/g, "-");
  doc.save(filename ?? `Gill-GTM-Comp-Report-${safeName}.pdf`);
}
