
import type { PaymentGateway, PaymentIntent } from './types'

// Mock PayPal-like gateway
export const mockPaypal: PaymentGateway = {
  async createPaymentIntent(amount, currency): Promise<PaymentIntent> {
    await new Promise(r=>setTimeout(r, 300))
    return { id: 'pp_' + Math.random().toString(36).slice(2), amount, currency }
  },
  async confirmPayment() {
    await new Promise(r=>setTimeout(r, 500))
    return { status: 'succeeded' }
  }
}
