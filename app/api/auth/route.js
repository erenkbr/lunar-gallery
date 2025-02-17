import { NextResponse } from 'next/server';

const BASE_URL = process.env.MODHAUS_BASE_URL;
const HOST = process.env.RAMPER_BASE_URL

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

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

    const response = await fetch(`${BASE_URL}/api/verify/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': BASE_URL,
        'Referer': BASE_URL + '/',
      },
      body: JSON.stringify({
        appId: process.env.RAMPER_APP_ID,
        email,
        time: now,
        transactionId,
        lang: "en",
        redirectSource: BASE_URL + "/",
        isForceDefault: false,
        host: process.env.RAMPER_BASE_URL,
      })
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.data?.error || 'Failed to send email');
    }

    return NextResponse.json({
      success: true,
      pendingToken: data.data.pendingToken,
      transactionId
    });

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { transactionId, pendingToken } = await request.json();

    const response = await fetch(`${HOST}/exchangeToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': BASE_URL,
        'Referer': BASE_URL + '/',
      },
      body: JSON.stringify({
        appId: process.env.RAMPER_APP_ID,
        transactionId,
        pendingToken
      })
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}