/**
 * Simple CORS Proxy Server
 * 
 * This is a simple Node.js server that acts as a proxy to bypass CORS restrictions
 * when fetching data from external APIs in the browser.
 * 
 * Usage:
 * 1. Run: node cors-proxy.js
 * 2. The server will start on http://localhost:3001
 * 3. In the demo, set Data Endpoint URL to: http://localhost:3001/proxy?url=YOUR_API_URL
 * 
 * Example:
 * http://localhost:3001/proxy?url=https://api.marketstack.com/v1/eod?symbols=AAPL&access_key=YOUR_KEY
 */

const http = require('http');
const https = require('https');
const url = require('url');

const PORT = 3001;

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Parse the request URL
  const parsedUrl = url.parse(req.url, true);

  // Only handle /proxy endpoint
  if (parsedUrl.pathname !== '/proxy') {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found. Use /proxy?url=YOUR_API_URL' }));
    return;
  }

  // Get the target URL from query parameter
  const targetUrl = parsedUrl.query.url;

  if (!targetUrl) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Missing url parameter. Use /proxy?url=YOUR_API_URL' }));
    return;
  }

  console.log(`Proxying request to: ${targetUrl}`);

  // Determine which module to use (http or https)
  const protocol = targetUrl.startsWith('https') ? https : http;

  // Make the request to the target URL
  protocol.get(targetUrl, (apiRes) => {
    let data = '';

    // Collect data chunks
    apiRes.on('data', (chunk) => {
      data += chunk;
    });

    // Send response when complete
    apiRes.on('end', () => {
      res.writeHead(apiRes.statusCode, {
        'Content-Type': apiRes.headers['content-type'] || 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(data);
    });
  }).on('error', (err) => {
    console.error('Proxy error:', err.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Proxy error: ' + err.message }));
  });
});

server.listen(PORT, () => {
  console.log(`\n🚀 CORS Proxy Server running on http://localhost:${PORT}`);
  console.log(`\nUsage:`);
  console.log(`  http://localhost:${PORT}/proxy?url=YOUR_API_URL`);
  console.log(`\nExample:`);
  console.log(`  http://localhost:${PORT}/proxy?url=https://api.marketstack.com/v1/eod?symbols=AAPL&access_key=YOUR_KEY`);
  console.log(`\nPress Ctrl+C to stop\n`);
});

