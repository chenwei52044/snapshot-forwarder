import OpenAI from 'openai';
import { getStrategyPrompt } from '../lib/brainLoader.js'; // ✅ 引入策略模块

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const snapshot = req.body;
  console.log("📦 小天才收到快照，准备分析:", snapshot);

  const strategyPrompt = getStrategyPrompt();

  // 👉 将 snapshot 格式化成 Markdown 代码块
  const formattedSnapshot = `以下是账户当前快照，请基于策略规则输出结构化操作建议：
\`\`\`json
${JSON.stringify(snapshot, null, 2)}
\`\`\`
`;

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: strategyPrompt
        },
        {
          role: 'user',
          content: formattedSnapshot
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

    // ✅ 发回分析结果
    await fetch(process.env.RECEIVER_URL || 'https://snapshot-forwarder.vercel.app/api/receive-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result)
    });

    console.log("✅ 小天才分析完成:", result);
    return res.status(200).json(result);
  } catch (err) {
    console.error("❌ 分析失败:", err.message);

    return res.status(500).json({
      error: '分析失败',
      detail: err.message,
      debugHint: '可能是 prompt 中 JSON 格式错误或模型响应结构变化'
    });
  }
}
