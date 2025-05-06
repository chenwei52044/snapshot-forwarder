import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const snapshot = req.body;
  console.log("📦 小天才收到快照，准备分析: ", snapshot);

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4', // 可改为 'gpt-3.5-turbo'
      messages: [
        {
          role: 'system',
          content: '你是一个专业的加密交易分析助理，请根据输入的快照数据分析持仓、方向、盈亏和建议操作。'
        },
        {
          role: 'user',
          content: `快照内容如下：${JSON.stringify(snapshot)}`
        }
      ]
    });

    const summary = chatCompletion.choices[0].message.content;

    const result = {
      summary,
      timestamp: new Date().toISOString(),
      raw: snapshot
    };

    await fetch(process.env.RECEIVER_URL || 'https://snapshot-forwarder.vercel.app/api/receive-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    });

    console.log("✅ 小天才分析并发送成功:", result);
    return res.status(200).json(result);
  } catch (err) {
    console.error("❌ 分析失败:", err.message);
    return res.status(500).json({ error: '分析失败', detail: err.message });
  }
}
