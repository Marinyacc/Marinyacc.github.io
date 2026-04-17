---
title: Go_desk项目分析
date: 2026-04-13T13:29:58+08:00
lastmod: 2026-04-13T13:29:58+08:00
description: Go_desk项目分析
draft: false
weight: 1
tags:
  - Go
  - 项目
summary: Go_desk项目分析
math: true
archives: 2026/4
---

[LeoninCS/DevDesk: 一个由Go+Vue开发的Web工作台，包含Markdown编辑器、http接口测试、HTML托管、代码分享、待办事项功能，无需登录即可使用。](https://github.com/LeoninCS/DevDesk)


# Markdown部分

## 功能

1. 前端实现对文本的markdown渲染
2. 后端实现对文本的多个用户同时在线编辑功能

## 后端
1. 数据存储在内存中
2. 每一个文档都有一个哈希值
3. 每一个文档都有一个在线用户channel，浏览器通过SSE协议向每个用户流式发送数据

```go
type Markdown struct {
	mu   sync.RWMutex
	Docs map[string]*Document
}

type Document struct {

    Hash string

    mu      sync.RWMutex
    Content string
    Clients map[chan string]struct{}
}

func (d *Document) SetContent(content string) {
	d.mu.Lock()
	defer d.mu.Unlock()

	d.Content = content

	for ch := range d.Clients {
		select {
		case ch <- content:
		default:
		}
	}
}
func (d *Document) AddClient() chan string {
	ch := make(chan string, 10)
	d.mu.Lock()
	d.Clients[ch] = struct{}{}
	inital := d.Content
	d.mu.Unlock()

	go func() {
		if inital != "" {
			ch <- inital
		}
	}()
	return ch
}

func (d *Document) RemoveClient(ch chan string) {
	d.mu.Lock()
	defer d.mu.Unlock()
	if _, ok := d.Clients[ch]; ok {
		delete(d.Clients, ch)
		close(ch)
	}
}

func (h *MarkdownHandler) StreamDocument(c *gin.Context) {
	hash := c.Param("hash")
	doc, ok := h.md.GetDocument(hash)
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": service.ErrDocNotFound})
		return
	}
	w := c.Writer
	flusher, ok := w.(http.Flusher)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "streaming unsupported"})
		return
	}
	ch := doc.AddClient()
	defer doc.RemoveClient(ch)

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("Access-Control-Allow-Origin", "*")

	flusher.Flush()

	for {
		select {
		case <-c.Request.Context().Done():
			return
		case content, ok := <-ch:
			if !ok {
				return
			}
			data, _ := json.Marshal(map[string]string{
				"content": content,
			})
			w.Write([]byte("data: " + string(data) + "\n\n"))
			flusher.Flush()
		}
	}
}
```

## 前端

1. 通过querystring取得文档哈希值
2. 调用markjs渲染文本
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>实时 Markdown 协作</title>
    <style>
        body { font-family: sans-serif; margin: 20px; }
        .container { display: flex; gap: 20px; }
        textarea { width: 50%; height: 500px; padding: 10px; font-size: 16px; }
        #preview { width: 50%; height: 500px; border: 1px solid #ccc; padding: 10px; overflow: auto; background: #fafafa; }
        .nav { margin-bottom: 10px; }
    </style>
</head>
<body>

    <div class="nav">
        <button onclick="newDoc()">生成新文档</button>
        <span>当前文档 Hash: <b id="doc-hash">加载中...</b></span>
    </div>

    <div class="container">
        <textarea id="editor" placeholder="开始输入 Markdown..."></textarea>
        <div id="preview"></div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script>
        const editor = document.getElementById('editor');
        const preview = document.getElementById('preview');
        const hashDisplay = document.getElementById('doc-hash');

        // 1. 获取 URL 中的 hash
        let hash = new URLSearchParams(window.location.search).get('hash') || 'test-default';
        hashDisplay.innerText = hash;

        // 2. 建立 SSE 连接：接收别人的更新
        const source = new EventSource(`http://localhost:8080/api/markdown/stream/${hash}`);
        
        source.onmessage = function(event) {
            const data = JSON.parse(event.data);
            // 只有当服务器内容和本地不一致时才更新，避免打字光标跳动
            if (editor.value !== data.content) {
                editor.value = data.content;
                preview.innerHTML = marked.parse(data.content);
            }
        };

        // 3. 监听输入：发送我的更新
        editor.oninput = function() {
            const content = editor.value;
            // 本地立即渲染预览
            preview.innerHTML = marked.parse(content);

            // 发送给后端广播
            fetch("http://localhost:8080/api/markdown/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hash: hash, content: content })
            });
        };

        // 4. 生成新文档函数
        async function newDoc() {
            try {
                const res = await fetch("http://localhost:8080/api/markdown/new");
                const data = await res.json();
                // 跳转页面
                window.location.search = `?hash=${data.hash}`;
            } catch (e) {
                alert("创建失败，请检查后端是否启动");
            }
        }
    </script>
