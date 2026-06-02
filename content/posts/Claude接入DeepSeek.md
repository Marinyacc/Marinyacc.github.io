---
title: Claude接入DeepSeek
date: 2026-06-02T17:26:06+08:00
lastmod: 2026-06-02T17:26:06+08:00
description: Claude接入DeepSeek
draft: false
weight: 1
tags:
  - 教程
  - AI
  - CLI
summary: Windows下Claude接入DeepSeek
math: true
archives: 2026/6
---

# 一.安装Claude

在PowerShell输入

```powershell
npm install -g @anthropic-ai/claude-code
```


输入以查看claude是否成功安装
```powershell
claude --version
```


# 二.获取DeepSeekApi

访问
https://platform.deepseek.com

充值并新建API Key

注意保证复制API Key

# 三.安装CC-Switch

[Releases · farion1231/cc-switch](https://github.com/farion1231/cc-switch/releases)

点击进入CC-Switch的Release仓库
下载CC-Switch-v3.16.1-Windows-Portable.zip （或msi)

点击软件界面右上角加号 添加Claude供应商

将你的API Key复制进去

完成后启用供应商服务

软件提供  测试模型/用量统计 等

# 四.应用Claude

进入项目目录

输入`claude`即可