import fetch from 'node-fetch';
import { VercelRequest, VercelResponse } from '../../global';

/**
 * Proxy handler to forward requests and add CORS headers.
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  const { target } = req.query;

  // Ensure a target URL is provided
  if (!target || typeof target !== 'string') {
    res.status(400).json({ error: 'Missing or invalid target URL' });
    return;
  }

  try {
    // Add CORS headers to the response
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Fetch data from the target URL
    const response = await fetch(target);
    const contentType = response.headers.get('content-type');

    // Set the response content type
    res.setHeader('Content-Type', contentType || 'application/json');
    const data = await response.text();

    // Send the data back to the client
    res.status(200).end(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).json({ error: 'Failed to fetch target URL' });
  }
}
