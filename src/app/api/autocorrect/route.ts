
// src/app/api/autocorrect/route.ts
import {NextRequest, NextResponse} from 'next/server';
import {autoCorrectCode} from '@/ai/flows/code-autocorrection';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {code, language} = body;

    if (!code || !language) {
      return NextResponse.json(
        {error: 'Code and language are required'},
        {status: 400}
      );
    }
    
    // Await the result from the wrapper function
    const result = await autoCorrectCode({code, language});
    
    // The result is already in the correct { correctedCode: '...' } format.
    // Return it directly.
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in autocorrect API route:', error);
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred in the API route.' },
      { status: 500 }
    );
  }
}
