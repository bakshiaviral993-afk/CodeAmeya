
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

    // Await the result from the flow
    const result = await generateCode({ prompt, language });
    
    // The flow returns { code: '...' }, which is what the frontend expects.
    // So we can return the result directly.
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Error in generate-code API route:', error);
    return NextResponse.json(
        { error: error.message || 'An unknown error occurred in the API route.' }, 
        { status: 500 }
    );
  }
}
