
import { NextRequest, NextResponse } from "next/server"

// Signup is disabled - use predefined test accounts
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { message: "Signup is disabled. Use predefined test accounts from the login page." },
    { status: 200 }
  )
}
