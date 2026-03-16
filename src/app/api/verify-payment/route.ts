import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,

      // 👇 ADD THESE (patient details sent from frontend)
      name,
      mobile,
      date,
      time,
      token

    } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET!;

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {

      // ✅ PAYMENT VERIFIED

      // 👇 SEND SMS AFTER PAYMENT SUCCESS
      await fetch("http://localhost:3000/api/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: name,
          mobile: mobile,
          date: date,
          time: time,
          token: token
        })
      });

      return NextResponse.json({
        success: true
      });

    } else {

      return NextResponse.json({
        success: false
      });

    }

  } catch (error) {

    return NextResponse.json({
      success: false,
      message: "Verification failed"
    });

  }

}