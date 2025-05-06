
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const snapshot = req.body

    console.log("📡 Received Snapshot:", snapshot)

    // ✅ 转发给小天才
    await fetch("https://snapshot-forwarder.vercel.app/api/auto-analyze", {

      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(snapshot)
    })

    return res.status(200).json({ status: 'received' })
  } else {
    return res.status(405).json({ error: 'Method not allowed' })
  }
}
