import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"

const nodeData = [
  { id: 1, name: '悉尼', domain: 'ap-sydney-1.oraclecloud.com' },
  { id: 2, name: '墨尔本', domain: 'ap-melbourne-1.oraclecloud.com' },
  { id: 3, name: '圣保罗', domain: 'sa-saopaulo-1.oraclecloud.com' },
  // ... 添加所有其他节点
];

export default function Home() {
  const [nodeStatuses, setNodeStatuses] = useState([]);

  useEffect(() => {
    const fetchNodeStatuses = async () => {
      const statuses = await Promise.all(
        nodeData.map(async (node) => {
          const start = Date.now();
          try {
            const response = await fetch(`/api/ping?domain=${node.domain}`);
            const data = await response.json();
            const latency = Date.now() - start;
            return { ...node, ip: data.ip, latency };
          } catch (error) {
            return { ...node, ip: 'Error', latency: 'N/A' };
          }
        })
      );
      setNodeStatuses(statuses);
    };

    fetchNodeStatuses();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Node Status</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>节点编号</TableHead>
            <TableHead>节点名称</TableHead>
            <TableHead>域名</TableHead>
            <TableHead>IP地址</TableHead>
            <TableHead>延迟 (ms)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nodeStatuses.map((node) => (
            <TableRow key={node.id}>
              <TableCell>{node.id}</TableCell>
              <TableCell>{node.name}</TableCell>
              <TableCell>{node.domain}</TableCell>
              <TableCell>{node.ip}</TableCell>
              <TableCell>{node.latency}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
