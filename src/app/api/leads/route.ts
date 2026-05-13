import { google } from "googleapis";
import { NextResponse } from "next/server";
import { calculateFitScore } from "@/lib/scoring";
import nodemailer from "nodemailer";

const SHEET_ID = process.env.GOOGLE_SHEET_ID || "1Kl52x5ORjU-7p4rgjPhqCxR4OrbxNOmEpBxFt41eHQ8";
const TAB = "Companies";

async function getSheetsInstance() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

async function sendLeadEmail(name: string, email: string, stage: string) {
  const GMAIL_USER = process.env.GMAIL_USER;
  const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: GMAIL_USER, pass: GMAIL_APP_PASSWORD },
    tls: { rejectUnauthorized: false },
  });

  await transporter.sendMail({
    from: `"Gill GTM Partners" <${GMAIL_USER}>`,
    to: GMAIL_USER,
    subject: `New Diagnostic Lead: ${name}`,
    text: [
      `Name:  ${name}`,
      `Email: ${email}`,
      `Stage: ${stage}`,
      `Time:  ${new Date().toISOString()}`,
      "",
      "Note: Google Sheets was unavailable — lead captured via email only.",
    ].join("\n"),
  });
}

// Sheet column layout:
// A(0) Company Name | B(1) Stage | C(2) Funding Stage | D(3) Headcount
// E(4) LinkedIn URL | F(5) Head of RevOps (Y/N) | G(6) Head of Sales (Y/N) | H(7) Email

export async function GET() {
  try {
    const sheets = await getSheetsInstance();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${TAB}!A2:H200`,
    });

    const rows = response.data.values;
    if (!rows) return NextResponse.json([]);

    const leads = rows
      .filter((row) => row[0])
      .map((row, index) => {
        const employeeCount = parseInt((row[3] || "0").replace(/\D/g, "") || "0");
        const leadBase = {
          id: index.toString(),
          name: row[0] || "",
          stage: row[2] || "",
          leadStage: row[1] || "",
          headcount: row[3] || "",
          url: row[4] || "",
          email: row[7] || "",
          employeeCount,
          salesRepCount: 0,
          missingRevOps: row[5] === "N" || row[5] === "",
          leadershipHiredLastYear: false,
          status: "active",
        };
        return { ...leadBase, fit: calculateFitScore(leadBase) };
      });

    return NextResponse.json(leads);
  } catch (error: any) {
    console.error("Sheets GET error:", error?.message);
    return NextResponse.json([]);
  }
}

// Diagnostic form submission — tries Sheets first, falls back to email
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const name  = body.name  || "";
  const email = body.email || "";
  const stage = body.stage || "1";

  // Try Google Sheets — never let a failure block the user
  try {
    const hasSheetsCreds = process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY;
    if (hasSheetsCreds) {
      const sheets = await getSheetsInstance();
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: `${TAB}!A2`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[name, stage, "", "", "", "", "", email]],
        },
      });
    } else {
      console.warn("Google Sheets credentials not configured — falling back to email.");
      await sendLeadEmail(name, email, stage);
    }
  } catch (error: any) {
    console.error("Sheets POST error:", error?.message, "— attempting email fallback.");
    try {
      await sendLeadEmail(name, email, stage);
    } catch (emailErr: any) {
      console.error("Email fallback also failed:", emailErr?.message);
    }
  }

  // Always return success so users are never blocked from seeing their results
  return NextResponse.json({ success: true });
}
