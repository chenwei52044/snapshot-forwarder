export default async function handler(req, res) {
  if (req.method === 'POST') {
    const snapshot = req.body;
    console.log("✅ 快照数据已转发至 GPT 入口");
    console.log(snapshot);

    try {
      // ✅ 自动触发分析模块
      const result = await fetch('https://your-gpt-endpoint.com/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snapshot)
      });

      const analysis = await result.json();

      return res.status(200).json({
        status: 'analyzed',
        result: analysis
      });
    } catch (err) {
      console.error("❌ 分析失败", err);
      return res.status(500).json({ error: 'Analysis failed' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
