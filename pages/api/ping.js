// /api/ping.js
import dns from 'dns';
import { promisify } from 'util';
import ping from 'ping';

const lookup = promisify(dns.lookup);

async function pingDomain(domain) {
  const result = await ping.promise.probe(domain, {
    timeout: 10,
    extra: ['-c', '3'],
  });
  return result.avg;
}

export default async function handler(req, res) {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  try {
    const { address } = await lookup(domain);
    const latency = await pingDomain(domain);
    
    // 获取 IP 地理位置信息
    const ipApiResponse = await fetch(`http://ip-api.com/json/${address}`);
    const ipData = await ipApiResponse.json();

    res.status(200).json({
      ip: address,
      latency: latency || 'N/A',
      ...ipData,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve domain or fetch data' });
  }
}
