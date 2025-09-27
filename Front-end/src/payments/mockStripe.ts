
import type { PaymentGateway, PaymentIntent } from './types'

// Mock Stripe-like gateway (replace with real SDK calls later)
export const mockStripe: PaymentGateway = {
  async createPaymentIntent(amount, currency): Promise<PaymentIntent> {
    await new Promise(r=>setTimeout(r, 400))
    return { id: 'pi_' + Math.random().toString(36).slice(2), amount, currency, clientSecret: 'secret_' + Math.random().toString(36).slice(2) }
  },
  async confirmPayment(intentId) {
    await new Promise(r=>setTimeout(r, 600))
    // Randomize success for demo purposes
    const ok = Math.random() > 0.1
    return ok ? { status: 'succeeded' } : { status: 'failed', error: 'Card declined (demo)' }
  }
}
