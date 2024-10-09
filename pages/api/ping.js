import dns from 'dns';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);

export default async function handler(req, res) {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  try {
    const { address } = await lookup(domain);
    res.status(200).json({ ip: address });
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve domain' });
  }
}
