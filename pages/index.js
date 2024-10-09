import React, { useState, useEffect } from 'react';
import { nodeData } from '../lib/nodeData';

export default function Home() {
  const [nodeStatuses, setNodeStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNodeStatuses = async () => {
      setIsLoading(true);
      const statuses = await Promise.all(
        nodeData.map(async (node) => {
          try {
            // 调用 /api/ping 获取 IP、延迟和其他信息
            const response = await fetch(`/api/ping?domain=${node.domain}`);
            const data = await response.json();
            
            return {
              ...node,
              ip: data.ip || 'N/A',
              latency: data.latency || 'N/A',
              city: data.city || 'N/A',
              country: data.country || 'N/A',
              isp: data.isp || 'N/A',
            };
          } catch (error) {
            console.error('Fetch Error:', error);
            return {
              ...node,
              ip: 'N/A',
              latency: 'N/A',
              city: 'N/A',
              country: 'N/A',
              isp: 'N/A',
            };
          }
        })
      );
      setNodeStatuses(statuses);
      setIsLoading(false);
    };

    fetchNodeStatuses();
  }, []);

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
        </div>
      )}
    </div>
  );
}
