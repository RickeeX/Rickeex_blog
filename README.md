# Rickee's Blog

我的个人博客，记录技术思考和生活随想。

## 本地开发

项目使用 Node.js 24 和 npm：

```bash
npm ci
npm run dev
```

提交前可运行 `npm run check`，生产静态导出使用 `npm run build`。

## 依赖安全说明

Velite 当前通过 Sharp 0.34 处理仓库内可信图片，因此 `npm audit` 会保留两条仅影响构建期图片输入的 high 告警。不要使用 `npm audit fix --force` 建议的无效 Velite 降级；待 Velite 支持 Sharp 0.35 后再移除此例外。

## 联系我

- Email: rickeex@outlook.com
- GitHub: github.com/rickee
