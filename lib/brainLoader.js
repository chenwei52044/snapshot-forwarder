import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getStrategyPrompt() {
  const memoryPath = path.join(__dirname, 'xtc_memory.json'); // ✅ 改成相对于这个文件的路径
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
