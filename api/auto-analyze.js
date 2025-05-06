import OpenAI from 'openai';
import { getStrategyPrompt } from '../lib/brainLoader.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const snapshot = req.body;
  console.log("📩 小天才收到快照，准备分析:", snapshot);

  // ✅ 判断是否是合并结构（必须包含至少一个币种）
  if (!(snapshot.BTCUSDT || snapshot.ETHUSDT || snapshot.SOLUSDT)) {
    console.error("❌ 快照不是合并结构，拒绝执行");
    return res.status(400).json({ error: 'Invalid snapshot structure' });
  }

  // 📦 加载策略 prompt
  let strategyPrompt = '';
  try {
    strategyPrompt = getStrategyPrompt();
  } catch (e) {
    console.error("❌ 加载策略记忆失败:", e);
    return res.status(500).json({ error: '无法读取策略记忆', detail: e.message });
  }

  // 🤖 请求 GPT 分析
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: strategyPrompt },
        {
          role: 'user',
          content: `请基于策略记忆与以下账户快照，生成结构化操作建议（包含持仓分析 + 盈亏状态 + 是否止盈/止损 + 操作指令清单 + 逻辑说明）。禁止使用 markdown 符号。\n\n${JSON.stringify(snapshot)}`
        }
      ]
    });

    const summary = chatCompletion.choices?.[0]?.message?.content || '⚠️ GPT 没有返回内容';
    console.log("✅ 小天才分析完成:", summary.slice(0, 100) + '...');

    return res.status(200).json({
      summary,
      timestamp: new Date().toISOString(),
      snapshot
    });

  } catch (err) {
    console.error("❌ GPT 分析失败:", err);
    return res.status(500).json({ error: '分析失败', detail: err.message });
  }
}
