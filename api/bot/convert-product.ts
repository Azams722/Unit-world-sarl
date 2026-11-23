import { convertInputToProduct } from '../../server/productBot.ts';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const draft = await convertInputToProduct(body);
    return res.status(200).json({ productDraft: draft });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to convert product.';
    const status = message.includes('Please upload at least one image') ? 400 : 500;
    return res.status(status).json({ error: message });
  }
}
