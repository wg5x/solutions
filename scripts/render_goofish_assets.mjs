import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { items } from './goofish_data.mjs';

const require = createRequire(import.meta.url);
const sharp = require('/Users/wgxxx/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const root = path.resolve(process.cwd(), 'market/goofish');
const width = 1080;
const height = 1440;
const forbidden = [
  /(?:¥|￥|\b\d+(?:\.\d+)?\s*元\b)/,
  /折扣|优惠|满减|低至|券/,
  /(?:电话|手机|手机号|邮箱|二维码|微信|QQ|Telegram|WhatsApp|站外|外部链接|URL)/i,
  /https?:\/\/\S+/i,
];

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function wrap(text, limit = 18) {
  const chars = [...String(text)];
  const lines = [];
  for (let index = 0; index < chars.length; index += limit) {
    lines.push(chars.slice(index, index + limit).join(''));
  }
  return lines.length ? lines : [''];
}

function textLines(text, x, y, options = {}) {
  const {
    size = 42,
    weight = 500,
    color = '#111827',
    limit = 18,
    lineHeight = Math.round(size * 1.35),
    anchor = 'start',
  } = options;
  return wrap(text, limit)
    .map((line, index) => `<text x="${x}" y="${y + index * lineHeight}" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${escapeXml(line)}</text>`)
    .join('');
}

function rect(x, y, w, h, fill, radius = 24, stroke = 'none') {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${radius}" fill="${fill}" stroke="${stroke}"/>`;
}

function header(item, number, label) {
  return [
    `<text x="84" y="96" font-size="30" font-weight="800" letter-spacing="3" fill="${item.color}">DSH</text>`,
    `<text x="996" y="96" font-size="24" font-weight="700" fill="#9ca3af" text-anchor="end">${number} / 04</text>`,
    `<text x="84" y="166" font-size="22" font-weight="700" fill="#6b7280">${escapeXml(label)}</text>`,
    `<line x1="84" y1="198" x2="996" y2="198" stroke="#e5e7eb" stroke-width="2"/>`,
  ].join('');
}

function footer(item) {
  return [
    `<line x1="84" y1="1322" x2="996" y2="1322" stroke="#e5e7eb" stroke-width="2"/>`,
    `<text x="84" y="1372" font-size="20" fill="#6b7280">${escapeXml(item.name)}</text>`,
    `<circle cx="972" cy="1364" r="8" fill="${item.color}"/>`,
  ].join('');
}

function base(item, content) {
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<rect width="${width}" height="${height}" fill="#f8fafc"/>`,
    `<rect x="24" y="24" width="1032" height="1392" rx="34" fill="#ffffff" stroke="#e5e7eb" stroke-width="2"/>`,
    `<circle cx="920" cy="360" r="210" fill="${item.color}" opacity="0.06"/>`,
    content,
    `</svg>`,
  ].join('');
}

function cover(item) {
  const title = wrap(item.name, 9);
  const titleSvg = title.map((line, index) => (
    `<text x="84" y="${360 + index * 92}" font-size="74" font-weight="800" fill="#111827">${escapeXml(line)}</text>`
  )).join('');
  const chips = item.inputs.slice(0, 4).map((input, index) => {
    const x = 84 + (index % 2) * 436;
    const y = 768 + Math.floor(index / 2) * 76;
    return `${rect(x, y, 390, 52, '#f1f5f9', 26)}<text x="${x + 24}" y="${y + 35}" font-size="24" fill="#475569">${escapeXml(input)}</text>`;
  }).join('');
  return base(item, [
    header(item, '01', '结果先行'),
    titleSvg,
    textLines(item.summary, 84, 570, { size: 34, color: '#475569', limit: 25, lineHeight: 52 }),
    `<rect x="84" y="690" width="110" height="6" fill="${item.color}"/>`,
    `<text x="84" y="746" font-size="22" font-weight="700" fill="${item.color}">适合资料型需求</text>`,
    chips,
    footer(item),
  ].join(''));
}

function deliverables(item) {
  const cards = item.deliverables.map((deliverable, index) => {
    const x = 84 + (index % 2) * 436;
    const y = 300 + Math.floor(index / 2) * 274;
    const number = String(index + 1).padStart(2, '0');
    return [
      rect(x, y, 390, 220, '#f8fafc', 26, '#e5e7eb'),
      `<text x="${x + 32}" y="${y + 54}" font-size="24" font-weight="800" fill="${item.color}">${number}</text>`,
      textLines(deliverable, x + 32, y + 112, { size: 34, weight: 700, limit: 10, lineHeight: 46 }),
      `<line x1="${x + 32}" y1="${y + 174}" x2="${x + 126}" y2="${y + 174}" stroke="${item.color}" stroke-width="5"/>`,
    ].join('');
  }).join('');
  return base(item, [
    header(item, '02', '交付物'),
    `<text x="84" y="292" font-size="46" font-weight="800" fill="#111827">你会收到什么</text>`,
    `<text x="84" y="352" font-size="26" fill="#64748b">范围先确认，结果再交付</text>`,
    cards,
    footer(item),
  ].join(''));
}

function workflow(item) {
  const steps = item.workflow.split(' -> ');
  const stepSvg = steps.map((step, index) => {
    const y = 360 + index * 160;
    const circle = `<circle cx="142" cy="${y}" r="34" fill="${item.color}"/>`;
    const number = `<text x="142" y="${y + 9}" font-size="24" font-weight="800" fill="#ffffff" text-anchor="middle">${index + 1}</text>`;
    const connector = index < steps.length - 1
      ? `<line x1="142" y1="${y + 36}" x2="142" y2="${y + 124}" stroke="${item.color}" stroke-width="3" stroke-dasharray="8 10" opacity="0.55"/>`
      : '';
    return [
      connector,
      circle,
      number,
      `<text x="218" y="${y + 10}" font-size="36" font-weight="700" fill="#111827">${escapeXml(step)}</text>`,
    ].join('');
  }).join('');
  return base(item, [
    header(item, '03', '服务流程'),
    `<text x="84" y="292" font-size="46" font-weight="800" fill="#111827">从资料到结果</text>`,
    `<text x="84" y="352" font-size="26" fill="#64748b">每一步都有人工确认节点</text>`,
    stepSvg,
    footer(item),
  ].join(''));
}

function boundaries(item) {
  const inputs = item.inputs.slice(0, 5);
  const exclusions = item.exclusions.slice(0, 4);
  const inputSvg = inputs.map((value, index) => (
    `<text x="132" y="${520 + index * 58}" font-size="26" fill="#334155">• ${escapeXml(value)}</text>`
  )).join('');
  const exclusionSvg = exclusions.map((value, index) => (
    `<text x="592" y="${520 + index * 58}" font-size="26" fill="#334155">• ${escapeXml(value.replace(/^不/, ''))}</text>`
  )).join('');
  return base(item, [
    header(item, '04', '输入与边界'),
    `<text x="84" y="292" font-size="46" font-weight="800" fill="#111827">先把范围说清楚</text>`,
    `<text x="84" y="352" font-size="26" fill="#64748b">资料越完整，交付越顺畅</text>`,
    rect(84, 390, 390, 430, '#f8fafc', 26, '#e5e7eb'),
    rect(546, 390, 450, 430, '#f8fafc', 26, '#e5e7eb'),
    `<text x="132" y="458" font-size="30" font-weight="800" fill="${item.color}">需要提供</text>`,
    inputSvg,
    `<text x="594" y="458" font-size="30" font-weight="800" fill="${item.color}">交付边界</text>`,
    exclusionSvg,
    `<text x="84" y="930" font-size="30" font-weight="700" fill="#111827">人工确认：</text>`,
    textLines(item.manualReview, 84, 976, { size: 28, weight: 500, color: '#111827', limit: 28, lineHeight: 40 }),
    footer(item),
  ].join(''));
}

function assertSafeText(text, label) {
  for (const pattern of forbidden) {
    if (pattern.test(text)) {
      throw new Error(`${label} contains image-forbidden text: ${pattern}`);
    }
  }
}

async function writeImage(item, name, svg) {
  const output = path.join(root, item.slug, 'assets', name);
  await sharp(Buffer.from(svg)).png().toFile(output);
}

function previewHtml() {
  const sections = items.map((item) => {
    const images = [
      ['01-cover.png', '封面'],
      ['02-deliverables.png', '交付物'],
      ['03-workflow.png', '流程'],
      ['04-inputs-and-boundaries.png', '输入与边界'],
    ].map(([file, label]) => (
      `<figure><img src="../${item.slug}/assets/${file}" alt="${escapeXml(item.name)} ${label}"><figcaption>${escapeXml(label)}</figcaption></figure>`
    )).join('');
    return `<section><h2>${escapeXml(item.name)}</h2><p class="status">${escapeXml(item.status)}</p><div class="grid">${images}</div></section>`;
  }).join('');
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>DSH 闲鱼商品视觉预览</title>
<style>
  :root { color-scheme: light; font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Noto Sans CJK SC", sans-serif; background: #eef2f6; color: #111827; }
  body { max-width: 1540px; margin: 0 auto; padding: 32px; }
  h1 { margin: 0 0 8px; font-size: 30px; }
  .intro { color: #64748b; margin: 0 0 36px; }
  section { margin: 0 0 48px; }
  h2 { display: inline-block; margin: 0 12px 18px 0; font-size: 24px; }
  .status { display: inline-block; padding: 5px 10px; background: #fff; border: 1px solid #dbe3ea; border-radius: 999px; color: #64748b; font-size: 13px; }
  .grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 18px; }
  figure { margin: 0; }
  img { display: block; width: 100%; height: auto; border-radius: 16px; box-shadow: 0 12px 32px rgba(15, 23, 42, .12); background: white; }
  figcaption { margin-top: 8px; color: #64748b; font-size: 13px; }
  @media (max-width: 1000px) { .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (max-width: 560px) { body { padding: 18px; } .grid { grid-template-columns: 1fr; } }
</style>
</head>
<body>
<h1>DSH 闲鱼商品视觉预览</h1>
<p class="intro">共 9 个商品、36 张图片。图片只表达结果、交付、流程和边界。</p>
${sections}
</body>
</html>`;
}

async function main() {
  for (const item of items) {
    await fs.mkdir(path.join(root, item.slug, 'assets'), { recursive: true });
    const safeInputs = [
      item.name,
      item.summary,
      item.cover,
      item.imageDeliverables,
      item.workflow,
      item.boundaries,
      item.manualReview,
      ...item.inputs,
      ...item.deliverables,
      ...item.exclusions,
    ];
    for (const value of safeInputs) {
      assertSafeText(value, `${item.slug} text`);
    }
    await writeImage(item, '01-cover.png', cover(item));
    await writeImage(item, '02-deliverables.png', deliverables(item));
    await writeImage(item, '03-workflow.png', workflow(item));
    await writeImage(item, '04-inputs-and-boundaries.png', boundaries(item));
  }
  await fs.mkdir(path.join(root, 'preview'), { recursive: true });
  await fs.writeFile(path.join(root, 'preview', 'index.html'), previewHtml());
  console.log(`Rendered ${items.length * 4} PNG assets.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
