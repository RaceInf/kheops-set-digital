const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const MEASUREMENT_ID = 'G-N0Z2W2LHSZ';
const API_SECRET = 'gQ3I2v0jRNOhRO0vkOf6';

router.post('/event', async (req, res) => {
  const { eventName, clientId, params } = req.body;
  const cid = clientId || `${Date.now()}.${Math.floor(Math.random() * 100000)}`;
  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`;
  const body = {
    client_id: cid,
    events: [
      {
        name: eventName,
        params: params || {},
      },
    ],
  };
  try {
    const gaRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!gaRes.ok) {
      return res.status(500).json({ error: await gaRes.text() });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 