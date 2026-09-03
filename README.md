# DSH 官网 + goofish 商品化与统一交付项目结构

这份文档说明三件事：

1. 官网和 goofish 怎么作为获客入口
2. DSH desktop 怎么作为统一交付底座
3. 后续目录怎么分层、怎么隔离能力包

核心判断很简单：

- 官网负责品牌和信任
- goofish 卖的是商品
- DSH desktop 提供统一交付
- 能力包必须独立目录、独立物料、独立测试、独立发布
- `连接器 / MCP` 属于底座能力，不单列产品
- `开发者 Agent` 不纳入当前版本

## 1. 项目总结构

| 层级 | 目标 | 产物 |
| --- | --- | --- |
| 官网层 | 建立信任、介绍能力、获取线索 | 首页、产品页、案例、交付说明、FAQ、联系入口 |
| goofish 商品层 | 单品引流、咨询、成交 | 商品名、标题、介绍、海报、详情页、FAQ |
| DSH desktop 统一交付层 | 完成交付、演示、复用 | 底座、能力包、导出、权限、审计 |
| 能力包层 | 按问题和场景交付 | 深度调研、数据分析、文档/报告生成、知识库、客服辅助、多模态工作台、专利、招投标、具身智能 |

## 2. 官网层

官网不是某一个能力包的详情页，而是所有能力包共用的品牌入口。

### 2.1 官网负责什么

- 说明 DSH 是什么
- 展示可交付的产品线
- 展示样例、案例和交付流程
- 承接企业咨询和定制需求
- 把访客导向 goofish 商品或人工沟通

### 2.2 官网页面

- 首页
- 产品总览
- 横向产品页
- 领域产品页
- 案例 / 样例
- 交付流程
- 价格 / 套餐
- FAQ
- 联系 / 留资

### 2.3 官网和能力包的关系

官网的产品页与能力包保持同名 slug：

- `website/deep-research/`
- `website/data-analysis/`
- `website/patent/`

官网只负责展示和获客，不放 DSH 底座实现细节。

## 3. goofish 商品层

goofish 上架时，不写内部能力名，写的是用户能听懂的结果。

### 3.1 商品命名原则

- 结果先行
- 单点问题
- 交付物明确
- 不写内部术语

### 3.2 标题模板

- `AI深度调研报告｜带引用｜可交付Word/PDF`
- `AI数据分析｜Excel/CSV清洗汇总｜出图表`
- `AI报告/PPT生成｜资料整理成稿`
- `AI知识库搭建｜企业文档问答`
- `AI客服辅助｜回复草稿+知识引用`
- `多模态资料处理｜PDF/图片/表格统一整理`

### 3.3 介绍结构

每个商品介绍都建议包含：

1. 你要解决什么问题
2. 你会收到什么交付
3. 需要你提供什么输入
4. 多久交付
5. 不包含什么
6. 是否支持复核和修改

### 3.4 海报结构

- 封面海报：结果 + 场景 + 交付形式
- 流程海报：输入 -> 处理 -> 输出
- 证据海报：样例截图、报告样例、表格样例

### 3.5 goofish 上架建议

第一批上架优先用最容易解释、最容易单次成交的商品：

1. 深度调研
2. 数据分析
3. 文档 / 报告生成
4. 多模态资料处理

知识库、客服辅助、专利、招投标、具身智能可以作为后续扩展和更高客单价商品。

## 4. DSH desktop 统一交付层

DSH desktop 不是商品本身，它是统一交付底座。

### 4.1 底座包含什么

- 桌面端主壳
- 证据底座
- 状态管理
- 权限和审计
- 导出能力
- `连接器 / MCP` 接入能力

### 4.2 底座不做什么

- 不把每个能力包塞进主壳
- 不把外部账号、密钥、登录态混进包里
- 不把一次性外部动作默认自动执行

### 4.3 交付方式

每个能力包都通过统一底座交付：

- 同一套桌面体验
- 同一套证据引用
- 同一套草稿/审核/发布状态
- 同一套导出格式
- 同一套日志和审计方式

## 5. 能力包设计

能力包不是功能堆积，而是“回答一类明确问题”的最小单元。

### 5.1 横向能力包

- 深度调研
- 数据分析
- 文档 / 报告生成
- 知识库
- 客服辅助
- 多模态工作台

### 5.2 领域能力包

- 专利
- 招投标
- 具身智能

### 5.3 包内标准输出

每个能力包都应该有：

- 输入说明
- 交付说明
- 证据来源
- 结果状态
- 失败说明
- 示例样本
- 测试样例

## 6. 目录设计

目录设计要同时满足两件事：

1. 有层次
2. 能隔离能力包

### 6.1 推荐顶层结构

