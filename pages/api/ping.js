// /api/ping.js
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

    // 记录开始时间
    const startTime = performance.now();
    
    // 发送 HEAD 请求以测量延迟
    const response = await fetch(`http://${domain}`, { method: 'HEAD' });
    
    // 记录结束时间
    const endTime = performance.now();
    
    // 计算延迟
    const latency = endTime - startTime;

    // 获取 IP 地理位置信息
    const ipApiResponse = await fetch(`http://ip-api.com/json/${address}`);
    const ipData = await ipApiResponse.json();

    res.status(200).json({
      ip: address,
      latency: latency.toFixed(2), // 保留两位小数
      ...ipData,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to resolve domain or fetch data' });
  }
}
