## 项目结构分析
- 核心模块与路由
  - 首页与分类入口：现用 SPA 路由聚合各模块入口，参见 [routes.js](file:///Users/wangyang/Downloads/kingshot-calculator/js/routes.js#L201-L243)
  - 建筑：列表与详情，脚本在 [buildings.js](file:///Users/wangyang/Downloads/kingshot-calculator/js/pages/buildings.js)，页面在 [buildings.html](file:///Users/wangyang/Downloads/kingshot-calculator/pages/buildings.html)
  - 英雄：列表与详情，脚本在 [heroes.js](file:///Users/wangyang/Downloads/kingshot-calculator/js/pages/heroes.js) 与 [hero.js](file:///Users/wangyang/Downloads/kingshot-calculator/js/pages/hero.js)，页面在 [heroes.html](file:///Users/wangyang/Downloads/kingshot-calculator/pages/heroes.html) 与 [heroes/hero.html](file:///Users/wangyang/Downloads/kingshot-calculator/pages/heroes/hero.html)
  - 计算器：建筑/天赋/装备/训练，页面在 [pages/calculators](file:///Users/wangyang/Downloads/kingshot-calculator/pages/calculators) 目录
  - 数据库与指南：页面在 [pages/database](file:///Users/wangyang/Downloads/kingshot-calculator/pages/database) 与 [pages/guides](file:///Users/wangyang/Downloads/kingshot-calculator/pages/guides)
  - 战争学院（黄金兵种）：页面在 [waracademy.html](file:///Users/wangyang/Downloads/kingshot-calculator/pages/waracademy.html) 与脚本 [waracademy.js](file:///Users/wangyang/Downloads/kingshot-calculator/js/pages/waracademy.js)
- 公共资源与数据
  - i18n：JSON 多语言包位于 [i18n/*](file:///Users/wangyang/Downloads/kingshot-calculator/i18n)
  - 数据源：业务 JSON 位于 [data/*](file:///Users/wangyang/Downloads/kingshot-calculator/data)
  - 样式：公共与页面 CSS 位于 [css/*](file:///Users/wangyang/Downloads/kingshot-calculator/css)
- 现有技术特征与差异点
  - 自定义 SPA 路由、动态脚本/样式加载与 HTML 片段渲染（不依赖框架）
  - 直接 DOM 操作与自定义 i18n 初始化；路径与语言代码的归一化需在小程序端重做
  - 小程序不支持浏览器 DOM/History API，需迁移为页面与组件模型，导航改用 uni.navigateTo/back

## 技术架构搭建
- 新项目初始化
  - 使用 HBuilderX 或 CLI 创建 uni-app（Vue3 组合式 API）项目，目标平台设置为 mp-weixin
  - 基础目录规划：
    - src/pages（小程序页面）、src/components（通用组件）、src/composables（计算器与数据逻辑）、src/utils（适配与工具）、src/stores（如需状态管理可用 Pinia）、static（图片与 JSON 数据）、i18n（沿用现有多语言包）
  - 配置文件
    - pages.json：声明各页面与分包、页面样式与导航方式
    - manifest.json：平台与权限、网络域名白名单、分包与优化参数
    - uni.scss：全局设计变量与主题色，适配 rpx 与安全区域
  - 多语言方案
    - 采用 @dcloudio/uni-i18n 或轻量自研 i18n 适配，沿用现有 key 与 JSON 结构，支持 zh-CN/zh-TW/en/ko/ja

## 路由与页面映射
- 主包页面
  - pages/home/index：原首页入口
  - pages/buildings/index：建筑列表
  - pages/buildings/detail：建筑详情（接收名称/等级参数）
  - pages/heroes/index：英雄列表
  - pages/hero/detail：英雄详情（接收 slug 参数）
- 分包页面（减包体积与加速首屏）
  - subpackages/calculators：建筑/天赋/装备/训练计算器各页面
  - subpackages/database：数据库各主题页面
  - subpackages/waracademy：战争学院三兵种页面与汇总页
- 导航与参数
  - 所有历史路由转换为页面跳转：uni.navigateTo({ url: '/pages/...?...' })
  - 详情页通过 onLoad(options) 读取参数；分享/场景通过 onShareAppMessage/onShow 解析

## 代码迁移与重构
- 业务逻辑
  - 将现有 JS 页面逻辑迁移为 Vue3 组合式 API（setup/composables）：计算器算法与数据聚合独立为 src/composables/*
  - 数据加载：静态 JSON 直接 import 或在小程序端通过 uni.request 读取 static 路径
- 组件化与 UI 适配
  - 将现有模板片段重构为 uni-app 组件（列表、栅格、卡片、详情表格等），样式单位统一为 rpx，适配暗色/安全区
  - 公共头部/底部与语言切换重构为全局组件与页面内头部 Slot
- i18n 重构
  - 统一语言检测与切换：保留 zh-CN/zh-TW 归一化；语言状态写入 storage 与全局 i18n；页面 onShow 时应用
  - 保留所有 data-i18n 键值，迁移为 t('key') 指令/方法
- 适配层
  - 封装 wx/uni 能力：
    - 消息订阅：封装订阅入口与授权流程（wx.requestSubscribeMessage）
    - 分享：onShareAppMessage/onShareTimeline 与分享图配置
    - 剪贴板/客服/系统能力：clipboard、openCustomerServiceConversation、getSystemInfo 等

## 测试与优化
- 功能测试
  - 小程序开发者工具全流程测试：导航、详情、计算器、语言切换、数据加载
  - 单元测试：使用 Vitest 针对计算器与数据聚合逻辑编写测试
- 性能优化
  - 分包与资源下沉：将大图与不常用页面纳入分包或 CDN
  - 首屏加速：精简首页模块、异步加载非关键数据、骨架屏
  - 包体积优化：图片压缩、剔除未用资源、按需引入组件
- 合规与审核
  - 网络域名与 https、隐私弹窗、授权说明与拒绝路径、涉及订阅消息的业务说明

## 交付标准
- 完整可运行的微信小程序项目代码，支持 mp-weixin 构建与真机运行
- 迁移说明与技术文档：目录结构、页面映射、适配层说明、语言包与数据源策略
- 性能优化报告与测试用例集：覆盖核心算法与页面流程

## 实施步骤（迭代）
- 阶段 1：基础架构与页面骨架搭建（home/buildings/heroes/waracademy 与分包声明）
- 阶段 2：i18n 与适配层落地（语言切换、能力封装、导航统一）
- 阶段 3：计算器与数据库模块迁移（composables + 分包页面）
- 阶段 4：测试与优化（功能/性能/包体积/审核合规）

## 保留与增强的小程序能力
- 开放能力接口：登录/授权、剪贴板、客服、系统信息、网络状态、文件存储（按需）
- 订阅消息：提供统一订阅入口，页面触达点与授权引导
- 分享能力：页面级分享与分享图优化，支持场景参数解析
- UI 规范：统一 rpx、组件语义化、TabBar/导航样式符合微信规范