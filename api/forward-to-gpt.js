export default async function handler(req, res) {
  try {
    const snapshot = req.body;

    console.log("📦 快照数据已转发至 GPT 分析入口");
    console.log(snapshot);

    // 这里直接调用 /api/auto-analyze 接口
    const response = await fetch(`${process.env.ANALYZER_URL || 'https://snapshot-forwarder.vercel.app/api/auto-analyze'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snapshot)
    });

    const result = await response.json();
    console.log("✅ GPT 分析完成:", result);

    return res.status(200).json(result);

  } catch (error) {
    console.error("❌ 分析转发失败:", error.message);
    return res.status(500).json({ error: '分析转发失败', detail: error.message });
  }
}
