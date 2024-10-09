import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import dns from 'dns';
import { promisify } from 'util';

const lookup = promisify(dns.lookup);

const nodeData = [
  { id: 1, name: '悉尼', domain: 'ap-sydney-1.oraclecloud.com' },
  { id: 2, name: '墨尔本', domain: 'ap-melbourne-1.oraclecloud.com' },
  { id: 3, name: '圣保罗', domain: 'sa-saopaulo-1.oraclecloud.com' },
  // ... 添加所有其他节点
];

export default function Home({ nodeStatuses }) {
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
          </TableRow>
        </TableHeader>
        <TableBody>
          {nodeStatuses.map((node) => (
            <TableRow key={node.id}>
              <TableCell>{node.id}</TableCell>
              <TableCell>{node.name}</TableCell>
              <TableCell>{node.domain}</TableCell>
              <TableCell>{node.ip}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export async function getStaticProps() {
  const nodeStatuses = await Promise.all(
    nodeData.map(async (node) => {
      try {
        const { address } = await lookup(node.domain);
        return { ...node, ip: address };
      } catch (error) {
        return { ...node, ip: 'Error' };
      }
    })
  );

  return {
    props: {
      nodeStatuses,
    },
    // 每小时重新生成页面
    revalidate: 3600,
  };
}
