export default async function handler(req, res) {
  if (req.method === 'POST') {
    const snapshot = req.body;
    console.log("✅ 快照数据已转发至 GPT 入口");
    console.log(snapshot); // ✅ 你会在 vercel 日志中看到完整快照
    return res.status(200).json({ status: 'GPT 收到数据' });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
