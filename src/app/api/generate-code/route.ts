// src/app/api/generate-code/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateCode } from '@/ai/flows/code-generation-from-prompt';

export async function POST(req: NextRequest) {
  try {
    const { prompt, language } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // The flow returns an object with a `code` property.
    // We need to call it and then send that property back to the client.
    const result = await generateCode({ prompt, language });

    return NextResponse.json({ code: result.code });
  } catch (error) {
    console.error('Error in generate-code API:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
