
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
    
    // Check for API key before calling the flow
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
      console.error("[generate-code] API key is missing");
      return NextResponse.json({ error: "Server configuration error: API key not set" }, { status: 500 });
    }

    const result = await generateCode({ prompt, language });
    
    return NextResponse.json(result);
    
  } catch (error: any) {
    console.error('Error in generate-code API route:', error);
    return NextResponse.json(
        { error: error.message || 'An unknown error occurred in the API route.' }, 
        { status: 500 }
    );
  }
}
