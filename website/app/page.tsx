'use client';

import { FormEvent, useState } from 'react';

const solutions = [
  {
    key: '横向能力',
    title: '把 AI 从试用变成生产力',
    description:
      '围绕企业真实任务，把知识、流程、模型和权限组织成可复用的智能工作单元。',
    items: [
      ['深度调研', '带引用的研究报告、竞品扫描与行业洞察'],
      ['数据分析', 'Excel / CSV 清洗、分析、图表与经营摘要'],
      ['文档报告', '从资料包到 Word、PDF、PPT 的结构化交付'],
    ],
  },
  {
    key: '行业方案',
    title: '让方案贴近业务现场',
    description:
      '从行业问题出发设计 Agent，让一线团队看到可执行的流程，而不是一组抽象能力。',
    items: [
      ['教育', '教研、批改、学情分析与个性化教学支持'],
      ['制造', '研发辅助、产能预测、工单流转与风险预警'],
      ['内容与电商', '选品、脚本、客服、投放与运营增长辅助'],
    ],
  },
];

const cases = [
  {
    type: '制造业',
    title: '把研发资料变成可检索、可协作的工程知识',
    result: '资料查找从“问人”变成“问系统”',
    detail: '统一接入制度、图纸、工艺与历史项目资料，形成带出处的工程问答和方案辅助。',
    color: 'blue',
  },
  {
    type: '教育业',
    title: '让教研团队拥有一套可复用的教学助手',
    result: '批改、分析、备课进入同一条流程',
    detail: '从题库、讲义和学情数据中提炼个性化建议，把老师的时间还给课堂。',
    color: 'orange',
  },
  {
    type: '内容与电商',
    title: '从选题到发布，建立内容生产流水线',
    result: '创意、素材、文案与复盘统一管理',
    detail: '把分散在表格、文档和工具里的任务串起来，形成可追踪、可迭代的运营闭环。',
    color: 'green',
  },
];

const deliverySteps = [
  ['01', '梳理问题', '从目标、角色、资料和流程入手，确认要交付的结果。'],
  ['02', '设计方案', '把知识、模型、工具和审批边界组织成可执行的 Agent 流程。'],
  ['03', '小范围验证', '用真实样本验证准确性、可控性和使用体验，及时收敛。'],
  ['04', '持续运营', '交付可复用的工作台、说明和样例，支持后续迭代。'],
];

