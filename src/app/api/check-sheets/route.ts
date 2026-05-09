import { google } from "googleapis";
import { NextResponse } from "next/server";

const SHEET_ID = process.env.GOOGLE_SHEET_ID || "1Kl52x5ORjU-7p4rgjPhqCxR4OrbxNOmEpBxFt41eHQ8";

export async function GET() {
  const status = {
    env: {
      GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL
        ? `set (${process.env.GOOGLE_CLIENT_EMAIL})`
        : "MISSING",
      GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY
        ? `set (length: ${process.env.GOOGLE_PRIVATE_KEY.length})`
        : "MISSING",
      GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID
        ? `set (${process.env.GOOGLE_SHEET_ID})`
        : `not set — using fallback: ${SHEET_ID}`,
    },
    sheetConnection: null as string | null,
    writeTest: null as string | null,
  };

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    // Test 1: can we read the sheet metadata?
    await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
    status.sheetConnection = "OK — sheet is accessible";

    // Test 2: try a real append
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Companies!A2",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [["[DIAGNOSTIC TEST]", "1", "", "", "", "", "", "diagnostic@test.com"]],
      },
    });
    status.writeTest = "OK — test row written successfully (you may delete the [DIAGNOSTIC TEST] row from the sheet)";
  } catch (err: any) {
    const msg = err?.message || String(err);
    if (!status.sheetConnection) {
      status.sheetConnection = `FAILED: ${msg}`;
    } else {
      status.writeTest = `FAILED: ${msg}`;
    }
  }

  return NextResponse.json(status, { status: 200 });
}
