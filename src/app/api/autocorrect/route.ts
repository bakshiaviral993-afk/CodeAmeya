<<<<<<< HEAD
// This file is no longer used.
// The AI logic has been moved to the background script (background.js) of the Chrome extension.
// API calls are now made directly from the service worker to the AI providers.

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'This API endpoint is deprecated. Use the extension background script.' },
    { status: 410 } // 410 Gone
  );
}
=======
// src/app/api/autocorrect/route.ts
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
    } catch (error) {
        console.error('Error in autocorrect API:', error);
        const errorMessage =
            error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
>>>>>>> 08b3516ea8c649efca777308826f761e31fa67bf
