---
title: Golang的那些API
date: 2026-03-21T20:57:53+08:00
lastmod: 2026-03-21T20:57:53+08:00
description: Golang SDK
draft: true
weight: 1
tags:
  - Go
  - 笔记
summary: Golang SDK
math: true
archives: 2026/3
---

# 打包

`go build -o myapp.exe app.go`

`-o`命令可以指定打包文件名称

如果要打包成`exe`文件，则需要是包含`main`函数的`main`包下的文件


# fmt包

## 1.Print

1. `Print`：直接输出
2. `Printf`：支持格式化输出
3. `Println`：在输出末尾添加一个换行符


## 2.Fprint

`func Fprintf(w io.Writer, format string, a ...interface{}) (n int, err error)`

将内容输出到一个实现`io.Writer`接口的变量`w`中


## 3.Sprint

返回一个生成的字符串

# strings包

## 1.string.Trim

去除字符串首尾指定字符

`strings.Trim(" hello,world "," ")`

## 2.string.ToUpper/ToLower

将字符串中的所有字母转为大写/小写

`strings.ToUpper("q")`

## 3.strings.Contains

用于判断子串是否含有给定字符串，返回布尔值

`strings.Contains(str,"???")`

## 4. strings.Count

判断子串含有给定字符串的数量

## 5.strings.ContainsAny

判断子串是否含有给定字符集合中的任意一个字符

## 6.strings.Join

将字符串切片中的所有元素连接成一个字符串，可以自定义`sep`字符串以此分隔

`strings.Join([]string{"114","514"},",")`

## 7.strings.Split

将指定字符串拆分成切片

`strings.Split("a,b,c", ",")`

## 8.strings.HasPrefix

判断字符串是否以指定前缀开头

`strings.HasPrefix("Gopher","Go")`

## 9.strings.HasSuffix

判断字符串是否以指定后缀结尾

`strings.HasSuffix("filename.txt",".txt")`


## 10.strings.Index

返回子串在字符串的第一个匹配位置索引，如果不存在返回-1

`strings.Index("chiken","ken")`

## 11.strings.ReplaceAll

替换所有匹配的子串

`strings.ReplaceAll("hello world","l","L")`


# os包

## 1.os.Stdin（变量）

标准输入（键盘输入）

**作用**：程序从控制台读取用户输入

## 2.os.Open

打开一个文件，返回一个`*File`文件和一个err

`file, err := os.Open("./1.txt")`


### \*os.File

`func (f *os.File) Read(b []byte) (n int, err error)`

`func (f *os.File) Write(b []byte) (n int, err error)`

`func (f *os.File) WriteString(s string) (n int, err error)`

## 3.os.ReadFile

`func os.ReadFile(name string) ([]byte, error)`

读取整个文件，存储在byte切片中


## 4.os.OpenFile

`func os.OpenFile(name string, flag int, perm os.FileMode) (*os.File, error)`


# io包

## 1.io.Copy

`func io.Copy(dst io.Writer, src io.Reader) (written int64, err error)`


io.Copy是 Go 语言标准库 io包中的一个核心函数，用于高效地将数据从一个可读的“源”（io.Reader）复制到一个可写的“目标”（io.Writer），直到源的数据全部读完（遇到 EOF）或发生错误。

是阻塞的


# bufio包

## 1.bufio.NewReader

`func bufio.NewReader(rd io.Reader) *bufio.Reader`

创建一个带缓冲的读取器，以此提高读取效率，减少系统调用次数

可以通过 `reader.Read()`从缓冲区读取数据

`io.Reader`是一个接口类型，要求实现`read`方法

### Reader对象

`func (b *bufio.Reader) Read(p []byte) (n int, err error)`

从Reader对象中读取`n`个字节并存储在`p`切片中

`func (b *bufio.Reader) ReadString(delim byte) (string, error)`

读入输入直到遇到`delim`

## 2.bufio.NewScanner


`func bufio.NewScanner(r io.Reader) *bufio.Scanner`

逐行读取

### Scanner对象

`func (s *bufio.Scanner) Scan() bool`

`func (s *bufio.Scanner) Text() string`

# net/http包

## 1.net.Listen

在指定网络协议和地址上**开始监听**，等待客户端连接

`func(network string,address string)(net.Listener,error)`


第一个参数：网络协议类型（tcp/udp）

第二个类型：监听地址（127.0.0.1:8080 /0.0.0.0:8080）

返回一个Listener对象以及一个错误


## 2.net.Dial

客户端**主动建立连接**到指定的TCP服务器

`func net.Dial(network string, address string) (net.Conn, error)`


## 3.http.Get/Post


`func http.Get(url string) (resp *http.Response, err error)`


## 4.url.Values{}（变量）

`type Values map[string][]string`

用来获得类似`http://127.0.0.1:8080/name=??&age=??`的url

是一个key是string，value是string切片的类型

设置url的参数

1. `func (v url.Values) Set(key string, value string)`:设置/覆盖value
2. `func (v url.Values) Get(key string) string`:获得value切片的第一个元素
3. `func (v url.Values) Add(key string, value string)`:添加value（不覆盖）
4. `func (v url.Values) Del(key string)`:清空value
5. `func (v url.Values) Encode() string`:编码为查询字符串

PS：URL标准要求查询参数中的非ASCII字符（如中文字符）必须被编码为UTF-8字节序列的百分号形式，以确保在网络传输中的安全性。

### Response对象

包含完整的http响应信息

- StatusCode
- Header
- Body
- ContentLength


### Request对象

由三部分组成

1. 请求行（请求方法，请求的URL对象，协议版本）
2. 请求头（Content-Type，Authroization，Cookie等）
3. 请求体

### ResponseWriter对象

由三部分组成

1. 状态行（http版本，状态码，状态信息）
2. 响应头（Content-Type,Content-Length,Server等）
3. 响应体


### Listener对象

等待并接受一个新的客户端连接

`func (net.Listener) Accept() (net.Conn, error)`

返回一个Conn对象以及一个错误


## Conn对象

1. `func (net.Conn) Close() error`
2. `func (net.Conn) Write(b []byte) (n int, err error)`:通过网络连接**发送数据**给另一方
3. `func (net.Conn) Read(b []byte) (n int ,err error)`:读取另一方给的数据
4. `func (net.Conn) RemoteAddr() net.Addr`:返回另一方地址