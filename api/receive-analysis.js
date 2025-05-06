export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const result = req.body;
  console.log("📩 小天才已收到分析结果：", result);

  // ✅ 你可以在这里做更多事，比如把结果存数据库、发到别的服务等
  return res.status(200).json({ status: '小天才已收到分析结果 ✅' });
}
