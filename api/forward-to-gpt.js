export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({ error: '快照数据为空或格式错误' });
  }

  const snapshot = req.body;
  const analyzerUrl = process.env.ANALYZER_URL || 'https://snapshot-forwarder.vercel.app/api/auto-analyze';

  console.log("📦 快照数据已转发至 GPT 分析入口");
  console.log(snapshot);

  try {
    const response = await fetch(analyzerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snapshot)
    });

    const result = await response.json();

    console.log("✅ GPT 分析完成:", result);
    return res.status(200).json(result);

  } catch (error) {
    console.error("❌ 分析转发失败:", error.message);
    return res.status(500).json({
      error: '分析转发失败',
      detail: error.message || error.toString()
    });
  }
}
