# DSH 闲鱼商品层实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `/Users/wgxxx/solutions` 中落地 9 个可人工复制到闲鱼发布页的 DSH 商品包，包含发布字段、价格规格、交易边界、咨询话术、FAQ、检查清单和 36 张不含价格的 PNG 视觉物料。

**Architecture:** `market/goofish/shared/` 保存品牌、语言和平台边界；`market/goofish/<slug>/` 保存每个商品独立的上架资料和 4 张图片。文本资料是唯一的商品口径来源，图片只复述结果、交付和流程，不承载价格。用本地渲染脚本生成统一版式图片，用校验脚本检查目录、必备字段、敏感内容、价格入图风险和图片尺寸；不做闲鱼自动发布或账号操作。

**Tech Stack:** Markdown、Node.js、Playwright Chromium、本地 PNG 生成、Node.js 标准库校验脚本、Git。

---

## 文件结构与职责

### 公共资料

- Create: `market/goofish/README.md`
  - 商品层使用说明、上架顺序、状态口径和文件导航。
- Create: `market/goofish/catalog.md`
  - 9 个商品的名称、slug、首选标题、建议类目、价格表、状态和上架顺序。
- Create: `market/goofish/publish-checklist.md`
  - 发布页字段映射、图片上传顺序、文字审查、人工确认和发布后复核。
- Create: `market/goofish/shared/brand.md`
  - DSH 品牌文字、统一视觉语气、图片页眉和页脚规则。
- Create: `market/goofish/shared/image-guidelines.md`
  - PNG 尺寸、4 图结构、图片禁用内容、版式和视觉检查方法。
- Create: `market/goofish/shared/language-rules.md`
  - 可用表达、禁止承诺、AI 输出边界、隐私和站外导流规则。
- Create: `market/goofish/shared/common-faq.md`
  - 所有商品共用的资料、隐私、交付、修改和售后回答。
- Create: `market/goofish/shared/common-chat-script.md`
  - 首次接待、需求采集、规格确认、资料确认和交付确认话术。

### 商品资料

以下 9 个目录分别创建同样的 6 个文件：

- `listing.md`：可直接复制到发布页的商品字段和完整描述。
- `pricing.md`：三档规格、价格、边界和报价变更记录区。
- `image-copy.md`：4 张图的准确文字、构图和不放价格声明。
- `faq.md`：商品专属 FAQ。
- `chat-script.md`：商品专属私聊话术。
- `publish-checklist.md`：该商品发布前的逐项检查表。

商品目录：

- `market/goofish/deep-research/`
- `market/goofish/data-analysis/`
- `market/goofish/document-report/`
- `market/goofish/knowledge-base/`
- `market/goofish/customer-assist/`
- `market/goofish/multimodal-workbench/`
- `market/goofish/patent/`
- `market/goofish/bidding/`
- `market/goofish/embodied-intelligence/`

每个商品还创建：

- `assets/01-cover.png`
- `assets/02-deliverables.png`
- `assets/03-workflow.png`
- `assets/04-inputs-and-boundaries.png`

### 校验与渲染

- Create: `scripts/render_goofish_assets.mjs`
  - 使用固定 1080x1440 画布、DSH 统一母版和每个商品的 4 图文案生成 PNG。
  - 只读取商品目录中的 `image-copy.md` 和渲染配置，不读取网络、不嵌入价格、不嵌入联系方式。
  - 同时生成 `market/goofish/preview/index.html`，用于浏览器快速检查 36 张图。
- Create: `scripts/check_goofish_package.mjs`
  - 检查 9 个目录、每个必备文件、必备标题、价格字段、状态字段、4 张 PNG、PNG 尺寸和文本禁用模式。
  - 对 `image-copy.md` 执行价格、电话、二维码、URL、站外平台词扫描。
  - 如果本机有 `tesseract`，对 PNG 做 OCR 后执行同一组扫描；没有 OCR 工具时仍完成源文案和图片尺寸检查，并在报告中明确视觉 OCR 未执行。
- Create: `reports/goofish-package-qa-2026-09-03.md`
  - 记录最终文件数量、每个商品状态、校验结果、人工确认项和未执行的验证项。

## 商品口径矩阵

实施时使用以下首版口径；价格只写在 `listing.md` 和 `pricing.md`，不能写入 `image-copy.md` 或 PNG。

