// app/api/login/route.js
import { NextResponse } from "next/server";
import { z } from "zod";

const loginSchema = z.object({
  idToken: z.string().min(1, "ID token is required"),
  email: z.string().email("Invalid email address"),
});

export async function POST(request) {
  try {
    if (!process.env.COSMO_BASE_URL) {
      return NextResponse.json({ error: "Missing COSMO_BASE_URL environment variable" }, { status: 500 });
    }

    const body = await request.json();
    const { idToken, email } = loginSchema.parse(body);

    const response = await fetch(`${process.env.COSMO_BASE_URL}/auth/v1/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: "email",
        email,
        accessToken: idToken,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.error || "Cosmo login service unavailable" }, { status: 503 });
    }

    const cosmoData = await response.json();
    return NextResponse.json({ success: true, cosmoData });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request body", details: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}