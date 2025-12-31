---
title: NJUPT数据结构
date: 2025-12-31T15:11:05+08:00
lastmod: 2025-12-31T15:11:05+08:00
description: 数据结构教程
draft: false
weight: 1
tags:
  - 算法
  - 数据结构
summary: 速通南邮数据结构课本
math: true
archives: 2025/12
---
# 一.绪论

看看就行，需要你会时间空间复杂度分析

# 二.线性表

### 1.顺序表

数组。

- 第$i$个元素的地址,$loc(a_i) = loc(a_0)+i*k$ ,其中$k$是单个元素的内存大小
- 插入、删除元素复杂度$O(n)$
### 2.线性表

链表。

#### 单链表


```c
typedef strcut node{
	Elemtype element; //数据域
	struct node*next //指针域
}Node;
```


