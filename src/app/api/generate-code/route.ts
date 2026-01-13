
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

    const result = await generateCode({ prompt, language });
    
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API] Error in /api/generate-code:', err);
    return NextResponse.json(
      { error: err.message || 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
