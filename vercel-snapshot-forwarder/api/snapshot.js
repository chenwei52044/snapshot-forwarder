
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const snapshot = req.body;

    console.log('📦 Received Snapshot:', JSON.stringify(snapshot, null, 2));

    // TODO: 在此将数据写入数据库、调用 AI 分析等操作
    return res.status(200).json({ message: 'Snapshot received' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
