
export default function handler(req, res) {
  if (req.method === 'POST') {
    const data = req.body;
    console.log('📥 收到快照:', data);
    res.status(200).json({
      status: 'received',
      snapshot: data
    });
  } else {
    res.status(405).json({ message: 'Only POST requests allowed' });
  }
}
