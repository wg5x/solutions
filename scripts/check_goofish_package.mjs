import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { items } from './goofish_data.mjs';

const require = createRequire(import.meta.url);
const sharp = require('/Users/wgxxx/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = path.resolve(process.cwd(), 'market/goofish');
const textOnly = process.argv.includes('--text-only');
const imageNames = [
  '01-cover.png',
  '02-deliverables.png',
  '03-workflow.png',
  '04-inputs-and-boundaries.png',
];
const markdownNames = [
  'listing.md',
  'pricing.md',
  'image-copy.md',
  'faq.md',
  'chat-script.md',
  'publish-checklist.md',
];
const failures = [];
const warnings = [];

function fail(message) {
  failures.push(message);
}

function warn(message) {
  warnings.push(message);
}

async function readFile(file) {
  try {
    return await fs.readFile(file, 'utf8');
  } catch {
    fail(`missing file: ${path.relative(process.cwd(), file)}`);
    return '';
  }
}

function requireText(content, value, label) {
  if (!content.includes(value)) {
    fail(`${label} missing: ${value}`);
  }
}

function checkSensitiveText(content, label) {
  const patterns = [
    /https?:\/\/\S+/i,
    /(?<!\d)1[3-9]\d{9}(?!\d)/,
    /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    /\b(?:sk|api|key|token)[-_][A-Za-z0-9_-]{12,}\b/i,
  ];
  for (const pattern of patterns) {
    if (pattern.test(content)) {
      fail(`${label} contains sensitive pattern: ${pattern}`);
    }
  }
}

function checkImageCopy(content, label) {
  const forbidden = [
    /(?:¥|￥|\b\d+(?:\.\d+)?\s*元\b)/,
    /折扣|优惠|满减|低至|券/,
    /(?:电话|手机|手机号|邮箱|二维码|微信|QQ|Telegram|WhatsApp|站外|外部链接|URL)/i,
    /https?:\/\/\S+/i,
  ];
  for (const pattern of forbidden) {
    if (pattern.test(content)) {
      fail(`${label} contains image-forbidden text: ${pattern}`);
    }
  }
}

async function checkMarkdown(item) {
  const dir = path.join(root, item.slug);
  const contents = {};
  for (const name of markdownNames) {
    contents[name] = await readFile(path.join(dir, name));
  }

  const listing = contents['listing.md'];
  const pricing = contents['pricing.md'];
  const imageCopy = contents['image-copy.md'];
  const faq = contents['faq.md'];
  const chat = contents['chat-script.md'];
  const checklist = contents['publish-checklist.md'];

  [
    item.name,
    `**状态：** ${item.status}`,
    '商品标题',
    '标题候选',
    '类目建议',
    '商品类型',
    '交付方式',
    '交付格式',
    '接单数量',
    '价格与规格',
    '交付内容',
    '买家需要提供',
    '交付周期',
    '修改规则',
    '不包含内容',
    '商品描述（可复制）',
    '人工确认项',
  ].forEach((value) => requireText(listing, value, `${item.slug}/listing.md`));

  ['引流款', '标准款', '深度款', '元'].forEach((value) => {
    requireText(pricing, value, `${item.slug}/pricing.md`);
  });
  ['常见问题', '商品专属问题'].forEach((value) => {
    requireText(faq, value, `${item.slug}/faq.md`);
  });
  ['私聊话术', '主题或目标', '资料收到'].forEach((value) => {
    requireText(chat, value, `${item.slug}/chat-script.md`);
  });
  ['发布前检查表', '标题', '价格', '四张图片', '人工确认'].forEach((value) => {
    requireText(checklist, value, `${item.slug}/publish-checklist.md`);
  });

  checkSensitiveText(listing, `${item.slug}/listing.md`);
  checkSensitiveText(pricing, `${item.slug}/pricing.md`);
  checkSensitiveText(faq, `${item.slug}/faq.md`);
  checkSensitiveText(chat, `${item.slug}/chat-script.md`);
  checkSensitiveText(checklist, `${item.slug}/publish-checklist.md`);
  checkImageCopy(imageCopy, `${item.slug}/image-copy.md`);

  if (!textOnly) {
    for (const imageName of imageNames) {
      const file = path.join(dir, 'assets', imageName);
      try {
        const metadata = await sharp(file).metadata();
        if (metadata.width !== 1080 || metadata.height !== 1440) {
          fail(`${item.slug}/assets/${imageName} must be 1080x1440, got ${metadata.width}x${metadata.height}`);
        }
      } catch {
        fail(`missing or unreadable image: ${item.slug}/assets/${imageName}`);
      }
    }
  }
}

async function main() {
  for (const item of items) {
    await checkMarkdown(item);
  }
  if (!textOnly) {
    const preview = path.join(root, 'preview', 'index.html');
    try {
      await fs.access(preview);
    } catch {
      fail('missing preview: market/goofish/preview/index.html');
    }
  }

  for (const warning of warnings) console.warn(`WARN ${warning}`);
  if (failures.length) {
    console.error(`Goofish package check failed: ${failures.length} issue(s)`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }
  console.log(`Goofish package check passed: ${items.length} product(s), ${textOnly ? 'text only' : 'text and assets'}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
