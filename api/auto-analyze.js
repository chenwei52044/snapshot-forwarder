export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const snapshot = req.body;
  console.log("🧠 小天才收到快照，准备分析：", snapshot);

  // 👉 模拟分析逻辑
  const result = {
    summary: "模拟分析完成 ✅",
    timestamp: new Date().toISOString(),
    raw: snapshot
  };

  console.log("✅ 小天才分析结果：", result);

  // ✅ 把分析结果送回给小天才（这个是关键！）
  await fetch("https://snapshot-forwarder.vercel.app/api/receive-analysis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result)
  });

  return res.status(200).json(result);
}
