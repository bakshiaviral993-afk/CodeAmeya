
// src/app/api/generate-code/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateCode } from '@/ai/flows/code-generation-from-prompt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, language } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Await the result from the wrapper function
    const result = await generateCode({ prompt, language });
    
    // The result is already in the correct { code: '...' } format.
    // Return it directly.
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Error in generate-code API route:', error);
    return NextResponse.json(
        { error: error.message || 'An unknown error occurred in the API route.' }, 
        { status: 500 }
    );
  }
}
