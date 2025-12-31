## 立项背景
- 现状：静态站点（HTML/CSS/ES5 JS），功能涵盖首页、建筑/英雄、数据库、指南、计算器与优惠券展示，多语言与版本缓存已实现。
- 痛点：缺少统一核心与类型、测试与复用成本高；i18n 初始化与渲染存在竞争；数据仅本地 JSON，难以扩展；需要多端统一（Web/Mobile/Desktop/小程序）。

## 目标与原则
- 统一核心：抽象“数据模型 + 计算引擎 + i18n 接口 + 工具”为 TS 库，供各端复用。
- 多端覆盖：Web(H5/SSR/PWA) + Mobile(原生壳) + Desktop(桌面容器) + 小程序（微信/支付宝等）。
- 数据治理：可插拔数据源（本地/HTTP/CMS），强校验与版本缓存。
- 国际化：统一资源与加载就绪 Promise，杜绝回退英文的问题。

## 两条主线选型（对比）
- 方案 A：React 系（Next.js + React Native + Tauri）
  - 优点：SSR/SEO 与工程生态成熟；类型与测试配套完善；Tauri 体积小；
  - 缺点：小程序生态弱（需额外框架或单独实现）。
- 方案 B：uni-app（Vue3 + Vite + DCloud 平台）
  - 优点：一套代码覆盖 H5、App-Plus（移动 App）、微信/支付宝等小程序；国内生态完善；
  - 缺点：SSR 能力有限；桌面需间接方案（H5 打包进 Tauri/Electron）；对 TS 深度与大型工程体验需规范化补强。

结论：如您的核心诉求含“小程序分发与国内生态优先”，推荐主线采用“方案 B：uni-app”；同时保留核心库的纯 TS 设计，以便未来可平滑接入 React/Tauri 等替代方案。

## 统一架构（以 uni-app 为主）
- Monorepo（pnpm workspace）：
  - `packages/core`：TypeScript 核心（模型、计算、i18n接口、DataProvider、校验），零框架依赖；
  - `apps/web-h5`：uni-app H5 端（Vue3 + Vite），适配站点路由与 SEO（通过预渲染/SSR 网关）；
  - `apps/app-plus`：uni-app App（iOS/Android），沉浸式移动体验；
  - `apps/mp-weixin` 等：微信/支付宝/抖音小程序；
  - `apps/desktop`：Tauri 容器，加载 H5 构建产物（离线与自动更新）；
  - `services/admin`（可选）：Yii2 后台（REST API）管理优惠券/指南/数据版本。

## 关键技术设计
- 核心库（packages/core）
  - 数据 Schema：zod 定义 Buildings/Heroes/Waracademy/Calculators；
  - 计算引擎：建筑成本、训练促销、装备/宝石增益、时间/资源格式化；
  - DataProvider：`localJSON` / `httpJSON` / `cmsAPI`，带 ETag/版本缓存；
  - i18n 接口：与 vue-i18n 适配，提供就绪 Promise；
  - 工具：格式化、错误封装、日志与指标埋点接口。
- 前端（uni-app）
  - Vue3 + `<script setup>` + Pinia（或 Composables）管理状态；
  - 路由：页面映射（首页/建筑/英雄/数据库/指南/计算器/VIP/战学院）；
  - 组件：卡片/表格/图表/筛选器/可访问性增强（ARIA）；
  - i18n：vue-i18n 命名空间加载；渲染前 `await i18nReady()`；
  - H5 端 SEO：Prerender（如使用 Vite-plugin-ssg）或 SSR 代理网关（Nginx+Node）为关键页面注水；
  - 小程序端：资源体积控制、分包与运行时能力限制适配；
- 桌面端（Tauri）
  - 启动内置 H5 构建产物；离线缓存与版本检查；
  - 系统集成功能（剪贴板/窗口/文件）按需开放。
- 后端（可选，Yii2）
  - REST API：优惠券、指南、活动、数据版本；
  - RBAC 与审计；
  - 静态站点/小程序的 JSON 拉取与缓存。

## 数据与内容流转
- 开发/构建期：从 `services/admin` 拉取 JSON，校验入库并生成静态产物（含版本号）；
- 运行期：优先本地缓存，定期命中 ETag/版本检查，必要时热更新；
- 优惠券与活动：统一模型（有效期/永久标签/国际化文案），多端一致呈现。

## 国际化策略
- 统一 keys 与 namespaces：`common/buildings/heroes/calc/guides/footer` 等；
- 资源格式：`json`（与 vue-i18n 兼容）；
- 加载时机：路由渲染前等待 `i18nReady()`；
- 监控：缺失 key 收集与 CI 报告。

## 性能与 SEO
- H5：关键页面预渲染；图片优化与 CDN；按需分包；
- 小程序：分包与资源瘦身；
- 桌面：本地资源与增量更新；
- 站点：Sitemap、OG、JSON-LD。

## 测试与质量
- 单元测试：核心计算（Vitest/Jest）；
- 端到端：H5 用 Playwright；小程序端用官方测试工具或灰度验证；
- 规范：TS、ESLint、Prettier、提交钩子；
- 回归：与旧站样本对比。

## 运维部署
- CI/CD：GitHub Actions；
- H5：静态托管（Vercel/CF Pages）或自托管；
- App：DCloud 打包；
- 小程序：平台审核与发布；
- 桌面：Tauri 分发与自动更新；
- 后端：Yii2/Nginx/HTTPS，令牌鉴权与速率限制。

## 迁移路线
- M1：提取核心逻辑到 `packages/core`；
- M2：完成 H5 端（uni-app）并与现站并行验证；
- M3：App-Plus 与微信小程序 MVP；
- M4：桌面端容器（Tauri）；
- M5：后台与运营端上线（如需要）。

## 风险与对策
- SSR 需求：H5 以预渲染/SSR网关补强；
- 大型工程体验：以 TS + 规范 + 测试强化；
- 多端一致性：核心库单一真理源；
- 生态差异：保留 React/Tauri 备选路径，避免技术锁定。

## 立即优化（保持现站稳定）
- 渲染前等待 I18N 就绪：将页脚工具渲染挂钩到 i18n 初始化完成后，避免中文回退英文。

请确认：是否采纳“uni-app 主线方案”，以及是否需要接入 Yii2 后台管理。确认后我将细化任务拆解与时间评估。