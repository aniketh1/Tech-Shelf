import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  // In App Router, we can't directly access the server instance like in Pages Router
  // This is causing the settings page to not render properly
  // For now, return a success response to prevent blocking the UI rendering
  return NextResponse.json({ message: 'Socket functionality is not available in App Router' })
}