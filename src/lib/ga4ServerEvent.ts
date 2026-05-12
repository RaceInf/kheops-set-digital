const MEASUREMENT_ID = 'G-N0Z2W2LHSZ';
const API_SECRET = 'gQ3I2v0jRNOhRO0vkOf6';

export async function sendGA4ServerEvent({
  eventName,
  clientId,
  params = {}
}: {
  eventName: string;
  clientId?: string;
  params?: Record<string, any>;
}) {
  try {
    await fetch('/api/ga4/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        clientId,
        params,
      }),
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('GA4 server-side fetch error:', err);
  }
} 