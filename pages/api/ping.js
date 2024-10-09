export default async function handler(req, res) {
  const { domain } = req.query;

  if (!domain) {
    return res.status(400).json({ error: 'Domain is required' });
  }

  try {
    const start = performance.now(); // 开始时间
    const response = await fetch(`https://${domain}`, { method: 'HEAD' }); // 发送 HEAD 请求
    const end = performance.now(); // 结束时间

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch the domain' });
    }

    const latency = (end - start).toFixed(2); // 计算延迟，保留两位小数
    res.status(200).json({ latency });
  } catch (error) {
    console.error('Fetch Error:', error); // 输出错误信息
    res.status(500).json({ error: 'Failed to ping the domain' });
  }
}
