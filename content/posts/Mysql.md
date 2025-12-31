---
title: Mysql
date: 2025-12-30T11:35:49+08:00
lastmod: 2025-12-30T11:35:49+08:00
description: Mysql
draft: false
weight: 1
tags:
  - 数据库
summary: 数据库笔记
math: false
archives: 2025/12
---

# Mysql


# 零.学习资源
[黑马程序员 MySQL数据库入门到精通，从mysql安装到mysql高级、mysql优化全囊括_哔哩哔哩_bilibili](https://www.bilibili.com/video/BV1Kr4y1i7ru/?spm_id_from=333.788.player.switch&vd_source=eeed231bc80c4f445afa41c5d10d993)



## 一.SQL

### 1. **基本语法**
- SQL可以单行或者多行书写，分号结尾
- 可以使用空格或者缩进
- SQL语句不区分大小写
- 单行注释：`--`或`#` 多行注释 `/* */`


1. **DDL(定义数据对象)**
2. **DML(对数据进行增删改)**
3. **DQL(查询数据)**
4. **DCL(控制用户访问权限)**

### 2.基本数据类型

```bash
tinyint #1byte
smallint #2bytes
mediumint #3bytes
int或integer #4bytes
bigint #5bytes

float #4bytes
double #8bytes
decimal #精确小数点
```

```bash
#blob描述二进制文件
#text描述文本文件
char  #定长字符串  char(10) 性能好
varchar #变长字符串 varchar(10) 
tinyblob
tinytxt
blob #65535bytes
text
mediumblob
mediumtxt
longblob
longtxt #4294967295bytes 极大文本数据
```

```bash
date #1000-01-01 ~ 9999-12-31
time # -030:59:59 ~ 030:59:59
year #1901 ~ 2155
datetime #1010-01-01 00:00:00
timestamp #时间戳
```


### 3.DDL
是否加`[]`是可选的

```bash
show databases; 
select database(); #查询当前数据库
create database [if not exists] db_name [default charset 字符集] [collate 排序规则];
drop database [if exists] db_name; #删除数据库
use db_name;# 进入数据库
truncate table tb_name #删除指定表，并重新创建该表
```

```bash
show tables; #查看当前数据库的表
desc tb_name; #查询表结构
show create table tb_name; #查询指定表的建表语句
```

```bash
craete table tb_name(
	字段1 字段1类型 [comment 字段1注释]
	字段2 字段2类型 [comment 字段2注释]
	字段3 字段3类型 [comment 字段3注释]
)[comment 表注释];
```


```bash
alter table tb_name add 字段名 类型 [comment 注释] [约束];#添加字段
alter table tb_name modify 字段名 新类型; #修改字段数据类型
alter table tb_name change 旧字段名 新字段名 类型 [comment 注释] [约束];#修改字段名和字段类型
alter table tb_name drop 字段名 #删除字段
alter table tb_name rename to 新表名 #修改表名
```


### 4.DML

```bash
insert into tb_name (字段名1，字段名2，..) values (值1，值2...);
insert into tb_name values (值1，值2...);# 顺序和字段顺序相同|插入一个记录
insert into tb_name values (值1，值2...),(值1,值2..)..;#插入多个记录
```

```bash
update tb_name set 字段名1=值1，字段名2=值2，...[where 条件]; #修改字段值

```