| slug | 商品显示名 | 标准标题 | 引流款 | 标准款 | 深度款 | 初始状态 |
|---|---|---|---:|---:|---:|---|
| `deep-research` | AI 深度调研报告 | AI深度调研报告｜带引用｜可交付Word/PDF | 99 元 | 399 元 | 999 元 | `material-ready` |
| `data-analysis` | AI 数据分析 | AI数据分析｜Excel/CSV清洗汇总｜出图表 | 99 元 | 399 元 | 999 元 | `material-ready` |
| `document-report` | AI 报告 / PPT 生成 | AI报告/PPT生成｜资料整理成稿 | 99 元 | 299 元 | 699 元 | `material-ready` |
| `knowledge-base` | 企业文档知识库 | AI知识库搭建｜企业文档问答 | 299 元 | 999 元 | 2999 元 | `capability-review` |
| `customer-assist` | AI 客服辅助 | AI客服辅助｜回复草稿+知识引用 | 299 元 | 999 元 | 1999 元 | `capability-review` |
| `multimodal-workbench` | 多模态资料处理 | 多模态资料处理｜PDF/图片/表格统一整理 | 99 元 | 399 元 | 999 元 | `capability-review` |
| `patent` | 专利资料辅助 | 专利资料整理｜检索分析｜交底书辅助 | 499 元 | 1499 元 | 3999 元 | `capability-review` |
| `bidding` | 招投标资料辅助 | 招投标资料整理｜资格匹配｜响应文件辅助 | 499 元 | 1999 元 | 4999 元 | `capability-review` |
| `embodied-intelligence` | 具身智能方案辅助 | 具身智能方案资料整理｜技术路线与资料分析 | 999 元 | 2999 元 | 6999 元 | `hold` |

状态含义必须在商品资料中保留：

- `material-ready`：文字和图片物料完整，不代表闲鱼页面已经发布。
- `capability-review`：物料完整，但实际交付能力、样例或服务范围仍需人工确认。
- `manual-publish-check`：能力和物料已确认，仍需在当前账号发布页核对类目和字段。
- `hold`：不应直接发布，只保留为需求收集和人工评估草案。

## Task 1: 建立公共商品层与可重复校验

**Files:**
- Create: `market/goofish/README.md`
- Create: `market/goofish/catalog.md`
- Create: `market/goofish/publish-checklist.md`
- Create: `market/goofish/shared/brand.md`
- Create: `market/goofish/shared/image-guidelines.md`
- Create: `market/goofish/shared/language-rules.md`
- Create: `market/goofish/shared/common-faq.md`
- Create: `market/goofish/shared/common-chat-script.md`
- Create: `scripts/check_goofish_package.mjs`
- Modify: `.gitignore`

- [ ] **Step 1: 创建公共商品目录和文件**

  在 `market/goofish/` 下建立 `shared/` 和 9 个商品目录；公共资料中写明以下固定规则：DSH 只作为品牌文字使用；图片不出现价格、折扣、联系方式、二维码、URL、站外平台词、虚构销量、虚构评价和未授权素材；商品默认通过平台内聊天沟通；外部发布、提交、签章、购买、付款和中标/授权/验收保证不属于默认交付。

- [ ] **Step 2: 写入发布页字段映射**

  在 `market/goofish/publish-checklist.md` 中按发布顺序列出：商品标题、类目、商品类型、价格、库存/接单数量、所在地或服务范围、商品描述、图片顺序、交付方式、交付周期、修改次数、买家资料、排除项和发布后人工复核。对账号实际未显示的字段，规定将对应内容放入商品描述，不硬编码无法确认的后台字段名或平台限制。

- [ ] **Step 3: 实现校验脚本**

  `scripts/check_goofish_package.mjs` 必须执行以下检查并以非零状态退出：

  - 9 个 slug 目录全部存在。
  - 每个商品包含 `listing.md`、`pricing.md`、`image-copy.md`、`faq.md`、`chat-script.md`、`publish-checklist.md`。
  - `listing.md` 同时出现商品名、标题候选、价格/规格、交付物、输入资料、交付周期、修改、排除项、人工确认和状态。
  - `pricing.md` 同时出现引流款、标准款、深度款及人民币价格。
  - `image-copy.md` 不出现人民币价格、折扣词、手机号、邮箱、URL、二维码、微信/QQ/Telegram/WhatsApp 等站外联系方式。
  - 每个 `assets/` 包含 4 个规定文件，且每张 PNG 为 1080x1440。
  - 任何 Markdown 文案不出现真实联系方式、密钥样式、`http://`、`https://`、二维码或虚构保证性承诺。

