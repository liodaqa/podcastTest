import fetch from 'node-fetch';
import { VercelRequest, VercelResponse } from '../../global';

/**
 * Proxy handler to bypass CORS issues by forwarding requests.
 * @param req - The incoming request object.
 * @param res - The outgoing response object.
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  const { target } = req.query;

  if (!target || typeof target !== 'string') {
    res.status(400).json({ error: 'Missing or invalid target URL' });
    return;
  }

  try {
    const response = await fetch(target);
    const contentType = response.headers.get('content-type');

    res.setHeader('Content-Type', contentType || 'application/json');
    const data = await response.text();
    res.status(200).end(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Failed to fetch target URL' });
  }
}
