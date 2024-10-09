import dns from 'dns';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);

async function pingDomain(domain) {
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  const start = Date.now();
  try {
    await fetch(`http://${domain}`, { 
      method: 'HEAD', 
      signal: controller.signal 
    });
  } catch (error) {
    // Ignore errors, we just want to measure time
  } finally {
    clearTimeout(timeout);
  }
  return Date.now() - start;
}

export default async function handler(req, res) {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  try {
    const { address } = await lookup(domain);
    const latency = await pingDomain(domain);
    
    const ipApiResponse = await fetch(`http://ip-api.com/json/${address}`);
    const ipData = await ipApiResponse.json();

    res.status(200).json({
      ip: address,
      latency,
      ...ipData
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve domain or fetch IP data' });
  }
}
