export default async function handler(req, res) {
  if (req.method === 'POST') {
    const snapshot = req.body;
    
    console.log("✅ 快照数据已转发至 GPT 入口");
    console.log(snapshot);

    // ✅ 自动调用小天才分析模块（模拟策略分析入口）
    try {
      await fetch('https://snapshot-forwarder.vercel.app/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snapshot)
      });
      console.log("✅ 已通知小天才进行策略分析");
    } catch (err) {
      console.error("❌ 分析模块调用失败：", err);
    }

    return res.status(200).json({ status: 'received and forwarded to analysis' });
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
