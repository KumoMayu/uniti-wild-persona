# 大学生野生人格图鉴

很诡异

## 本地运行

```bash
npm install
npm run dev
```

页面：

- `/`
- `/wild-persona`

## 已包含

- 24 题本地题库
- 题目与选项随机
- 4 个隐藏维度计分
- 16 型结果映射
- localStorage 记忆上次结果
- 前端 Canvas 下载分享图
- Cloudflare Pages Functions + KV 聚合统计

## Cloudflare Pages

绑定一个 KV namespace，变量名设为 `STATS`。

接口：

- `POST /api/track-complete`
- `GET /api/stats`