- [ ] **Step 4: 增加生成目录到忽略规则**

  只忽略本地预览缓存，不忽略 `market/goofish/**`、PNG、校验脚本或 QA 报告；`.gitignore` 中加入 `market/goofish/preview/.cache/`。

- [ ] **Step 5: 运行基础校验并确认预期失败**

  运行：

  ```bash
  node scripts/check_goofish_package.mjs
  ```

  预期：命令因为 9 个商品资料尚未创建而失败，并列出缺失目录；这确认校验脚本没有把空目录误判为完整商品层。

- [ ] **Step 6: 提交公共层**

  ```bash
  git add market/goofish scripts/check_goofish_package.mjs .gitignore
  git commit -m "feat: add goofish product layer foundation"
  ```

## Task 2: 完成首批 4 个可上架商品

**Files:**
- Create: `market/goofish/deep-research/{listing,pricing,image-copy,faq,chat-script,publish-checklist}.md`
- Create: `market/goofish/data-analysis/{listing,pricing,image-copy,faq,chat-script,publish-checklist}.md`
- Create: `market/goofish/document-report/{listing,pricing,image-copy,faq,chat-script,publish-checklist}.md`
- Create: `market/goofish/multimodal-workbench/{listing,pricing,image-copy,faq,chat-script,publish-checklist}.md`

- [ ] **Step 1: 写深度调研商品**

  `listing.md` 以“主题资料整理成带来源的 Word/PDF 调研报告”为结果；套餐分别限制研究问题数量、来源范围、页数/章节和修改次数；要求买家提供主题、目标读者、时间范围、指定来源和输出格式；明确不承诺实时完整、投资结论、法律意见或外部发布。

- [ ] **Step 2: 写数据分析商品**

  `listing.md` 以“Excel/CSV 清洗、汇总和图表输出”为结果；要求买家提供原始表格、字段含义、目标指标、口径、样例结果和脱敏要求；明确不包含财务审计、统计显著性结论、数据源真实性背书和系统上线。

- [ ] **Step 3: 写文档 / 报告生成商品**

  `listing.md` 以“把已有资料整理成报告或 PPT 初稿”为结果；要求买家提供资料、受众、目录偏好、品牌素材和格式要求；明确交付的是初稿或整理稿，不承诺事实核验、演讲效果、审批通过或自动发送。

- [ ] **Step 4: 写多模态资料处理商品**

  `listing.md` 以“PDF、图片、表格和文字资料统一提取、归类和摘要”为结果；要求买家提供文件、目标目录、字段和输出格式；明确扫描质量、手写内容、损坏文件、加密文件和版权资料可能影响结果。

- [ ] **Step 5: 为每个商品写 4 图文案**

  每个 `image-copy.md` 固定 4 个画面：封面结果、交付物示例、处理流程、输入与边界。文案中不出现任何价格、折扣、联系方式、二维码、URL 或站外平台名。

- [ ] **Step 6: 为每个商品写 FAQ、话术和检查表**

  FAQ 至少回答适用对象、买家资料、交付格式、周期、修改、隐私、退款/取消边界和不包含内容；话术必须覆盖首次接待、需求采集、规格推荐、资料确认和交付确认；检查表必须复核标题、价格字段、图片顺序、描述边界和敏感信息。

- [ ] **Step 7: 运行文字校验**

  运行：

  ```bash
  node scripts/check_goofish_package.mjs --text-only
  ```

  预期：4 个商品的文字资料检查通过；若失败，只修复缺失字段或禁用词，不改变公共商品层规则。

- [ ] **Step 8: 提交首批商品资料**

  ```bash
  git add market/goofish/deep-research market/goofish/data-analysis market/goofish/document-report market/goofish/multimodal-workbench
  git commit -m "feat: add first goofish listing packages"
  ```

## Task 3: 完成知识库、客服辅助和多模态扩展商品

**Files:**
- Create: `market/goofish/knowledge-base/{listing,pricing,image-copy,faq,chat-script,publish-checklist}.md`
- Create: `market/goofish/customer-assist/{listing,pricing,image-copy,faq,chat-script,publish-checklist}.md`
- Modify: `market/goofish/catalog.md`

- [ ] **Step 1: 写企业文档知识库商品**

  以“企业文档整理、检索和引用式问答方案”为结果；套餐区分资料量、知识主题数、初始化整理和问答演示；要求提供文档目录、权限边界、更新频率和目标问题；明确不默认包含公网部署、账号开通、无限更新、自动删除原文和无依据回答。

