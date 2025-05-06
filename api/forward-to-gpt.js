export default async function handler(req, res) {
  if (req.method === 'POST') {
    const snapshot = req.body;

    console.log("✅ 快照数据已转发至 GPT 入口");
    console.log(snapshot);

    // 👉 示例分析调用：这里你未来可以调用 GPT 分析逻辑
    // const result = await fetch('https://your-gpt-endpoint.com/analyze', { ... })

    return res.status(200).json({ status: 'received', snapshot });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
