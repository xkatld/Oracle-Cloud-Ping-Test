import dns from 'dns';
import { promisify } from 'util';
import fetch from 'node-fetch';

const lookup = promisify(dns.lookup);

async function pingDomain(domain) {
  const start = Date.now();
  await fetch(`http://${domain}`, { method: 'HEAD', timeout: 5000 }).catch(() => {});
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
