import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const snapshot = req.body;
  console.log("📦 小天才收到快照，准备分析: ", snapshot);

  try {
    // 使用 ChatGPT 分析快照
    const completion = await openai.createChatCompletion({
      model: "gpt-4", // 如无权限可以改为 'gpt-3.5-turbo'
      messages: [
        { role: "system", content: "你是一个专业的加密交易分析助理，请根据输入的快照数据分析持仓、方向、盈亏和建议操作。" },
        { role: "user", content: `快照内容如下：${JSON.stringify(snapshot)}` },
      ],
    });

    const summary = completion.data.choices[0].message.content;

    // 构造分析结果
    const result = {
      summary,
      timestamp: new Date().toISOString(),
      raw: snapshot
    };

    // 发送结果给 receive-analysis 接收器
    await fetch(`${process.env.RECEIVER_URL || 'https://snapshot-forwarder.vercel.app/api/receive-analysis'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    });

    console.log("✅ 小天才分析并发送成功:", result);
    return res.status(200).json(result);

  } catch (error) {
    console.error("❌ 分析失败: ", error.message);
    return res.status(500).json({ error: '分析失败', detail: error.message });
  }
}
