import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
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
            const response = await fetch(`/api/test?domain=${node.domain}`);
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Node Status Dashboard</h1>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2">节点编号</TableHead>
              <TableHead className="px-4 py-2">节点名称</TableHead>
              <TableHead className="px-4 py-2">域名</TableHead>
              <TableHead className="px-4 py-2">IP地址</TableHead>
              <TableHead className="px-4 py-2">延迟 (ms)</TableHead>
              <TableHead className="px-4 py-2">位置</TableHead>
              <TableHead className="px-4 py-2">ISP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nodeStatuses.map((node) => (
              <TableRow key={node.id} className="hover:bg-gray-100">
                <TableCell className="px-4 py-2">{node.id}</TableCell>
                <TableCell className="px-4 py-2">{node.name}</TableCell>
                <TableCell className="px-4 py-2">{node.domain}</TableCell>
                <TableCell className="px-4 py-2">{node.ip || 'N/A'}</TableCell>
                <TableCell className="px-4 py-2">{node.latency || 'N/A'}</TableCell>
                <TableCell className="px-4 py-2">{node.city ? `${node.city}, ${node.country}` : 'N/A'}</TableCell>
                <TableCell className="px-4 py-2">{node.isp || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
