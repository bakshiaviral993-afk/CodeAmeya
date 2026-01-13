
import { NextRequest, NextResponse } from 'next/server';
import { autoCorrectCode } from '@/ai/flows/code-autocorrection';

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    const result = await autoCorrectCode({ code, language });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[API] Error in /api/autocorrect:', err);
    return NextResponse.json(
      { error: err.message || 'An internal server error occurred.' },
      { status: 500 }
    );
  }
}
