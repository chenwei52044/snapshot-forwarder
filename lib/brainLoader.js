// lib/brainLoader.js
import memory from './xtc_memory.json';

export function getSystemPromptFromMemory() {
  const { system_prompt, 策略规则, 执行偏好, 逻辑备注 } = memory;

  const rules = Object.entries(策略规则).map(([k, v]) => `- ${k}：${v}`).join('\n');
  const prefs = Object.entries(执行偏好).map(([k, v]) => `- ${k}：${v}`).join('\n');
  const notes = 逻辑备注.map(t => `- ${t}`).join('\n');

  return `${system_prompt}\n\n【策略规则】\n${rules}\n\n【执行偏好】\n${prefs}\n\n【补充说明】\n${notes}`;
}
