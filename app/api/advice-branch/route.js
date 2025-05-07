import { NextResponse } from "next/server";

export async function POST(request) {
  const { name, province, post_code } = await request.json();
  try {
    const res = await fetch(
      "https://globalapi.advice.co.th/api/getAdviceBranch",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer advice-api-11100058fe",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, province, post_code }),
      }
    );
    if (!res.ok) {
      throw new Error(`External API error: ${res.status}`);
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
