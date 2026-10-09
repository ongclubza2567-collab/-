'use strict';

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;
const PUBLIC_DIR = path.join(__dirname, 'public');

app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

// Health-check endpoint: confirms that the server/API is running.
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'REDNOX API starter',
    payments: 'not_configured',
    database: 'not_configured'
  });
});

// Only non-secret public shop information belongs here.
app.get('/api/public-config', (req, res) => {
  res.json({
    shopName: process.env.PUBLIC_SHOP_NAME || 'REDNOX',
    shopDescription: process.env.PUBLIC_SHOP_DESCRIPTION || 'ร้านดิจิทัล REDNOX'
  });
});

// Payment routes are deliberately not implemented until the official
// provider contract, webhook authentication, and event format are available.
app.all('/api/payments/*', (req, res) => {
  res.status(503).json({
    ok: false,
    error: 'Payment API is not configured. Do not use this endpoint to accept real payments.'
  });
});

app.use(express.static(PUBLIC_DIR, { extensions: ['html'] }));
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ ok: false, error: 'API route not found' });
  }
  return res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`REDNOX starter server listening on port ${PORT}`);
});
