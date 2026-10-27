# 发布页使用说明

单文件静态页面，无需构建、无外部依赖，直接部署即可（Nginx / 对象存储 / GitHub Pages 等任意静态托管）。

## 数据来源（GitHub Releases）

每个平台可配置 `repo: "用户名/仓库名"`（可以是自己的仓库，也可以是其它人的公开仓库），页面会自动读取该仓库的 GitHub Releases：

- **首页卡片 / 下载按钮**：来自 `releases/latest` —— 版本号（tag）、发布日期、附件列表；
- **更新日志**：来自 `releases` 列表 —— 每个版本的 Markdown 正文原样渲染；
- `prefer`：可选，主下载附件的匹配正则（命中的附件排第一位），如 fnOS 的 `"\\.fpk$"`；
- `exclude`：可选，从下载列表排除的附件正则，如 `"^tank-"`；`.sha256` 等校验文件默认排除；
- 拉取结果缓存 10 分钟（localStorage），避免触发 GitHub 匿名接口限流（每小时 60 次/IP）；
- `repo` 留空或拉取失败时，自动展示文件内 `latest` / `changelog` 的内置数据兜底。

示例（fnOS 版本来自第三方仓库）：

```js
repo: "luodaoyi/TAD6S4N10G-fnos",
prefer: "\\.fpk$",
exclude: "^tank-",
```

## 自动部署

已配置 GitHub Actions（`.github/workflows/deploy.yml`）：每次推送到 `main` 分支会自动构建并发布到 GitHub Pages，访问地址：

https://wuddc.github.io/release-page/

也可在仓库 Actions 页面手动触发（workflow_dispatch）。

## 页面结构

- **首页** `#/`：一排平台按钮（fnOS / 群晖 / Windows / Unraid / Linux），显示各系统最新版本号，点击进入对应系统下载页。
- **平台下载页** `#/platform/fnos`、`#/platform/synology`、`#/platform/windows`、`#/platform/unraid`、`#/platform/linux`：
  - 最新版下载按钮 + 文件名 / 架构 / 体积，多架构、多格式会列在「其他格式 / 架构」；
  - 「查看更新日志」按钮（点击滚动到日志区域并高亮）；
  - 完整更新日志（新增 / 优化 / 修复分组，新版本在上）。

页面自动适配深色模式（跟随系统）和手机端。

## 发新版本怎么改

只需编辑 `index.html` 中 `<script>` 顶部的 `PLATFORMS` 数据区（有中文注释标出）：

1. 更新对应平台的 `latest`（版本号、日期、安装包文件名 / 大小 / 链接）；
2. 在该平台 `changelog` 数组最前面插入新记录，`new` = 新增、`imp` = 优化、`fix` = 修复；
3. 把所有 `url: "#"` 替换为真实下载地址（`#` 为占位，点击不会跳转）。

产品名称、口号等文案在 `SITE` 配置和 `<h1>` / 页脚处修改，顶部导航和页脚链接目前是占位，替换 `href="#"` 即可。

## 本地预览

直接双击 `index.html` 用浏览器打开即可；或在该目录下起一个静态服务：

```
python -m http.server 8080
```

访问 http://localhost:8080 。
