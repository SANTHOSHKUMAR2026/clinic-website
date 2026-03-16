import { NextResponse } from "next/server";

export async function POST(req: Request) {

  try {

    const data = await req.json();

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbyUkiihvIcfIKAxshFeTbOgfxD7SXlBx6Ul1GM04LOC0JINOMVn9HJ7-w_zN4jWLO2E/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );

    const result = await response.text();

    return NextResponse.json({ success: true, result });

  } catch (error) {

    return NextResponse.json({
      success: false,
      error: "Google Sheet logging failed"
    });

  }

}