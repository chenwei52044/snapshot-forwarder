import OpenAI from 'openai';
import strategyPrompt from '../lib/xtc_prompt.js'; // 引入小天才策略 prompt

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const snapshot = req.body;
  console.log("\u{1F4E6} 小天才收到快照，准备分析:", snapshot);

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: strategyPrompt // 使用记忆系统策略
        },
        {
          role: 'user',
          content: `快照内容如下：${JSON.stringify(snapshot)}`
        }
      ]
    });

    const summary = chatCompletion.choices?.[0]?.message?.content || '⚠️ GPT 没有返回内容';

    const result = {
      summary,
      timestamp: new Date().toISOString(),
      raw: {
        ...snapshot,
        gpt_output: summary
      }
    };

    await fetch(process.env.RECEIVER_URL || 'https://snapshot-forwarder.vercel.app/api/receive-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    });

    if (summary && summary !== '⚠️ GPT 没有返回内容') {
      console.log("\u{2705} 小天才分析完成:", result);
    } else {
      console.warn("⚠️ GPT 分析返回为空:", result);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("❌ 分析失败:", err.message);
    return res.status(500).json({ error: '分析失败', detail: err.message });
  }
}
