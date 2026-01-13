
// src/app/api/generate-code/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => {
      throw new Error("Invalid JSON body");
    });
    
    const { prompt, language } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }
    
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("[generate-code] API key is missing");
      return NextResponse.json({ error: "Server configuration error: API key not set" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const fullPrompt = `Generate clean ${language || 'code'} for the following prompt:\n\n${prompt}\n\nReturn only the code block, without any explanations or markdown fences.`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const code = response.text().trim();
    
    return NextResponse.json({ code });
    
  } catch (error: any) {
    console.error('Error in generate-code API route:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
        { error: error.message || 'An unknown error occurred in the API route.' }, 
        { status: 500 }
    );
  }
}
