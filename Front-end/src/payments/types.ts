
export type PaymentMethod = 'stripe' | 'paypal' | 'cod'

export type PaymentIntent = {
  id: string
  amount: number
  currency: string
  clientSecret?: string
}

export interface PaymentGateway {
  createPaymentIntent(amount: number, currency: string): Promise<PaymentIntent>
  confirmPayment(intentId: string, payload?: Record<string, unknown>): Promise<{ status: 'succeeded'|'failed', error?: string }>
}
