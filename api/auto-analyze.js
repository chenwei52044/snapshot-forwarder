export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const snapshot = req.body;
  console.log("🧠 小天才收到快照，准备分析：", snapshot);

  // 👉 模拟分析（这里你以后可以替换成调用 ChatGPT API 或本地模型）
  const result = {
    summary: "模拟分析完成 ✅",
    timestamp: new Date().toISOString(),
    raw: snapshot
  };

  console.log("✅ 小天才分析结果：", result);

  return res.status(200).json(result);
}
