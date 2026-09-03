# DSH Desktop

这是统一交付底座的第一个可运行版本，当前只提供：

- macOS 绿色桌面包
- 模型服务地址、API Key、模型名称和系统提示配置
- 最基础的 DSH 对话

当前版本不包含任何能力包，也不包含连接器、MCP 或开发者 Agent。

## 直接运行

在 `desktop/` 目录执行：

```bash
npm install
npm start
```

## 生成 macOS 绿色包

```bash
npm run package:mac:green
```

生成结果：

```text
desktop/release/mac-green/DSH Desktop.app
```

也可以双击 `run-dsh-desktop.command` 启动。模型配置保存在 macOS
用户数据目录，程序目录可以整体复制。