```text
project/
  website/
    home/
    products/
    cases/
    delivery/
    pricing/
    faq/
    contact/
    deep-research/
    data-analysis/
    document-report/
    knowledge-base/
    customer-assist/
    multimodal-workbench/
    patent/
    bidding/
    embodied-intelligence/
  market/
    goofish/
      deep-research/
      data-analysis/
      document-report/
      knowledge-base/
      customer-assist/
      multimodal-workbench/
      patent/
      bidding/
      embodied-intelligence/
  desktop/
    dsh/
      core/
      packs/
      registry.md
```

### 6.2 官网目录

`website/` 只放官网前台内容，且与能力包同名：

```text
website/
  home/
  products/
  cases/
  delivery/
  pricing/
  faq/
  contact/
  deep-research/
  data-analysis/
  document-report/
  knowledge-base/
  customer-assist/
  multimodal-workbench/
  patent/
  bidding/
  embodied-intelligence/
```

官网公共页面放在 `home/`、`products/` 等目录；具体产品页使用能力包同名目录。

### 6.3 goofish 目录

`market/goofish/` 只放商品包装物料，且与后台能力包同名：

```text
market/goofish/
  deep-research/
  data-analysis/
  document-report/
  knowledge-base/
  customer-assist/
  multimodal-workbench/
  patent/
  bidding/
  embodied-intelligence/
```

这里的内容只负责“怎么卖”，不放桌面底座实现细节。

### 6.4 DSH desktop 目录

`desktop/dsh/` 只放统一交付底座和能力包：

```text
desktop/dsh/
  core/
    evidence/
    permissions/
    audit/
    export/
    connectors/
  packs/
    horizontal/
      deep-research/
      data-analysis/
      document-report/
      knowledge-base/
      customer-assist/
      multimodal-workbench/
    vertical/
      patent/
      bidding/
      embodied-intelligence/
  registry.md
```

### 6.5 前台和后台一一对应

官网产品目录、goofish 商品目录都对应一个后台能力包目录：

- `website/deep-research/` 与 `market/goofish/deep-research/` 对应 `desktop/dsh/packs/horizontal/deep-research/`
- `website/data-analysis/` 与 `market/goofish/data-analysis/` 对应 `desktop/dsh/packs/horizontal/data-analysis/`
- `website/document-report/` 与 `market/goofish/document-report/` 对应 `desktop/dsh/packs/horizontal/document-report/`
- `website/knowledge-base/` 与 `market/goofish/knowledge-base/` 对应 `desktop/dsh/packs/horizontal/knowledge-base/`
- `website/customer-assist/` 与 `market/goofish/customer-assist/` 对应 `desktop/dsh/packs/horizontal/customer-assist/`
- `website/multimodal-workbench/` 与 `market/goofish/multimodal-workbench/` 对应 `desktop/dsh/packs/horizontal/multimodal-workbench/`
- `website/patent/` 与 `market/goofish/patent/` 对应 `desktop/dsh/packs/vertical/patent/`
- `website/bidding/` 与 `market/goofish/bidding/` 对应 `desktop/dsh/packs/vertical/bidding/`
- `website/embodied-intelligence/` 与 `market/goofish/embodied-intelligence/` 对应 `desktop/dsh/packs/vertical/embodied-intelligence/`

### 6.6 单个能力包目录

每个包都保持同样的内部骨架：

```text
desktop/dsh/packs/<pack-name>/
  manifest.md
  scope.md
  workflow.md
  inputs/
  outputs/
  prompts/
  adapters/
  schemas/
  samples/
  tests/
  assets/
  release-notes.md
```

### 6.7 隔离规则

- 一个包一个目录
- 一个包一套测试
- 一个包一套样例
- 一个包一套说明
- 公共能力只放在 `core/`
- 包与包之间不直接互相依赖
- 跨包复用只能通过 `core/` 或明确的接口

### 6.8 层次规则

- `website/` 是品牌和获客前台
- `market/goofish/` 是商品成交前台
- `desktop/` 是交付底座
- `packs/` 是能力包
- `core/` 是共用底座
- `horizontal/` 和 `vertical/` 是能力包分组

## 7. 开发顺序

建议首批并行推进：

1. 官网壳
2. goofish 商品页
3. DSH desktop 底座骨架
4. 深度调研
5. 数据分析
6. 文档 / 报告生成

第二批再补：

1. 知识库
2. 客服辅助
3. 多模态工作台

第三批再补：

1. 专利
2. 招投标
3. 具身智能

## 8. 最终判断

这个项目不是“先做一堆能力再找商品名”，而是：

1. 先用官网建立信任和品牌入口
2. 用 goofish 商品承接单次需求和成交
3. 用 DSH desktop 作为统一交付底座
4. 把能力包按层次放进目录里，并保持彼此隔离
