import fs from 'fs';
import path from 'path';

const memoryFilePath = path.join(process.cwd(), 'lib', 'xtc_memory.json');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  const { key, value } = req.body;

  if (!key || typeof value !== 'string') {
    return res.status(400).json({ error: '参数错误，需提供 key 和 string 类型的 value' });
  }

  try {
    const data = JSON.parse(fs.readFileSync(memoryFilePath, 'utf-8'));

    const keyPath = key.split('.');
    let target = data;

    for (let i = 0; i < keyPath.length - 1; i++) {
      if (!target[keyPath[i]]) target[keyPath[i]] = {};
      target = target[keyPath[i]];
    }

    target[keyPath[keyPath.length - 1]] = value;

    fs.writeFileSync(memoryFilePath, JSON.stringify(data, null, 2), 'utf-8');

    res.status(200).json({ success: true, updated: { key, value } });
  } catch (err) {
    console.error("更新记忆失败:", err);
    res.status(500).json({ error: '更新记忆失败', detail: err.message });
  }
}
