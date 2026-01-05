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
math: true
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
delete from tb_name [where 条件];
```

### 5.DQL

```bash
select
	字段列表
from 
	表名列表
where
	条件列表
group by
	分组字段列表
having
	分组后条件列表
order by
	排序字段列表
limit
	分页参数
```


```bash
select 字段1,字段2... from tb_name;
select * from tb_name;

select 字段1 [as 别名1] ,字段2 [as 别名2] from tb_name;

select distinct 字段列表 from tb_name; #去除重复字段
```

`where` +条件
```bash
<,>,<=,=,!=.....
in(....) 在in后的列表中的值,多选一
like 占位符(_,%)
is null
between.. and ..
and &&
or ||
not !
```


#### 聚合函数

将一列数据作为一个整体,进行计算

```bash
count #统计数量
max
min
avg
sum

select 聚合函数(字段) from tb_name;
```

null值不参与聚合函数的运算

#### 分组查询

`select 字段列表 from tb_name [where 条件] group by 分组字段名 [having 分组后过滤条件]`


`where` 和 `having`的区别
- `where`在分组之前过滤,`having`是分组后过滤
- `where`不能对聚合函数判断,`having`可以

一般查询的是聚合字段和分组字段,其他字段无意义


#### 排序查询

`select 字段列表 from tb_name order by 字段1 排序方式,字段2 排序方式`

`asc 升序(默认) ,desc 降序`

如果第一个字段相同,才会按照第二个字段排序


#### 分页查询

`select 字段列表 from tb_name limit 起始索引,查询记录数`

起始索引从$0$开始.
分页在不同数据库中有不同实现


#### 执行顺序

```bash
from 
	表名
where
	条件列表
group by
	分组字段列表
having
	分组后条件列表
select
	字段列表
order by
	排序字段列表
limit
	分页参数
```

### 6.DCL

#### 查询用户
```bash
use mysql;
select * from user;
```

#### 创建用户

```bash
create user '用户名'@'主机名' identified by '密码'
alter user '用户名'@'主机名' identified with mysql_natvie_password by '密码' #修改密码
drop user '用户名'@'主机名' # 删除用户
```

#### 权限控制


```bash
#常见权限
all
select
insert
update
delete
alter
drop
create
```

```bash
show grants for '用户名'@'主机名'; #查询权限
grant 权限列表 on 数据库名.tb_name to '用户名'@'主机名' #授予权限
revoke 权限列表 on 数据库名.tb_name from '用户名'@'主机名' #撤销权限
```
