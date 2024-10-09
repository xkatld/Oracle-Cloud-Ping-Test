import React, { useState, useEffect } from 'react';
import { nodeData } from '../lib/nodeData';

export default function Home() {
  const [nodeStatuses, setNodeStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pingResults, setPingResults] = useState({}); // 存储每个节点的延迟结果

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

  const pingAll = async () => {
    const results = {};
    for (const node of nodeStatuses) {
      const protocol = window.location.protocol;
      const start = Date.now();
      try {
        await fetch(`${protocol}//${node.domain}`, { method: 'HEAD' });
        const end = Date.now();
        results[node.id] = `延迟: ${end - start} ms`;
      } catch (error) {
        results[node.id] = '请求失败或超时';
      }
    }
    setPingResults(results);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Node Status Dashboard</h1>
      <button onClick={pingAll} className="btn btn-primary mb-4">测试所有节点延迟</button>
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
                <th>延迟(ms)</th>
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
                  <td>{pingResults[node.id] || 'N/A'}</td> {/* 显示延迟结果 */}
                  <td>{node.city ? `${node.city}, ${node.country}` : 'N/A'}</td>
                  <td>{node.isp || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
