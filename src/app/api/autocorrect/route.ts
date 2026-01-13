
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

    // Check for API key before calling the flow
    if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
      console.error("[autocorrect] API key is missing");
      return NextResponse.json({ error: "Server configuration error: API key not set" }, { status: 500 });
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
