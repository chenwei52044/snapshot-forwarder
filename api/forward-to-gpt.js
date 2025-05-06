export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const snapshot = req.body;

  console.log("✅ 快照数据已转发至 GPT 分析入口");
  console.log(snapshot);

  try {
    // 转发到 GPT 分析接口（小天才的分析入口）
    const result = await fetch("https://snapshot-forwarder.vercel.app/api/auto-analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(snapshot)
    });

    const analysis = await result.json();

    return res.status(200).json({
      status: 'forwarded',
      result: analysis
    });
  } catch (err) {
    console.error("❌ 分析转发失败", err);
    return res.status(500).json({ error: 'Forwarding failed' });
  }
}
