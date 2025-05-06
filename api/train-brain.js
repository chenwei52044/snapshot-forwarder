import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const updates = req.body;
    const memoryPath = path.join(process.cwd(), 'lib', 'xtc_memory.json');

    // 读取原始记忆
    const memory = JSON.parse(fs.readFileSync(memoryPath, 'utf-8'));

    // 合并新记忆（覆盖式合并）
    const updated = { ...memory, ...updates };

    // 写入新内容
    fs.writeFileSync(memoryPath, JSON.stringify(updated, null, 2), 'utf-8');

    console.log('🧠 小天才记忆更新成功:', updates);
    return res.status(200).json({ message: '记忆已更新', updated });
  } catch (err) {
    console.error('❌ 更新记忆失败:', err.message);
    return res.status(500).json({ error: '更新失败', detail: err.message });
  }
}
