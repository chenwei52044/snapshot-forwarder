export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const snapshot = req.body;
  console.log("📩 小天才收到快照:", snapshot);

  // ✅ 只发一次分析指令
  await fetch('https://snapshot-forwarder.vercel.app/api/auto-analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(snapshot)
  });

  res.status(200).json({ status: 'forwarded' });
}
