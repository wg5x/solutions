import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DSH | 企业 AI 交付平台',
  description:
    '从业务问题出发，把企业知识、工作流和模型能力组织成可落地、可复用、可持续运营的智能应用。',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'DSH | 企业 AI 交付平台',
    description:
      '从业务问题出发，把企业知识、工作流和模型能力组织成可落地、可复用、可持续运营的智能应用。',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