</body>
</html>
```


# Codeshare部分

## 功能

1. 前端渲染代码
2. 后端存储代码文件

## 后端

1. 设置MaxEntries和MaxContentSize限制存储数据个数和存储大小
2. 定期清理过期数据，添加数据时可选择让最少使用数据清除

```go
type CodeShare struct {
	mu    sync.RWMutex
	store map[string]*Code
	order []string
}

type Code struct {
	Author      string `json:"author"`
	Language    string `json:"language"`
	Content     string `json:"content"`
	Hash        string `json:"hash"`
	DestroyTime int64  `json:"destroy_time"`
}

func NewCodeShareService() *CodeShare {
	cs := &CodeShare{
		store: make(map[string]*Code),
		order: make([]string, 0, MaxEntries),
	}

	go func() {
		for range time.Tick(3 * time.Minute) {
			cs.cleanExpired()
		}
	}()

	return cs
}

func (cs *CodeShare) Get(hash string) (*Code, bool) {
	cs.mu.Lock()
	code, ok := cs.store[hash]

	if ok {
		for i := range cs.order {
			if cs.order[i] == hash {
				cs.order = append(cs.order[:i], cs.order[i+1:]...)
				break
			}
		}
		cs.order = append(cs.order, hash)
	}

	cs.mu.Unlock()

	if ok && time.Now().Unix() <= code.DestroyTime {
		return code, true
	}
	return nil, false
}

func (cs *CodeShare) Upload(author, lang, content string, ttl int64) *Code {
	if len(content) > MaxContentSize {
		return nil
	}

	destroy := time.Now().Unix() + ttl

	hash := GetHash(10)
	code := &Code{
		Author:      author,
		Language:    lang,
		Content:     content,
		Hash:        hash,
		DestroyTime: destroy,
	}

	cs.mu.Lock()
	defer cs.mu.Unlock()

	if len(cs.store) >= MaxEntries {
		oldest := cs.order[0]
		delete(cs.store, oldest)
		cs.order = cs.order[1:]
	}
	cs.store[hash] = code
	cs.order = append(cs.order, hash)

	return code
}

func (cs *CodeShare) cleanExpired() {
	now := time.Now().Unix()
	cs.mu.Lock()
	defer cs.mu.Unlock()

	newOrder := cs.order[:0]

	for _, h := range cs.order {
		c := cs.store[h]
		if c == nil || c.DestroyTime < now {
			delete(cs.store, h)
			continue
		}
		newOrder = append(newOrder, h)
	}
	cs.order = newOrder
}
```


# HttpTest

## 功能

向指定的URL发送request，并收到相应的response

## 后端

```go
type HttpTestReq struct {
	Method string            `json:"method"`
	URL    string            `json:"url"`
	Header map[string]string `json:"header"`
	Body   string            `json:"body"`
}

type HttpTestResp struct {
	Status     string              `json:"status"`
	StatusCode int                 `json:"status_code"`
	Header     map[string][]string `json:"header"`
	Body       string              `json:"body"`
}

type HttpTestService struct {
	client *http.Client
}

func NewHttpTestService() *HttpTestService {
	return &HttpTestService{
		client: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (s *HttpTestService) Do(req *HttpTestReq) (*HttpTestResp, error) {
	if strings.TrimSpace(req.URL) == "" {
		return nil, errors.New("url is empty")
	}
	method := strings.ToUpper(strings.TrimSpace(req.Method))
	if method == "" {
		method = http.MethodGet
	}

	var bodyReader io.Reader
	if req.Body != "" && method != http.MethodGet {
		bodyReader = strings.NewReader(req.Body)
	}

	httpReq, err := http.NewRequest(method, req.URL, bodyReader)
	if err != nil {
		return nil, err
	}

	for k, v := range req.Header {
		httpReq.Header.Set(k, v)
	}

	resp, err := s.client.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respBodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return &HttpTestResp{
		Status:     resp.Status,
		StatusCode: resp.StatusCode,
		Header:     resp.Header,
		Body:       string(respBodyBytes),
	}, nil
}

```


# Workplan

## 功能

一个简单的todo list


## 后端

略


# htmlhost

