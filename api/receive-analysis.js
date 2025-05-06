export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const snapshot = req.body;
  console.log("📩 小天才收到快照，准备分析:", snapshot);

  try {
    const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // 请在 Vercel 环境变量中配置
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4', // 或 gpt-3.5-turbo
        messages: [
          { role: 'system', content: '你是一个交易策略分析师，请基于以下快照数据提供简要分析。' },
          { role: 'user', content: JSON.stringify(snapshot) }
        ]
      })
    });

    const gptJson = await gptResponse.json();
    const reply = gptJson.choices?.[0]?.message?.content || '⚠️ GPT 没有返回结果';

    const result = {
      summary: reply,
      timestamp: new Date().toISOString(),
      raw: snapshot
    };

    console.log("✅ 小天才分析完成:", result);

    // 转发结果给 /api/receive-analysis
    await fetch('https://snapshot-forwarder.vercel.app/api/receive-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    });

    return res.status(200).json(result);

  } catch (err) {
    console.error("❌ 调用 GPT 分析失败", err);
    return res.status(500).json({ error: 'GPT analysis failed' });
  }
}
