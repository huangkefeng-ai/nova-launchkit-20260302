import { createHmac, timingSafeEqual } from 'node:crypto'

type SignatureFailureReason = 'MISSING_SIGNATURE' | 'MISSING_SECRET' | 'MISMATCH'

export type CreemSignatureVerificationResult =
  | { isValid: true }
  | { isValid: false; reason: SignatureFailureReason }

function normalizeSignature(signature: string) {
  const trimmed = signature.trim()
  return trimmed.startsWith('sha256=') ? trimmed.slice('sha256='.length) : trimmed
}

// Stub verifier: update to Creem's exact canonical signing format once finalized.
export function verifyCreemSignatureStub(
  rawBody: string,
  signatureHeader: string | null,
): CreemSignatureVerificationResult {
  if (!signatureHeader) {
    return { isValid: false, reason: 'MISSING_SIGNATURE' }
  }

  const webhookSecret = process.env.CREEM_WEBHOOK_SECRET
  if (!webhookSecret) {
    return { isValid: false, reason: 'MISSING_SECRET' }
  }

  const expected = createHmac('sha256', webhookSecret).update(rawBody).digest('hex')
  const provided = normalizeSignature(signatureHeader)

  const expectedBuffer = Buffer.from(expected)
  const providedBuffer = Buffer.from(provided)

  if (expectedBuffer.length !== providedBuffer.length) {
    return { isValid: false, reason: 'MISMATCH' }
  }

  if (!timingSafeEqual(expectedBuffer, providedBuffer)) {
    return { isValid: false, reason: 'MISMATCH' }
  }

  return { isValid: true }
}
