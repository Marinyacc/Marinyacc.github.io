---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
lastmod: {{ .Date }}
description: ""
draft: false
weight: 1
tags: []
summary: ""
math: true
archives: "{{ .Date.Format "2006/01" }}"
---

## 正文
在这里开始书写你的内容...