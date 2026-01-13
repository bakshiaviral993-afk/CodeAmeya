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
