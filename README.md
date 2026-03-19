# OpenClaw 简体中文语言包

这个项目只做一件事：为官方 `openclaw/openclaw` 源码应用简体中文翻译。

它不是二次发行版，也不是功能增强版。它只提供一层可回退的汉化补丁。

不包含以下内容：

- 第三方 provider 注入
- Dashboard 功能面板注入
- 额外链接、广告、社区入口
- 对官方功能行为的扩展或改写

目标是尽量保持与原版功能一致，只改变用户可见文本。

## 快速开始

在本项目根目录执行：

```bash
git clone https://github.com/openclaw/openclaw.git openclaw
npm install
npm run apply -- --target=./openclaw
```

应用完成后，进入官方源码目录正常构建：

```bash
cd openclaw
pnpm install
pnpm ui:build
pnpm build
```

## 常用命令

CLI 命令名为 `openclaw-zh`，也可以直接使用 `npm run ...`：

```bash
openclaw-zh status
openclaw-zh apply --dry-run --target=./openclaw
openclaw-zh verify --target=./openclaw

npm run status
npm run apply -- --dry-run
npm run apply -- --target=./openclaw
npm run verify -- --target=./openclaw
npm run restore -- --target=./openclaw
```

## 发布定位

- 项目名称：OpenClaw 简体中文语言包
- 包名称：`openclaw-zh-patch`
- 命令名称：`openclaw-zh`

## 设计原则

- 只保留面向用户文本的汉化
- 不新增官方仓库中不存在的入口、链接、provider 或 UI 组件
- 不修改官方包名识别、CSP、构建产物注入逻辑
- 翻译规则直接作用于官方源码文件，便于追踪和回退
