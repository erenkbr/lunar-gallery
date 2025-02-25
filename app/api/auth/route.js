import { NextResponse } from 'next/server';
import { z } from 'zod';

const emailSchema = z.string().email("Invalid email address");

function checkRequiredEnvVars() {
  const required = [
    'MODHAUS_BASE_URL',
    'RAMPER_BASE_URL',
    'RAMPER_APP_ID',
  ];
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required environment variables: ${missing.join(', ')}` },
      { status: 500 }
    );
  }
  return null;
}

export async function GET(request) {
  try {
    const envError = checkRequiredEnvVars();
    if (envError) return envError;

    const { searchParams } = new URL(request.url);
    const emailResult = emailSchema.safeParse(searchParams.get('email'));

    if (!emailResult.success) {
      return NextResponse.json({ error: "Invalid or missing email", details: emailResult.error.message }, { status: 400 });
    }
    const email = emailResult.data;

    const transactionId = crypto.randomUUID();
    const now = new Date().toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    const response = await fetch(`${process.env.MODHAUS_BASE_URL}/api/verify/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': process.env.MODHAUS_BASE_URL,
        'Referer': `${process.env.MODHAUS_BASE_URL}/`,
      },
      body: JSON.stringify({
        appId: process.env.RAMPER_APP_ID,
        email,
        time: now,
        transactionId,
        lang: "en",
        redirectSource: `${process.env.MODHAUS_BASE_URL}/`,
        isForceDefault: false,
        host: process.env.RAMPER_BASE_URL,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Email verification service unavailable" }, { status: 503 });
    }

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json({ error: data.data?.error || "Failed to send email" }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      pendingToken: data.data.pendingToken,
      transactionId,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const envError = checkRequiredEnvVars();
    if (envError) return envError;

    const bodySchema = z.object({
      transactionId: z.string().uuid("Invalid transaction ID"),
      pendingToken: z.string().min(1, "Pending token is required"),
    });
    const body = await request.json();
    const { transactionId, pendingToken } = bodySchema.parse(body);

    const response = await fetch(`${process.env.RAMPER_BASE_URL}/exchangeToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': process.env.MODHAUS_BASE_URL,
        'Referer': `${process.env.MODHAUS_BASE_URL}/`,
      },
      body: JSON.stringify({
        appId: process.env.RAMPER_APP_ID,
        transactionId,
        pendingToken,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Token exchange service unavailable" }, { status: 503 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request body", details: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error", details: error.message }, { status: 500 });
  }
}