export default function Home() {
  const [activeSolution, setActiveSolution] = useState('横向能力');
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const selectedSolution =
    solutions.find((solution) => solution.key === activeSolution) ?? solutions[0];

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main>
      <header className="site-header">
        <div className="shell nav-shell">
          <button className="brand" onClick={() => scrollTo('top')} aria-label="返回首页">
            <span className="brand-mark">D</span>
            <span>
              <strong>DSH</strong>
              <small>企业 AI 交付平台</small>
            </span>
          </button>

          <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="主导航">
            <button onClick={() => scrollTo('products')}>产品能力</button>
            <button onClick={() => scrollTo('solutions')}>行业方案</button>
            <button onClick={() => scrollTo('cases')}>案例样例</button>
            <button onClick={() => scrollTo('delivery')}>交付方式</button>
            <button onClick={() => scrollTo('contact')}>联系我们</button>
          </nav>

          <button className="header-cta" onClick={() => scrollTo('contact')}>
            预约交流 <span>↗</span>
          </button>
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? '关闭菜单' : '打开菜单'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? '×' : '☰'}
          </button>
        </div>
      </header>

      <section id="top" className="hero-section">
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-grid" />
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-panel panel-main">
            <div className="panel-topline">
              <span className="pulse-dot" />
              workflow / active
            </div>
            <div className="panel-title">研发知识助手</div>
            <div className="panel-flow">
              <span>资料库</span>
              <i>→</i>
              <span className="active-node">检索</span>
              <i>→</i>
              <span>回答</span>
            </div>
            <div className="panel-lines">
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="hero-panel panel-small">
            <span className="mini-label">knowledge coverage</span>
            <strong>92<span>%</span></strong>
            <div className="mini-bar"><i /></div>
          </div>
          <div className="hero-panel panel-card">
            <span className="mini-label">today&apos;s output</span>
            <strong>48</strong>
            <small>份结构化交付</small>
          </div>
        </div>

        <div className="shell hero-content">
          <p className="eyebrow"><span /> DSH / BUSINESS AI DELIVERY</p>
          <h1>让 AI 真正进入<br /><em>业务流程。</em></h1>
          <p className="hero-copy">
            从一个具体问题开始，把企业知识、工作流和模型能力组织成可落地、可复用、可持续运营的智能应用。
          </p>
          <div className="hero-actions">
            <button className="button button-dark" onClick={() => scrollTo('solutions')}>查看行业方案 <span>↘</span></button>
            <button className="text-button" onClick={() => scrollTo('delivery')}>了解交付方式 <span>→</span></button>
          </div>
          <div className="hero-proof">
            <span>从需求到交付</span>
            <b>01</b>
            <i />
            <span>从试点到运营</span>
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="shell trust-inner">
          <span>面向企业的 AI 工作方式</span>
          <div className="trust-items">
            <span>知识可追溯</span>
            <span>流程可编排</span>
            <span>权限可管理</span>
            <span>结果可交付</span>
          </div>
        </div>
      </section>

      <section id="products" className="section section-light">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow eyebrow-blue">01 / 产品能力</p>
              <h2>一套平台，<br /><span>覆盖完整交付链路。</span></h2>
            </div>
            <p>
              DSH 关注的不是“能不能生成”，而是企业能不能把结果交给团队使用，能不能持续复盘和迭代。
            </p>
          </div>
          <div className="capability-layout">
            <div className="capability-index">
              <span className="index-big">01</span>
              <span>CORE<br />CAPABILITIES</span>
            </div>
            <div className="capability-list">
              <article className="capability-item is-featured">
                <div>
                  <span className="item-kicker">01 / WORKSPACE</span>
                  <h3>统一工作台</h3>
                </div>
                <p>把输入、处理、审核和输出放在一个清晰的工作空间里。</p>
                <span className="item-arrow">↗</span>
              </article>
              <article className="capability-item">
                <div>
                  <span className="item-kicker">02 / KNOWLEDGE</span>
                  <h3>企业知识</h3>
                </div>
                <p>让回答有依据，让团队可以复用自己的资料和经验。</p>
                <span className="item-arrow">↗</span>
              </article>
              <article className="capability-item">
                <div>
                  <span className="item-kicker">03 / ORCHESTRATION</span>
                  <h3>流程编排</h3>
                </div>
                <p>将模型、工具、规则和人工节点组合成可执行流程。</p>
                <span className="item-arrow">↗</span>
              </article>
              <article className="capability-item">
                <div>
                  <span className="item-kicker">04 / GOVERNANCE</span>
                  <h3>安全治理</h3>
                </div>
                <p>权限、审计、版本和交付边界清晰可见。</p>
                <span className="item-arrow">↗</span>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="solutions" className="section solution-section">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow eyebrow-orange">02 / 行业方案</p>
            <h2>不从“AI 能做什么”开始，<br /><span>从业务要交付什么开始。</span></h2>
          </div>
          <div className="solution-tabs" role="tablist" aria-label="方案类型">
            {solutions.map((solution) => (
              <button
                key={solution.key}
                className={activeSolution === solution.key ? 'is-active' : ''}
                onClick={() => setActiveSolution(solution.key)}
                role="tab"
                aria-selected={activeSolution === solution.key}
              >
                {solution.key} <span>↗</span>
              </button>
            ))}
          </div>
          <div className="solution-feature">
            <div className="solution-copy">
              <span className="item-kicker">DSH / SOLUTION SYSTEM</span>
              <h3>{selectedSolution.title}</h3>
              <p>{selectedSolution.description}</p>
              <button className="text-button text-button-blue" onClick={() => scrollTo('contact')}>讨论你的场景 <span>→</span></button>
            </div>
            <div className="solution-items">
              {selectedSolution.items.map(([title, description], index) => (
                <div className="solution-item" key={title}>
                  <span>0{index + 1}</span>
                  <div>
                    <h4>{title}</h4>
                    <p>{description}</p>
                  </div>
                  <b>↗</b>
                </div>
              ))}
            </div>
          </div>
          <div className="industry-row">
            <span>更多行业入口</span>
            <div>
              <button onClick={() => scrollTo('contact')}>金融与保险</button>
              <button onClick={() => scrollTo('contact')}>法律与合规</button>
              <button onClick={() => scrollTo('contact')}>农业与养殖</button>
              <button onClick={() => scrollTo('contact')}>文旅与服务</button>
            </div>
          </div>
        </div>
      </section>

      <section id="cases" className="section section-dark">
        <div className="shell">
          <div className="section-heading split-heading dark-heading">
            <div>
              <p className="eyebrow">03 / 案例样例</p>
              <h2>从真实场景里，<br /><span>看见交付价值。</span></h2>
            </div>
            <p>
              案例页面不只展示“做了什么”，还要说明问题、过程和结果，让客户能够判断这是否适合自己的业务。
            </p>
          </div>
          <div className="case-grid">
            {cases.map((item, index) => (
              <article className={`case-card case-${item.color}`} key={item.title}>
                <div className="case-visual">
                  <span className="case-number">0{index + 1}</span>
                  <div className="case-visual-shape">
                    <i /><i /><i />
                  </div>
                  <span className="case-type">{item.type}</span>
                </div>
                <div className="case-content">
                  <span className="item-kicker">{item.type} / AI CASE</span>
                  <h3>{item.title}</h3>
                  <strong>{item.result}</strong>
                  <p>{item.detail}</p>
                  <button className="case-link" onClick={() => scrollTo('contact')}>索取案例简报 <span>↗</span></button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="delivery" className="section section-light delivery-section">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow eyebrow-blue">04 / 交付方式</p>
            <h2>先解决一个问题，<br /><span>再把方法沉淀下来。</span></h2>
          </div>
          <div className="delivery-intro">
            <p>我们把方案拆成清晰的阶段，每一步都有可以确认的产出，避免项目停留在概念验证。</p>
            <span>Delivery / 04 steps</span>
          </div>
          <div className="delivery-grid">
            {deliverySteps.map(([number, title, description]) => (
              <article key={number}>
                <span className="delivery-number">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <span className="delivery-line" />
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="section contact-section">
        <div className="shell contact-layout">
          <div>
            <p className="eyebrow eyebrow-orange">05 / 联系我们</p>
            <h2>把你的问题，<br /><em>变成下一条工作流。</em></h2>
            <p className="contact-copy">告诉我们你正在处理的业务问题，我们会围绕输入、过程和交付结果给出初步判断。</p>
            <div className="contact-meta">
              <span>DSH / Business AI Delivery</span>
              <span>商务联系：表单提交后回复</span>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <label>
              你的称呼
              <input name="name" placeholder="怎么称呼你？" required />
            </label>
            <label>
              联系方式
              <input name="contact" placeholder="邮箱 / 手机 / 微信" required />
            </label>
            <label>
              想先聊什么
              <select name="topic" defaultValue="方案咨询">
                <option>方案咨询</option>
                <option>产品演示</option>
                <option>行业合作</option>
                <option>定制交付</option>
              </select>
            </label>
            <label>
              业务问题
              <textarea name="message" placeholder="例如：希望把企业资料整理成可问答的知识助手。" rows={4} required />
            </label>
            <button className="button button-dark form-submit" type="submit">
              {submitted ? '已收到，我们会联系你' : '提交咨询'} <span>↗</span>
            </button>
          </form>
        </div>
      </section>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <div className="brand footer-brand">
            <span className="brand-mark">D</span>
            <span><strong>DSH</strong><small>企业 AI 交付平台</small></span>
          </div>
          <p>从业务问题出发，让 AI 变成可交付的工作方式。</p>
          <span>© 2026 DSH</span>
        </div>
      </footer>
    </main>
  );
}
