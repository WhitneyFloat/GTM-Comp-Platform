import { google } from "googleapis";
import { NextResponse } from "next/server";
import { calculateFitScore } from "@/lib/scoring";

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

// Sheet column layout (row index → column):
// A(0) Company Name | B(1) Stage | C(2) Funding Stage | D(3) Headcount
// E(4) LinkedIn URL | F(5) Head of RevOps (Y/N) | G(6) Head of Sales (Y/N) | H(7) Company or Contact Notes

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
      .filter((row) => row[0]) // skip empty rows
      .map((row, index) => {
        const employeeCount = parseInt((row[3] || "0").replace(/\D/g, "") || "0");
        const leadBase = {
          id: index.toString(),
          name: row[0] || "",
          stage: row[2] || "",          // Funding Stage (col C) drives ICP scoring
          leadStage: row[1] || "",       // Pipeline Stage (col B)
          headcount: row[3] || "",
          url: row[4] || "",
          email: row[7] || "",           // Company or Contact Notes (col H)
          employeeCount,
          salesRepCount: 0,
          missingRevOps: row[5] === "N" || row[5] === "",
          leadershipHiredLastYear: false,
          status: "active",
        };

        return {
          ...leadBase,
          fit: calculateFitScore(leadBase),
        };
      });

    return NextResponse.json(leads);
  } catch (error: any) {
    console.error("Fetch Error:", error);
    return NextResponse.json([]);
  }
}

// Scorecard form submission → appends a new row to the Companies tab
// A: Contact/Company Name | B: Stage = "1" | C-G: blank | H: Email
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sheets = await getSheetsInstance();

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: `${TAB}!A2`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          body.name  || "",   // A: Company Name
          body.stage || "1",  // B: Stage (pipeline stage — defaults to "1")
          "",                 // C: Funding Stage
          "",                 // D: Headcount
          "",                 // E: LinkedIn URL
          "",                 // F: Head of RevOps
          "",                 // G: Head of Sales
          body.email || "",   // H: Company or Contact Notes (email)
        ]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Post Error:", error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}
