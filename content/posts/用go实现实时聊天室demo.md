---
title: 用go实现实时聊天室demo
date: 2026-03-24T12:46:52+08:00
lastmod: 2026-03-24T12:46:52+08:00
description: 用go实现实时聊天室demo
draft: false
weight: 1
tags:
  - Go
  - 项目
summary: 用go实现实时聊天室demo
math: true
archives: 2026/3
---
用go实现实时聊天室demo
# V1.1

```go
//server.go
package main

import (
	"bufio"
	"fmt"
	"log"
	"net"
	"strings"
)

type Client struct {
	name string
	ch   chan Message
}

type Message struct {
	from    string
	content string
	to      string
}

var (
	entering = make(chan Client)
	leaving  = make(chan Client)
	message  = make(chan Message)
)

func main() {
	listener, err := net.Listen("tcp", "127.0.0.1:8080")
	if err != nil {
		log.Fatal(err)
	}

	go broadcast()

	fmt.Println("runing...")

	for {
		conn, err := listener.Accept()

		if err != nil {
			log.Println(err)
			continue
		}

		conn.Write([]byte("enter your name\n"))
		sc := bufio.NewScanner(conn)
		sc.Scan()
		name := sc.Text()
		ch := Client{
			name: name,
			ch:   make(chan Message),
		}
		entering <- ch
		message <- Message{
			from:    "server",
			to:      "",
			content: name + " has arrived",
		}

		go handlerfunc(conn, ch)

	}
}

func handlerfunc(conn net.Conn, ch Client) {
	defer func() {
		conn.Close()
		message <- Message{
			from:    "server",
			to:      "",
			content: ch.name + " has left",
		}
		leaving <- ch
	}()
	done := make(chan struct{})
	go clientWriter(conn, ch)
	go func() {
		clientReader(conn, ch)
		done <- struct{}{}
	}()
	<-done
}

func clientReader(conn net.Conn, ch Client) {
	scanner := bufio.NewScanner(conn)
	for scanner.Scan() {
		str := scanner.Text()
		send := ""

		if strings.HasPrefix(str, "@") {
			b := strings.Split(str, ":")
			send = b[0][1:]
			str = b[1]
		}

		msg := Message{
			from:    ch.name,
			to:      send,
			content: str,
		}
		message <- msg
	}
}

func clientWriter(conn net.Conn, ch Client) {
	for msg := range ch.ch {
		if msg.to == ch.name {
			fmt.Fprintf(conn, "[Private] %v :%v\n", msg.from, msg.content)
		} else {
			fmt.Fprintf(conn, "[Public] %v :%v\n", msg.from, msg.content)
		}
	}
}

func broadcast() {
	clients := make(map[string]Client)
	for {
		select {
		case cli := <-entering:
			clients[cli.name] = cli
		case cli := <-leaving:
			delete(clients, cli.name)
			close(cli.ch)
		case msg := <-message:
			if msg.to != "" {
				_, ok := clients[msg.to]
				if ok == false {
					clients[msg.from].ch <- Message{
						from:    "Server",
						to:      msg.from,
						content: "The client is not exist",
					}
				} else {
					clients[msg.to].ch <- msg
				}
			} else {
				for _, cli := range clients {
					cli.ch <- msg
				}
			}
		}
	}
}

```


```go
//client.go
package main

import (
	"io"
	"log"
	"net"
	"os"
)

func main() {
	conn, err := net.Dial("tcp", "127.0.0.1:8080")
	if err != nil {
		log.Println(conn)
		return
	}
	defer conn.Close()

	done := make(chan struct{})

	go func() {
		io.Copy(os.Stdout, conn)
		done <- struct{}{}
	}()

	if _, err := io.Copy(conn, os.Stdin); err != nil {
		log.Fatal(err)
	}

	<-done
}
```

利用`net`包，进行终端通信。

使用`channel`和`goroutine`实现消息的传递和广播

在消息前加上`@xxx:`可以实现私聊模式

问题：
1. 用户名字可能会重复
2. 没有聊天室功能
3. 缺乏心跳检测
4. 消息协议简陋
5. 检查切片长度越界
6. 查看当前用户列表