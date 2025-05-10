import { NextResponse } from 'next/server';

export async function POST() {
  const response = await fetch('https://api.ultravox.ai/api/calls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.ULTRAVOX_API_KEY!,
    },
    body: JSON.stringify({
      model: 'fixie-ai/ultravox',
      systemPrompt: 'You are a helpful assistant.',
      voice: 'default',
    }),
  });

  const data = await response.json();
  return NextResponse.json({ joinUrl: data.joinUrl });
}
