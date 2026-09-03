import fs from 'node:fs/promises';
import path from 'node:path';
import { commonFaq, commonChatScript, sharedRules, items } from './goofish_data.mjs';

const root = path.resolve(process.cwd(), 'market/goofish');

function ensureTrailingNewline(text) {
  return text.endsWith('\n') ? text : `${text}\n`;
}

function joinLines(lines) {
  return ensureTrailingNewline(lines.join('\n'));
}

function bulletList(values) {
  return values.map((value) => `- ${value}`).join('\n');
}

function tierTable(tiers) {
  return [
    '| 档位 | 价格 | 范围 |',
    '|---|---:|---|',
    ...tiers.map(([tier, price, scope]) => `| ${tier} | ${price} | ${scope} |`),
  ].join('\n');
}

function imageCopy(item) {
  return joinLines([
    `# ${item.name} 图片文案`,
    '',
    `## 01-cover`,
    `DSH / ${item.name} / ${item.summary}`,
    '',
    `## 02-deliverables`,
    item.imageDeliverables,
    '',
    `## 03-workflow`,
    item.workflow,
    '',
    `## 04-输入与边界`,
    item.boundaries,
    '',
    '## 备注',
    '图片文字与商品发布文字保持一致。',
  ]);
}

function listing(item) {
  return joinLines([
    `# ${item.name}`,
    '',
    `**状态：** ${item.status}`,
    '',
    '## 发布字段',
    `- 商品标题：${item.title}`,
    `- 标题候选：`,
    ...item.titleCandidates.map((title) => `  - ${title}`),
    `- 类目建议：${item.category}`,
    `- 商品类型：${item.itemType}`,
    `- 交付方式：${item.delivery}`,
    `- 交付格式：${item.formats}`,
    `- 接单数量：${item.inventory}`,
    '',
    '## 商品卖点',
    item.summary,
    '',
    '## 价格与规格',
    tierTable(item.tiers),
    '',
    '## 交付内容',
    bulletList(item.deliverables),
    '',
    '## 买家需要提供',
    bulletList(item.inputs),
    '',
    '## 交付周期',
    item.cycle,
    '',
    '## 修改规则',
    item.revisions,
    '',
    '## 不包含内容',
    bulletList(item.exclusions),
    '',
    '## 商品描述（可复制）',
    `DSH ${item.name}，${item.summary}`,
    '',
    `适合：${item.inputs.slice(0, 3).join('、')}等资料型需求。`,
    `交付：${item.deliverables.join('、')}。`,
    `周期：${item.cycle}。`,
    `修改：${item.revisions}。`,
    `格式：${item.formats}。`,
    `说明：${item.boundaries}。`,
    '',
    '## 人工确认项',
    `- ${item.manualReview}`,
    '',
    '## 统一说明',
    ...sharedRules.map((rule) => `- ${rule}`),
  ]);
}

function pricing(item) {
  return joinLines([
    `# ${item.name} 价格与规格`,
    '',
    tierTable(item.tiers),
    '',
    '## 填写说明',
    '- 价格只填写在商品发布字段和文字资料中，不得放进图片。',
    '- 修改范围时同步更新本文件和对应的 listing.md。',
    `- 当前状态：${item.status}，不能因为物料生成完成而自动改成可发布。`,
  ]);
}

function faq(item) {
  return joinLines([
    `# ${item.name} 常见问题`,
    '',
    ...commonFaq.map((q) => `- ${q}`),
    '',
    '## 商品专属问题',
    ...item.faq.map((q) => `- ${q}`),
  ]);
}

function chatScript(item) {
  return joinLines([
    `# ${item.name} 私聊话术`,
    '',
    ...commonChatScript.map((line) => line ? line : ''),
    '',
    '## 商品专属补充',
    ...item.chat.map((line) => `- ${line}`),
  ]);
}

function publishChecklist(item) {
  return joinLines([
    `# ${item.name} 发布前检查表`,
    '',
    `- 标题从 listing.md 复制：${item.title}`,
    '- 价格从 pricing.md 复制到商品字段，不写入图片',
    '- 四张图片按封面、交付物、流程、输入与边界顺序上传',
    '- 图片不包含价格、折扣、联系方式、二维码、URL 或站外平台名',
    '- 商品描述中有交付范围和不包含内容',
    `- 当前状态：${item.status}`,
    '- 买家需要提供的资料已写清',
    '- 交付格式、周期和修改次数已写清',
    `- 人工确认项已复核：${item.manualReview}`,
  ]);
}

async function writeItem(item) {
  const dir = path.join(root, item.slug);
  await fs.mkdir(path.join(dir, 'assets'), { recursive: true });
  await fs.writeFile(path.join(dir, 'listing.md'), listing(item));
  await fs.writeFile(path.join(dir, 'pricing.md'), pricing(item));
  await fs.writeFile(path.join(dir, 'image-copy.md'), imageCopy(item));
  await fs.writeFile(path.join(dir, 'faq.md'), faq(item));
  await fs.writeFile(path.join(dir, 'chat-script.md'), chatScript(item));
  await fs.writeFile(path.join(dir, 'publish-checklist.md'), publishChecklist(item));
}

async function main() {
  await fs.mkdir(root, { recursive: true });
  await Promise.all(items.map(writeItem));
  await fs.writeFile(
    path.join(root, 'generated-summary.md'),
    joinLines([
      '# Generated Summary',
      '',
      `Generated ${items.length} goofish product packages.`,
      '',
      ...items.map((item) => `- ${item.slug}: ${item.status}`),
    ]),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
