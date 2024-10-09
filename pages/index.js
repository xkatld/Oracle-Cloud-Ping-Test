import React, { useState, useEffect } from 'react';
import { nodeData } from '../lib/nodeData';

export default function Home() {
  const [nodeStatuses, setNodeStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pingResult, setPingResult] = useState('');
  const [ipInput, setIpInput] = useState('');

  useEffect(() => {
    const fetchNodeStatuses = async () => {
      setIsLoading(true);
      const statuses = await Promise.all(
        nodeData.map(async (node) => {
          const start = Date.now();
          try {
            const response = await fetch(`/api/test?domain=${node.domain}`);
            const data = await response.json();
            const end = Date.now();
            const latency = end - start;
            return { ...node, ...data, latency };
          } catch (error) {
            return { ...node, error: 'Failed to fetch data', latency: 'N/A' };
          }
        })
      );
      setNodeStatuses(statuses);
      setIsLoading(false);
    };

    fetchNodeStatuses();
  }, []);

  const ping = async () => {
    const protocol = window.location.protocol;
    const start = Date.now();
    try {
      const response = await fetch(`${protocol}//${ipInput}`, { method: 'HEAD', mode: 'no-cors' });
      const end = Date.now();
      const latency = end - start;
      setPingResult(`延迟: ${latency} ms`);
    } catch (error) {
      setPingResult('请求失败或超时');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Node Status Dashboard</h1>
      {isLoading ? (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>节点编号</th>
                <th>节点名称</th>
                <th>域名</th>
                <th>IP地址</th>
                <th>延迟 (ms)</th>
                <th>位置</th>
                <th>ISP</th>
              </tr>
            </thead>
            <tbody>
              {nodeStatuses.map((node) => (
                <tr key={node.id}>
                  <td>{node.id}</td>
                  <td>{node.name}</td>
                  <td>{node.domain}</td>
                  <td>{node.ip || 'N/A'}</td>
                  <td>{node.latency || 'N/A'}</td>
                  <td>{node.city ? `${node.city}, ${node.country}` : 'N/A'}</td>
                  <td>{node.isp || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1050 }}>
            <input
              type="text"
              className="form-control mb-2"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="输入IP地址"
            />
            <button onClick={ping} className="btn btn-primary w-100">Ping</button>
            <p className="mt-2">{pingResult}</p>
          </div>
        </div>
      )}
    </div>
  );
}
