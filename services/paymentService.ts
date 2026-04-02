// eFaas Payment Service — Interface only.
// Replace mock with real eFaas API integration before production.

export interface InitiatePaymentResult {
  paymentUrl: string;
  paymentId: string;
}

export interface VerifyPaymentResult {
  status: 'confirmed' | 'pending' | 'failed';
  transactionId?: string;
}

export async function initiatePayment(
  bookingRef: string,
  amount: number
): Promise<InitiatePaymentResult> {
  // TODO: POST to eFaas payment gateway API
  // Returns a URL to open in browser/WebView
  return {
    paymentId: `pay-${Date.now()}`,
    paymentUrl: `https://efaas.gov.mv/pay?ref=${bookingRef}&amount=${amount}&currency=MVR`,
  };
}

export async function verifyPayment(paymentId: string): Promise<VerifyPaymentResult> {
  // TODO: GET eFaas payment status endpoint
  // In production: poll or use webhook callback registered with eFaas
  return { status: 'confirmed', transactionId: `TXN-${Date.now()}` };
}
