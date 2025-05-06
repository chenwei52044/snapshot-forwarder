import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// ✅ 动态加载小天才策略记忆文件
const memoryPath = path.join(process.cwd(), 'lib', 'xtc_memory.json');
const memory = JSON.parse(fs.readFileSync(memoryPath, 'utf-8'));

// ✅ 拼接 system prompt（避免写死）
const strategyPrompt = `
身份设定：${memory['身份设定']}

【策略规则】
${Object.entries(memory['策略规则']).map(([key, val]) => `- ${key}：${val}`).join('\n')}

【执行偏好】
${Object.entries(memory['执行偏好']).map(([key, val]) => `- ${key}：${val}`).join('\n')}

【备注】
${memory['逻辑备注'].join('；')}
`;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const snapshot = req.body;
  console.log("📦 小天才收到快照，准备分析:", snapshot);

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o', // ✅ 确保为 gpt-4o
      messages: [
        {
          role: 'system',
          content: strategyPrompt
        },
        {
          role: 'user',
          content: `以下是账户当前快照，请基于策略规则给出结构化操作建议（持仓分析 + 盈亏状态 + 是否止盈/止损 + 操作建议 + 逻辑说明）：

${JSON.stringify(snapshot)}`
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
      console.log("✅ 小天才分析完成:", result);
    } else {
      console.warn("⚠️ GPT 分析返回为空:", result);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error("❌ 分析失败:", err.message);
    return res.status(500).json({ error: '分析失败', detail: err.message });
  }
}
