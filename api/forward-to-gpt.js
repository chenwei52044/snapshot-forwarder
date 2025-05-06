export default async function handler(req, res) {
  if (req.method === 'POST') {
    const snapshot = req.body;
    
    console.log("✅ 快照数据已转发至 GPT 入口");
    console.log(snapshot);

    // 👉 你可以在这里加入实际处理逻辑，例如转发给 ChatGPT API 或入库等

    return res.status(200).json({ status: 'received' });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
console.log("✅ 快照数据已转发至 GPT 入口");
