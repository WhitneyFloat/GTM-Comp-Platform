import { google } from "googleapis";
import { NextResponse } from "next/server";
import { calculateFitScore } from "@/lib/scoring";

const SHEET_ID = process.env.GOOGLE_SHEET_ID || "1Kl52x5ORjU-7p4rgjPhqCxR4OrbxNOmEpBxFt41eHQ8";

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

export async function GET() {
  try {
    const sheets = await getSheetsInstance();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "Leads!A2:H100", // Assuming First row is header
    });

    const rows = response.data.values;
    if (!rows) return NextResponse.json([]);

    const leads = rows.map((row) => {
      const leadBase = {
        id: row[0],
        name: row[1],
        email: row[2],
        stage: row[3],
        headcount: row[4],
        fit: parseInt(row[5] || "0"),
        url: row[6],
        status: row[7] || "active",
        // New ICP fields if available in sheet columns I, J, K
        employeeCount: parseInt(row[4]?.replace(/\D/g, "") || "0"),
        salesRepCount: parseInt(row[8] || "0"),
        missingRevOps: row[9] === "TRUE",
        leadershipHiredLastYear: row[10] === "TRUE",
      };

      return {
        ...leadBase,
        // Override static fit score with dynamic calculation
        fit: calculateFitScore(leadBase),
      };
    });

    return NextResponse.json(leads);
  } catch (error: any) {
    console.error("Fetch Error:", error);
    // Fallback to empty if not configured yet
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const sheets = await getSheetsInstance();

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Leads!A2",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          Date.now().toString(),
          body.name,
          body.email,
          body.stage || "N/A",
          body.headcount || "N/A",
          body.score || 0,
          "N/A",
          "active"
        ]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Post Error:", error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}
