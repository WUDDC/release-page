# AGENTS.md — 站点部署与源站使用须知（AI / 开发者必读）

> 2026-10-27 起，本仓库 **是整个网站的唯一真源（single source of truth）**。
> 任何"把文件直接传到服务器"的做法都是错误的：会绕过正式部署、造成多端内容不一致，
> 且上传的内容会在下一次自动部署中被仓库内容覆盖。

## 铁律

1. **禁止通过 FTP / 宝塔面板 / SCP 向源站 `tad.mi-d.cn`（156.233.226.16）上传任何站点文件。**
   源站不是部署目标，上面没有、也不应该有网站内容。
2. **唯一部署方式：向本仓库 `main` 分支 push。** 推送后自动完成三端发布，无需任何手工步骤：
   - GitHub Pages → https://wuddc.github.io/release-page/ （`.github/workflows/deploy.yml`）
   - EdgeOne Pages → https://test-curamwebsite.edgeone.app/ （EdgeOne 项目 git 集成 main，自动构建）
   - CNB 镜像 → https://cnb.cool/konno/release-page （`.github/workflows/sync-cnb.yml`）
3. **不要在源站上"顺手修内容"。** 线上内容有问题 → 改仓库 → push。
   源站仅剩的几个壳文件归站点所有者维护；确需紧急修改壳本身，先向所有者要 FTP 凭据，
   改动前备份原文件，改完向所有者说明改了什么、为什么。
4. **不要恢复 `download.html`**。它已于 2026-10-27 废弃，`release/` 是唯一的下载/更新日志入口。
5. **`/release-page/...` 旧路径已作废。** 仓库子目录已于 2026-10-27 由 `release-page/` 改名为
   `release/`，新内容一律引用 `release/`。介绍页里的链接必须用**相对路径**
   （站点同时部署在 github.io 子路径和 EdgeOne 域名根，绝对路径必然在其中一端失效）。

## 仓库结构

| 路径 | 说明 |
|---|---|
| `index.html` + `assets/` | 介绍页（TAD6S4N模块 官网首页） |
| `release/` | 发布页（下载 + 更新日志，运行时读 GitHub Releases API） |
| `404.html` `.htaccess` `.user.ini` | 源站遗留文件，仅源站语义，对 Pages/EdgeOne 无作用 |
| `.github/workflows/` | `deploy.yml`（GitHub Pages）+ `sync-cnb.yml`（CNB 同步） |

## 源站现状（tad.mi-d.cn —— 仅当访问壳用）

站点所有者**暂时无法修改 DNS**，源站目前靠 4 个 iframe 壳文件维持域名可访问
（地址栏保持 tad.mi-d.cn，iframe 按 EdgeOne 同路径加载内容，10 秒超时显示直达链接浮层）：

- `/index.html`、`/404.html`：→ EdgeOne + 原路径；根 `/404.html` 为智能版，
  对 `/release-page` 前缀路径映射到 EdgeOne `/release/`（兼容旧深链）
- `/release-page/index.html`、`/release-page/404.html`：→ EdgeOne `/release/` + 余路径
- nginx `error_page 404` 指向根 `/404.html`，所有不存在的路径都由壳兜底
- HTTPS 证书由面板自动续期（当前有效期至 2027-01-18）

壳文件**只存在于源站上，不在本仓库里**——不要把它们"补"进仓库，也不要在仓库里引用它们。

## ⚠️ 待办：DNS 切换（必须由站点所有者操作，AI 只能提醒）

EdgeOne 控制台对 `tad.mi-d.cn` 提示 **「请添加 CNAME」**，目标：
`tad.mi-d.cn.pages.dnsoe7.com`。
请到 `mi-d.cn` 的 DNS 解析服务商（hichina / 阿里云云解析）操作：

| 项目 | 值 |
|---|---|
| 主机记录 | `tad` |
| 记录类型 | CNAME |
| 记录值 | `tad.mi-d.cn.pages.dnsoe7.com` |
| TTL | 默认（600）即可 |

**注意：先删除 `tad` 现有的一条 A 记录（指向 156.233.226.16），再添加 CNAME**——
同一主机名下 A 与 CNAME 不能共存，不删旧记录会导致解析冲突、切换不生效。

生效后：tad.mi-d.cn 由 EdgeOne 直接服务（自动 HTTPS），访问不再经过源站壳。
收尾工作（生效确认后执行）：源站壳文件删除、服务器可下线；本文件"源站现状"一节随之作废，
请同步更新。

---

*本文件由 AI 协助整理于 2026-10-27。架构（部署方式、目录名、源站角色）发生任何变更时，必须同步更新本文件。*
