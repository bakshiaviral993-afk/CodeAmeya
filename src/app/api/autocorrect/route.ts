
// src/app/api/autocorrect/route.ts
import {NextRequest, NextResponse} from 'next/server';
import {autoCorrectCode} from '@/ai/flows/code-autocorrection';

export async function POST(req: NextRequest) {
  try {
    const {code, language} = await req.json();

    if (!code || !language) {
      return NextResponse.json(
        {error: 'Code and language are required'},
        {status: 400}
      );
    }

    const result = await autoCorrectCode({code, language});

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in autocorrect API route:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred in the API route.' },
      { status: 500 }
    );
  }
}