- [ ] **Step 2: 写 AI 客服辅助商品**

  以“基于企业资料生成回复草稿和来源提示”为结果；要求提供 FAQ、产品资料、服务规则、典型问答和升级人工条件；明确不自动发送、不承诺完全替代人工、不处理未授权客户个人信息、不保证平台审核通过。

- [ ] **Step 3: 更新商品目录状态**

  将 `knowledge-base` 和 `customer-assist` 标为 `capability-review`，并在目录中写明发布前需要确认的知识库接入、资料权限、回复审核和实际交付方式。

- [ ] **Step 4: 运行文字校验并提交**

  运行：

  ```bash
  node scripts/check_goofish_package.mjs --text-only
  ```

  预期：前 6 个商品的文字资料通过，知识库和客服商品的能力状态必须仍是 `capability-review`。

  ```bash
  git add market/goofish/knowledge-base market/goofish/customer-assist market/goofish/catalog.md
  git commit -m "feat: add knowledge and customer assist listings"
  ```

## Task 4: 完成专利、招投标和具身智能领域商品

**Files:**
- Create: `market/goofish/patent/{listing,pricing,image-copy,faq,chat-script,publish-checklist}.md`
- Create: `market/goofish/bidding/{listing,pricing,image-copy,faq,chat-script,publish-checklist}.md`
- Create: `market/goofish/embodied-intelligence/{listing,pricing,image-copy,faq,chat-script,publish-checklist}.md`
- Modify: `market/goofish/catalog.md`

- [ ] **Step 1: 写专利资料辅助商品**

  以“专利资料整理、公开资料检索和交底书辅助草稿”为结果；要求提供技术主题、已有资料、检索范围和目标输出；明确不提供专利代理、法律意见、授权保证、侵权结论或代替代理机构签署提交。

- [ ] **Step 2: 写招投标资料辅助商品**

  以“招标文件解析、资格匹配、响应矩阵和文档初稿辅助”为结果；要求提供招标文件、企业资质、项目边界、截止时间和响应格式；明确不承诺中标、不伪造资质、不代签章、不自动提交、不替代项目负责人最终审核。

- [ ] **Step 3: 写具身智能方案辅助商品**

  以“机器人 / 具身智能需求资料整理、技术路线对比和方案草稿辅助”为结果；要求提供场景、对象、环境、传感器、算力、动作目标、约束和验证指标；明确不构成工程设计、安全认证、现场调试、设备采购或量产保证。

- [ ] **Step 4: 设置领域商品状态**

  将 `patent` 和 `bidding` 标为 `capability-review`，将 `embodied-intelligence` 标为 `hold`；三者都必须在标题和图片之外的文字资料中保留“辅助 / 草稿 / 人工确认”边界。

- [ ] **Step 5: 运行文字校验并提交**

  运行：

  ```bash
  node scripts/check_goofish_package.mjs --text-only
  ```

  预期：9 个商品的文字资料字段通过；输出中同时显示 `capability-review` 和 `hold`，不允许脚本把它们自动改成可发布状态。

  ```bash
  git add market/goofish/patent market/goofish/bidding market/goofish/embodied-intelligence market/goofish/catalog.md
  git commit -m "feat: add domain goofish listings"
  ```

## Task 5: 生成 36 张无价格视觉物料和浏览器预览

**Files:**
- Create: `scripts/render_goofish_assets.mjs`
- Create: `market/goofish/preview/index.html`
- Create: `market/goofish/<slug>/assets/01-cover.png`
- Create: `market/goofish/<slug>/assets/02-deliverables.png`
- Create: `market/goofish/<slug>/assets/03-workflow.png`
- Create: `market/goofish/<slug>/assets/04-inputs-and-boundaries.png`

- [ ] **Step 1: 固定视觉母版**

  渲染器使用 1080x1440 画布、DSH 文字标识、白色主背景、黑色正文、每个商品一个主题色、四边留白和移动端可读字号。图片不使用价格、折扣、优惠、联系方式、二维码、URL、外部品牌或虚构证明。

- [ ] **Step 2: 定义四种图片布局**

  - 封面：DSH、用户问题、结果标题、适用资料类型。
  - 交付物：报告 / 表格 / 图表 / 知识库 / 草稿等实际交付形态。
  - 流程：资料接收 -> 整理分析 -> 人工复核 -> 文件交付。
  - 输入与边界：需要的资料、人工确认、修改和不包含项。

