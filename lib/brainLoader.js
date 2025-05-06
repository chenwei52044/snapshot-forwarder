// lib/brainLoader.js
import fs from 'fs';
import path from 'path';

export function getStrategyPrompt() {
  const memoryPath = path.join(process.cwd(), 'lib', 'xtc_memory.json');

  let memory = {};
  try {
    memory = JSON.parse(fs.readFileSync(memoryPath, 'utf-8'));
  } catch (err) {
    console.error("❌ 无法读取策略记忆文件:", err.message);
    return '身份设定：你是小天才，请根据快照制定结构化策略建议。';
  }

  const rules = Object.entries(memory['策略规则'] || {})
    .map(([key, val]) => `- ${key}：${val}`).join('\n');

  const prefs = Object.entries(memory['执行偏好'] || {})
    .map(([key, val]) => `- ${key}：${val}`).join('\n');

  const notes = (memory['逻辑备注'] || [])
    .map(line => `- ${line}`).join('\n');

  return `
身份设定：${memory['身份设定'] || '你是小天才，一名AI交易策略制定者。用户只负责执行。'}

📌 输出要求（请严格遵守）：
- 禁止使用 Markdown 符号，如 ###、``` 等。
- 输出必须为纯文本结构，便于系统解析。
- 所有操作建议必须包含：建仓点、止盈、止损、盈亏比、成交概率。
- 输出建议结构应尽量使用操作清单格式，便于自动识别。
- 不允许生成多段落解释式分析，请以执行指令为核心。

【策略规则】
${rules}

【执行偏好】
${prefs}

【逻辑备注】
${notes}
`.trim();
}
