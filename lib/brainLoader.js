// lib/brainLoader.js
import fs from 'fs';
import path from 'path';

export function getStrategyPrompt() {
  const memoryPath = path.join(process.cwd(), 'lib', 'xtc_memory.json');
  const memory = JSON.parse(fs.readFileSync(memoryPath, 'utf-8'));

  const rules = Object.entries(memory['策略规则'])
    .map(([key, val]) => `- ${key}：${val}`).join('\n');

  const prefs = Object.entries(memory['执行偏好'])
    .map(([key, val]) => `- ${key}：${val}`).join('\n');

  const notes = memory['逻辑备注'].map(line => `- ${line}`).join('\n');

  return `
身份设定：${memory['身份设定']}

【策略规则】
${rules}

【执行偏好】
${prefs}

【逻辑备注】
${notes}
`.trim();
}
