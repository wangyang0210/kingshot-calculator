# Kingshot Calculator（uni-app）迁移说明

## 概述
本项目将原有 `calculator` 目录下的 Kingshot 计算器完整迁移至基于 uni-app（Vue3 + Vite）的新架构，目标是一次性覆盖 Web/H5 与 App(iOS/Android) 等平台，并保持原功能的一致性与可维护性。

## 目录结构
- src/i18n：国际化初始化与字典（当前接入 zh-CN，可扩展 ko/en/ja/zh-TW）
- src/data：静态数据资源（建筑、领主装备、领主宝石、训练/升阶）
- src/pages/index：首页入口（四大计算器）
- src/pages/calculator：四个计算器页面（building / gear / charm / training）
- src/main.ts：Vue/uni-app 入口，集成 i18n
- src/pages.json：页面注册与导航栏标题

## 迁移范围与功能对照
1. 建筑升级计算器（Building）
   - 输入：建筑类型、起始/目标等级、速度增益（建造/狼/职务）、法令开关、萨乌尔折扣
   - 输出：合计资源（应用萨乌尔折扣）、合计时间（应用速度/法令）、逐级表格
   - 数据来源：`src/data/buildings-calc.json`
2. 领主装备计算器（Gear）
   - 输入：勾选槽位、当前阶段、目标阶段
   - 输出：丝绸/金丝/草图/评分总计与明细
   - 数据来源：`src/data/governor-gear.json`
3. 领主宝石计算器（Charm）
   - 输入：当前/目标等级、各兵种数量（骑兵/步兵/弓兵）
   - 输出：手册/图纸总需求、属性总增量、逐级明细
   - 数据来源：`src/data/governor-charm.json`
4. 训练/升阶计算器（Training）
   - 输入：模式（训练/升阶）、训练速度%、输入模式（加速天数或部队数量）、fromTier/toTier
   - 输出：部队数/所需加速时间、HoG/KvK/Governor 积分、单兵耗时/总耗时
   - 数据来源：`src/data/ks_training_promotion_per_troop.json`

## 技术架构
- 框架：Vue3 + uni-app + Vite
- 国际化：vue-i18n（入口 `src/i18n/index.ts`）
- 数据导入：Vite 模块化静态导入（减少运行时 fetch）
- UI：基于 uni 组件（picker/input/switch/button）实现跨端一致的交互体验

## 运行与构建
1. 安装依赖
   ```bash
   npm install
   ```
2. 开发预览（H5）
   ```bash
   npm run dev:h5
   # 打开日志中的地址（如 http://localhost:5173/）
   ```
3. 构建（H5）
   ```bash
   npm run build:h5
   ```
4. App(iOS/Android) 打包
   - 推荐使用 HBuilderX 连接本项目进行 App 打包
   - 真机调试重点验证：
     - picker/input/switch 在移动端的交互一致性
     - 表格滚动与性能（大区间选择时）
     - 页面导航与返回逻辑

## 页面入口
- 首页：`src/pages/index/index.vue`（四大计算器入口按钮）
- 建筑：`/pages/calculator/building`
- 装备：`/pages/calculator/gear`
- 宝石：`/pages/calculator/charm`
- 训练：`/pages/calculator/training`

## 关键实现要点
- 建筑表格解析与区间合计
  - 将表格映射为结构化 Row(level/resources/time)
  - 区间合计 from+1..to，时间通过 `tf = law / (1 + speed/100)` 折算
  - 资源通过萨乌尔折扣率进行折算
- 装备/宝石区间合计
  - 使用阶段/等级键数组计算区间内的材料/属性差
  - 多槽位/多兵种输入合并总计
- 训练/升阶双模式
  - 基于 `time_sec_per_troop` 与速度因子实现「加速天数→部队数」与「部队数→加速时间」双向计算
  - 输出活动积分与战力提升

## 国际化
- 入口：`src/i18n/index.ts`
- 字典：`src/i18n/zh-CN/calc.json`
- 扩展建议：按原站的 `i18n/ko|en|ja|zh-TW` 添加多语言字典并在 i18n 初始化中注册

## 性能优化
- 静态数据模块导入（Vite）减少运行期 IO
- 响应式渲染与轻量化栅格，避免大表格阻塞
- 页面内数据与计算逻辑保持纯函数化，易于测试与扩展

## 测试建议
1. 功能测试
   - 四个计算器在典型区间与极端区间（如 TG）下输出与原站一致
   - 萨乌尔折扣/速度/法令开关对结果的影响正确
2. 兼容测试
   - H5：桌面/移动浏览器
   - App：iOS/Android 真机，检查交互与性能
3. 多语言（可选）
   - 添加多语言包后，切换语言时标签与占位文本更新正确

## 后续工作
- 添加 ko/en/ja/zh-TW 国际化字典
- 如需完整前置建筑联动（建筑页），可继续移植原站递归保障与去环策略
- 封装统一的表格与 KPI 组件，进一步加强样式一致性

