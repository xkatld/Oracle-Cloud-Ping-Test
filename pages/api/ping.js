export default async function handler(req, res) {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  try {
    const start = performance.now(); // 获取开始时间
    const response = await fetch(`https://${domain}`, { method: 'HEAD' }); // 发起请求
    const end = performance.now(); // 获取结束时间

    const latency = end - start; // 计算延迟

    if (!response.ok) {
      throw new Error(`Failed to fetch from ${domain}`);
    }

    res.status(200).json({
      domain,
      latency: latency.toFixed(2) + ' ms', // 格式化延迟
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to measure latency', details: error.message });
  }
}
