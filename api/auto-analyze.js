// ✅ /pages/api/auto-analyze.js
// 修复了路径问题 + 明确为 Node.js Runtime（避免 Vercel Edge 限制）

import OpenAI from 'openai';
import { getStrategyPrompt } from '../../lib/brainLoader.js';

export const config = {
  runtime: 'nodejs' // 🔧 强制指定 Node.js 运行环境，确保支持 fs/path 模块
};

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
          content: `请基于策略记忆与以下账户快照，生成结构化操作建议（包含持仓分析 + 盈亏状态 + 是否止盈/止损 + 操作指令清单 + 逻辑说明）。禁止使用 markdown 符号。

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

    console.log("✅ 小天才分析完成:", summary.slice(0, 120) + '...');
    return res.status(200).json(result);
  } catch (err) {
    console.error("❌ 分析失败:", err.message, err.stack);
    return res.status(500).json({ error: '分析失败', detail: err.message });
  }
}
