
// src/app/api/autocorrect/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => {
      throw new Error("Invalid JSON body");
    });
    
    const { code, language } = body;

    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      console.error("[autocorrect] API key is missing");
      return NextResponse.json({ error: "Server configuration error: API key not set" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const fullPrompt = `You are an AI code assistant. Correct the following ${language} code snippet. Return only the corrected code, without any explanations or markdown fences.\n\nCode:\n${code}`;

    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const correctedCode = response.text().trim();

    return NextResponse.json({ correctedCode });

  } catch (error: any) {
    console.error('[autocorrect] Error:', {
      message: error.message,
      stack: error.stack,
    });
    return NextResponse.json(
      { error: error.message || 'An unknown error occurred in the API route.' },
      { status: 500 }
    );
  }
}
