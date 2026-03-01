import { NextResponse } from 'next/server'

export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'INVALID_INPUT'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'INTERNAL_ERROR'

export function apiError(status: number, errorCode: ApiErrorCode, message: string, requestId: string) {
  return NextResponse.json(
    { errorCode, message, requestId },
    { status }
  )
}
