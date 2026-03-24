---
title: Golang数据传输
date: 2026-03-23T12:45:21+08:00
lastmod: 2026-03-23T12:45:21+08:00
description: ""
draft: true
weight: 1
tags: []
summary: ""
math: true
archives: 2026/3
---

# JSON

## 1.

`omitempty`是用于JSON标签的选项，当结构体的值为零值时，会在序列化中忽略该字段

`json:"name,omitempty"`

