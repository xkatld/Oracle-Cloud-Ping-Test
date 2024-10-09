import dns from 'dns';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);

export default async function handler(req, res) {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  try {
    // 解析域名以获取 IP 地址
    const { address } = await lookup(domain);

    // 使用 IP 地址获取地理位置和 ISP 信息
    const ipApiResponse = await fetch(`http://ip-api.com/json/${address}`);
    const ipData = await ipApiResponse.json();

    res.status(200).json({
      ip: address,
      ...ipData // 直接返回从 IP API 获取的数据
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to resolve domain or fetch IP data' });
  }
}