- [ ] **Step 3: 让渲染器拒绝价格和站外信息**

  在生成 PNG 前，对每张图的渲染文本执行正则检查：人民币符号和“元”、折扣词、手机号、邮箱、URL、二维码、微信、QQ、Telegram、WhatsApp、私聊外部平台词均触发失败；失败时不写出 PNG。

- [ ] **Step 4: 生成 36 张 PNG**

  运行：

  ```bash
  node scripts/render_goofish_assets.mjs
  ```

  预期：生成 9 个商品目录各 4 张 PNG，每张尺寸为 1080x1440；生成 `market/goofish/preview/index.html`，按商品和图片顺序展示全部资产。

- [ ] **Step 5: 启动本地预览并做视觉检查**

  通过本地静态服务打开 `market/goofish/preview/index.html`，逐个检查：

  - DSH 标识、标题和正文没有被裁切。
  - 图片 1 到 4 的顺序符合商品文案。
  - 价格没有出现在任何图片。
  - 文字没有重叠，移动端缩放后仍能读。
  - 专利、招投标和具身智能图片没有保证性承诺。

- [ ] **Step 6: 提交视觉物料**

  ```bash
  git add scripts/render_goofish_assets.mjs market/goofish/*/assets market/goofish/preview
  git commit -m "feat: add goofish listing visuals"
  ```

## Task 6: 完成全量校验、人工发布审查和 QA 报告

**Files:**
- Modify: `scripts/check_goofish_package.mjs`
- Create: `reports/goofish-package-qa-2026-09-03.md`
- Modify: `market/goofish/catalog.md`
- Modify: `market/goofish/publish-checklist.md`

- [ ] **Step 1: 增加图片和文本全量检查**

  默认运行：

  ```bash
  node scripts/check_goofish_package.mjs
  ```

  检查目录、必备文件、标题候选、价格规格、交付边界、状态、PNG 尺寸、图片源文案禁用词和 Markdown 敏感信息。若系统存在 `tesseract`，额外对 PNG OCR；若不存在，报告写明未进行 OCR，不伪造通过结果。

- [ ] **Step 2: 运行最终校验**

  运行：

  ```bash
  node scripts/check_goofish_package.mjs
  git diff --check
  rg -n "TBD|TODO|待定|占位|手机号|二维码|https?://|微信|QQ|Telegram|WhatsApp" market/goofish reports
  find market/goofish -type f | sort
  ```

  预期：校验脚本返回成功；`rg` 只允许命中规则说明中对禁用内容的描述，不允许命中实际商品字段、图片文案或图片源；文件清单包含 9 个商品目录、每个 6 个文字文件和 4 个 PNG。

- [ ] **Step 3: 写 QA 报告**

  报告必须记录：

  - 9 个商品各自的状态和建议上架顺序。
  - 36 张 PNG 的尺寸和生成结果。
  - 是否完成 OCR；未完成时写明原因。
  - 价格只存在于商品字段和价格文件的检查结果。
  - 账号实际发布页仍需人工确认的类目、服务类型、库存、所在地和其他动态字段。
  - `capability-review` 和 `hold` 商品不能直接发布的原因。

- [ ] **Step 4: 更新目录和总检查表**

  将最终校验时间、文件数量和状态摘要写入 `catalog.md`；将图片顺序、价格不入图、敏感信息和动态发布字段人工确认写入总检查表。

- [ ] **Step 5: 提交 QA 资料**

  ```bash
  git add scripts/check_goofish_package.mjs reports market/goofish/catalog.md market/goofish/publish-checklist.md
  git commit -m "test: verify goofish product package"
  ```

## Final Verification

- [ ] `node scripts/check_goofish_package.mjs` 返回成功。
- [ ] 9 个商品目录全部存在。
- [ ] 每个商品有 6 个 Markdown 文件和 4 个 PNG 文件。
- [ ] 每张 PNG 为 1080x1440，且视觉检查通过。
- [ ] 图片不包含价格、折扣、联系方式、二维码、URL 或站外导流。
- [ ] 每个商品有可复制标题、价格规格、完整描述、输入资料、交付周期、修改规则、排除项、FAQ、咨询话术和检查表。
- [ ] 领域商品的法律、投标、工程和安全边界清楚。
- [ ] `capability-review` 和 `hold` 状态没有被误报为可立即发布。
- [ ] QA 报告明确说明动态发布字段和未完成的外部验证。
