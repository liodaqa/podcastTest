import { IncomingMessage, ServerResponse } from 'http';
import fetch from 'node-fetch';

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const target = url.searchParams.get('target');

  if (!target) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Missing target URL' }));
    return;
  }

  try {
    const response = await fetch(target);
    const contentType =
      response.headers.get('content-type') || 'application/json';
    const data = await response.text();

    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
      res.statusCode = 204;
      res.end();
      return;
    }

    // Return the fetched data
    res.statusCode = 200;
    res.setHeader('Content-Type', contentType);
    res.end(data);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Failed to fetch target URL' }));
  }
}
