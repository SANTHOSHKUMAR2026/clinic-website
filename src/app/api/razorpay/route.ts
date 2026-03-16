import Razorpay from "razorpay";

export async function POST(req: Request) {

  try {
    const body = await req.json().catch(() => ({}));
    const amount = body.amount || 100000;

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await razorpay.orders.create({
      amount: amount, // Dynamic amount
      currency: "INR",
      receipt: "appointment_receipt",
    });

    return Response.json(order);

  } catch (error) {

    return Response.json(
      { error: "Payment order creation failed" },
      { status: 500 }
    );

  }

}