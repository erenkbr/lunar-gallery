import { NextResponse } from "next/server";

const COSMO_LOGIN_URL = `${process.env.COSMO_BASE_URL}/auth/v1/signin`;

export async function POST(request) {
  try {
    const { idToken, email } = await request.json();

    if (!idToken || !email) {
      return NextResponse.json({ error: "idToken and email are required" }, { status: 400 });
    }

    const cosmoResponse = await fetch(COSMO_LOGIN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel: "email",
        email,
        accessToken: idToken,
      }),
    });

    const cosmoData = await cosmoResponse.json();

    if (!cosmoResponse.ok) {
      throw new Error(cosmoData.error || "Failed to log into Cosmo");
    }

    return NextResponse.json({ success: true, cosmoData });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
