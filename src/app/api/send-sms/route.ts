import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {

  const { name, mobile, date, time, token } = await req.json();

  try {

    const response = await axios.post(
      "https://control.msg91.com/api/v5/flow/",
      {
        template_id: process.env.MSG91_TEMPLATE_ID,
        short_url: "0",
        recipients: [
          {
            mobiles: "91" + mobile,
            name: name,
            date: date,
            time: time,
            token: token
          }
        ]
      },
      {
        headers: {
          authkey: process.env.MSG91_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("SMS sent:", response.data);

    return NextResponse.json({ success: true });

  } catch (error) {

    console.error("SMS error:", error);

    return NextResponse.json({ success: false });

  }

}