interface PaystackOptions {
  key: string;
  email: string;
  amount: number; // in Naira
  currency?: string;
  reference?: string;
  metadata?: Record<string, any>;
  onSuccess: (reference: string) => void;
  onCancel: () => void;
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: any) => {
        openIframe: () => void;
      };
    };
  }
}

export async function loadPaystackScript(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  if (window.PaystackPop) return true;

  return new Promise((resolve) => {
    const existing = document.getElementById('paystack-inline-js');
    if (existing) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'paystack-inline-js';
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Paystack inline script could not be loaded directly from CDN. Falling back to built-in secure checkout bridge.');
      resolve(false);
    };
    document.body.appendChild(script);
  });
}

export function generatePaystackReference(): string {
  const ts = Date.now().toString(36);
  const rnd = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `UW-PSTK-${ts}-${rnd}`;
}
