---
title: "Hugo博客搭建简单教程"
date: 2025-12-29T16:59:36+08:00
lastmod: 2025-12-29T16:59:36+08:00
description: "博客搭建"
draft: false
weight: 1
tags: ["教程","Go"]
summary: "如何利用静态网站生成器hugo + GithubPage作为服务器 快速搭建个人网站"
math : false
---


# Tips

一些不懂的命令或者操作可以问AI
推荐`Gemini3` ，个人认为比`GPT`好用
https://gemini.google.com/app

# 一. 环境配置

搜索`hugo`官网并依次安装 
1. `hugo`
2. `Git`

推荐使用`vscode`作为编辑器
# 二.本地初始化

本地新建文件夹`Weblog`

在文件夹目录下执行
```bash
hugo new site my-blog 
cd ./my-blog
git init
```
作用：初始化`hugo` ， 本地`Git`仓库

你会得到
- `archetypes/`: 内容模板文件。
- `content/`: 博客文章等内容。
- `layouts/`: 网站布局和模板。
- `static/`: 静态资源，如图片、CSS、JS。
- `themes/`: 主题存放目录。
- `hugo.toml`: 网站主配置文件。

我们主要修改的是:`hugo.toml`配置文件


前往`hugo`官网，选择自己喜欢的主题文件
[Hugo Themes](https://themes.gohugo.io/)
点击`Download`跳转到对应的`Github`仓库

执行
```bash
git ./themes
git submodule add https://github.com/adityatelange/hugo-PaperMod.git #对应的主题仓库地址
```
下载对应的主题文件到`./themes`文件夹下

打开`hugo.toml`

修改基本配置
```toml
baseURL = "localhost:1313"  #（重要）（之后换成你的域名/或者远程仓库名）
languageCode = "zh-cn"
title = "博客"
theme = "PaperMod" #你对应的主题的名字(重要)

[menu] 
[[menu.main]] 
identifier = "about" 
name = "关于" 
url = "/about/" 
weight = 1 
[[menu.main]] 
identifier = "blog" 
name = "博客" 
url = "/posts/" 
weight = 2
```

执行
```bash
hugo new posts/hello_world.md
```
在`content`目录下创建`posts`目录，并新建一个`markdown`文件

出现
```md
--- 
title: "我的第一篇文章" 
date: 2022-11-20T09:03:20-08:00 
draft: true 
--- 

在此处编辑文章
```
将`draft`设置为`false` （为`true`时为草稿不显示）

执行
```bash
hugo server -D
```
访问本地`localhost:1313`出现对应页面


设置`.gitignore`文件
```bash
/public/
/resources/
/.hugo_build.lock
/hugo_stats.json
```
选择不将冗余文件同步到远程仓库
这里不加`public`是因为 后续使用`Github Actions` 方便更新博客


设置`Github Action`文件
创建在`.github\workflows\hugo.yml`

```bash
name: Deploy Hugo site to Pages
on:
  push:
    branches: ["main"]  # 只有推送到 main 分支时才触发
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive  # 如果你的主题是 git submodule 形式，这行很重要
          fetch-depth: 0
      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: 'latest'
          extended: true # 建议开启，因为很多主题需要 extended 版本
      - name: Build
        run: hugo --minify
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```


最后将所有修改提交至本地仓库
```bash
git add .
git commit -m "Initalize"
```
# 三.远程仓库初始化

`Github`新建一个仓库 ：

`用户名.github.io`

执行
```bash
git remote add origin #你的仓库地址
git branch -M main 
git push -u origin main 
```
绑定本地仓库和`Github`仓库

修改仓库设置

`Settings`->`Pages`->`Github Actions`启用
若有域名
在`Custom domain`中添加
当然也需要修改域名设置


# 四.一些修改

修改`hugo.toml`
```toml
baseURL = '...' #你的域名
```

参考选择的主题的文档修改`toml`
或者使用`AI` 的建议

在`archetypes`下
修改`default.md`: 更新 每次`new` 一个新文章的使用的模板


# 五.更新博客
设置好`github action`后只需要每次执行
```bash
git add .
git commit -m "update"
git push origin main
```
即可推送至网站

# 六.更多内容

## Latex
`hugo`使用`katex`进行渲染

在`layouts`文件夹下新建
`math.html`
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body);"></script>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        renderMathInElement(document.body, {
            delimiters: [
                {left: "$$", right: "$$", display: true},
                {left: "$", right: "$", display: false}
            ]
        });
    });
</script>
```

拉取你的主题的`single.html`到`layouts`文件夹下的`_default`文件夹
在其最后一行添加
```html
{{ if .Params.math }}{{ partial "math.html" . }}{{ end }}
```

每次新建文章时加入参数启用`latex`渲染
```md
math: true
```

## 浏览量统计

可使用不蒜子 、或者其他工具

## 评论功能

使用`Giscus`

1. `github` `feature`启用`discussion`
2. 本地添加`giscus`官方`url`生成对应的`js`文件
3. 在`single.html`下修改逻辑
# 七.提醒
1. 如果浏览器无法正常渲染，尝试将插件关闭
# 八.参考内容
[Hugo官方文档中文版|Hugo中文文档 | Hugo官方文档](https://hugo.opendocs.io/)
[从零到一：使用 Hugo 和 GitHub Pages 搭建个人博客 | jaxiu He](https://blog.jaxiu.cn/blog/2025-07/%E4%BB%8E%E9%9B%B6%E5%88%B0%E4%B8%80%E4%BD%BF%E7%94%A8-hugo-%E5%92%8C-github-pages-%E6%90%AD%E5%BB%BA%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2/)
