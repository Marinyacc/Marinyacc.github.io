---
title: Py3基本语法
date: 2026-02-03T17:15:56+08:00
lastmod: 2026-02-03T17:15:56+08:00
description: 快速掌握python常见语法
draft: false
weight: 1
tags:
  - Python
  - 教程
summary: 快速掌握python常见语法
math: true
archives: 2026/2
---
# 标准输入输出

从`input()`中读入
由于`input()`只能读入字符串，因此读入其他类型需要强制类型转换
比如`n=int(input())`

如果读入的数据有空格，则需要使用
`input().split()`分割(默认以空格为分割点)
比如读入一个`list`
`a=list(map(int,input().split()))`

换行输出
`print()`
不换行输出`print(res,end=' ')`

# 循环
`for i in range(i,j):`
在`[i,j-1]`上进行遍历
`for x in arr:`
在数组`arr`上进行遍历，元素为`x`

# 数据类型
bool类型：`True`和`False`大写

# 常用方法

## 排序
对于一个`list`
1. `a.sort()`
2. `a[i:j]=sorted(a[i:j])`


# 运算符
浮点数除法符号是： /
整除（向下取整）的符号是： //
`py`没有`!`作为取反的符号
`**`是计算幂次，如`10**0.5`计算`sqrt(10)`

# 数据结构

`c++ vector ->python list`
初始化
`arr = [0]*n` 
不能这样`arr=[]*n`



`C++ map -> python dict`

`dict.get(key,defalut_value)`：取`dict[key]`的`value`如果不存在这个键值对，则创建`dict[key]=defalut_value`

# 数学函数

 开根号
`import math`
`math.sqrt(num)`


# 函数的定义

`def func(参数1，参数2):`
`return`
默认只读全局变量，如果要修改全局变量则需要传参

函数必须声明在最上方

# 卡常
`import sys`
`input = lambda:sys.stdin.readline().strip()`

使用`pypy3`解释器
PyPy3 和 Python3（CPython）最大的差异在于**解释器实现方式**与**性能表现**。Python3 是官方默认的 C 语言实现，而 PyPy3 是用 RPython 编写的替代实现，并引入了 **JIT（即时编译）** 技术，可在运行时将热点代码编译为机器码，从而显著提升速度。

**性能差异**方面，PyPy3 在计算密集型任务中通常比 CPython 快 **2~10 倍**，尤其在长循环、大量数学计算等场景中优势明显。

**内存与启动时间**上，PyPy3 启动时内存占用略高且启动较慢，但长时间运行的程序中，其垃圾回收机制可能更高效。

**兼容性**方面，Python3 对所有 Python 包（尤其是 C 扩展）支持最佳，而 PyPy3 对部分 C 扩展（如部分 NumPy、SciPy 模块）可能不兼容。不过，对于纯 Python 项目，PyPy3 几乎可无缝替换。

# 敲代码

`shift + tab`将代码块整体向左缩进
`tab`将代码块整体向右缩进