---
title: TODO清单小项目
date: 2026-04-03T18:50:53+08:00
lastmod: 2026-04-03T18:50:53+08:00
description: 简单基于gin,gorm,go-template的小网页
draft: false
weight: 1
tags: []
summary: 简单基于gin,gorm,go-template的小网页
math: true
archives: 2026/4
---

后端部分
`main.go`

```go
package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type Info struct {
	ID      uint   `gorm:"primarykey" json:"id" `
	Content string `form:"content" json:"content" binding:"required" `
	OK      bool   `form:"ok" json:"ok" gorm:"default:true"`
}

var DB *gorm.DB

func initDB() {
	dsn := "root:123456@tcp(127.0.0.1:3306)/go7?charset=utf8mb4&parseTime=True&loc=Local"
	db, err := gorm.Open(mysql.Open(dsn))
	if err != nil {
		panic(err)
	}
	DB = db
	DB.AutoMigrate(&Info{})
}

func main() {
	initDB()
	ct := gin.Default()
	ct.LoadHTMLFiles("./index.tmpl", "./404.html")

	ct.GET("/index", func(c *gin.Context) {
		var list []Info
		DB.Find(&list)
		c.HTML(http.StatusOK, "index.tmpl", gin.H{
			"list": list,
		})
	})

	ct.POST("/index", func(c *gin.Context) {
		var newinfo Info
		if err := c.ShouldBind(&newinfo); err != nil {
			c.Redirect(http.StatusFound, "/index")
			return
		}
		DB.Create(&newinfo)
		c.Redirect(http.StatusFound, "/index")
	})

	ct.PUT("/index/:id", func(c *gin.Context) {
		id, _ := strconv.Atoi(c.Param("id"))
		var info Info
		DB.Where("id=?", id).Find(&info)
		info.OK = !info.OK
		DB.Save(&info)
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
		})
	})

	ct.DELETE("/index/:id", func(c *gin.Context) {
		id, _ := strconv.Atoi(c.Param("id"))
		DB.Delete(&Info{}, id)
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
		})
	})

	ct.NoRoute(func(c *gin.Context) {
		c.HTML(http.StatusNotFound, "404.html", nil)
	})
	
	ct.Run()
}
```

前端部分

```index.tmpl
<!DOCTYPE html>
<html>
<head>
    <title>Todo小项目</title>
</head>
<body>
    <h1>Todo清单</h1>
    <ul>
    {{range .list}}
    <li>
        <span>{{.Content}}</span>
        <span>{{.OK}}</span>
        <button onclick="change({{.ID}})">切换</button>
        <button onclick="del({{.ID}})">删除</button>
    </li>
    {{end}}
    </ul>

    <hr>
    
    <form action="/index" method="post">
        <label for ="todo">要做的事情：</label>
        <input type="text" id="todo" name="content" required>
        <button type ="submit">提交</button>
    </form>
</body>
</html>

<script>
async function change(id) {
    try {
        const response = await fetch(`/index/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            window.location.reload(); 
        } else {
            alert("切换失败，服务器返回错误");
        }
    } catch (error) {
        console.error("请求发生错误:", error);
        alert("网络连接失败");
    }
}
async function del(id){
    try{
        const response = await fetch(`/index/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response.ok) {
            window.location.reload(); 
        } else {
            alert("切换失败，服务器返回错误");
        }
    }catch(error){
        alert("网络连接失败");
    }
}
</script>
```


结果：

![](/images/e16878cc3af2d99f2e3bb606b62e731b.png)



1. 模型定义：
   每一个待办事情都有一个独立的id，内容，判断是否做完的变量
2. GET：
   发送查看待办事项列表的请求，查询数据库并通过template返回给前端
3. POST：
   通过form表单形式得到待办事项内容，插入数据库，并重定向至GET页面
4. PUT：
   通过button调用异步函数change(id)，后端根据前端的fetch(/index/${id})请求拿到id并修改，返回给前端状态码，前端刷新页面
5. DELETE：
   与PUT原理相同