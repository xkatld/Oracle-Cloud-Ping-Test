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
            const response = await fetch(`https://oracle-cloud-ping-test-nyxlvu80p-xkatlds-projects.vercel.app/api/test?domain=${node.domain}`);
            const data = await response.json();
            return { ...node, ...data };
          } catch (error) {
            return { ...node, error: 'Failed to fetch data' };
          }
        })
      );
      setNodeStatuses(statuses);
      setIsLoading(false);
    };

    fetchNodeStatuses();
  }, []);

  useEffect(() => {
    const fetchLatencies = async () => {
      const updatedStatuses = await Promise.all(
        nodeStatuses.map(async (node) => {
          if (node.domain) {
            const start = Date.now();
            try {
              const response = await fetch(`https://${node.domain}`, { method: 'HEAD' });
              if (response.ok) {
                const latency = Date.now() - start;
                return { ...node, latency };
              }
            } catch (error) {
              return { ...node, latency: 'N/A' };
            }
          }
          return node;
        })
      );
      setNodeStatuses(updatedStatuses);
    };

    if (nodeStatuses.length > 0) {
      const intervalId = setInterval(fetchLatencies, 5000); // 每 5 秒更新延迟
      return () => clearInterval(intervalId); // 清理定时器
    }
  }, [nodeStatuses]);

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
                  <td>{node.latency !== undefined ? `${node.latency} ms` : 'N/A'}</td>
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
