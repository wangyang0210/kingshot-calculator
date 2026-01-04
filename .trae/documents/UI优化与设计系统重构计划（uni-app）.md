## 选型结论
- 主库：uView Plus（uview-plus）——覆盖表单、栅格、卡片、按钮、标签、统计等，生态成熟，uni-app 兼容性好
- 辅助：
  - ThorUI（t-）——若需数据表格/复杂栅格，可引入 t-table/t-grid
  - ColorUI（cui-）——轻量级样式工具，用于快速统一色彩与间距
- 备选：Wot Design Uni / NutUI-uni（如需更精致的表单体验或更细颗粒度组件）

## 引入与主题配置（不执行，仅规划）
1. 依赖：`npm i uview-plus`（生产落地时执行）
2. 注册：`main.ts` 中 `import uviewPlus from 'uview-plus'; app.use(uviewPlus)`
3. 主题：在 `src/uni.scss` 定义 Design Tokens，并通过 uView 的主题变量覆盖（主色、强调色、背景、圆角、阴影、间距）
4. 暗色模式：新增 `ThemeToggle`，切换写入 localStorage，动态应用一组 dark tokens

## 组件映射与页面重构
- 通用容器：`u-card` 封装为 `CalcCard`（标题/副标题/内容插槽）
- 表单：`u-form` + `u-input`/`u-number-box`/`u-switch`/`u-select`，统一 `FormRow`（标签/控件/帮助/校验）
- 栅格：`u-row`/`u-col` 实现左右两栏布局（表单 + KPI/说明），≥900px 切两列，移动端单列
- KPI：`u-tag`/`u-statistic` 组合 `KPIGrid`（图标+数值+标签，卡片化，紧凑模式）
- 表格：
  - 优先使用 `u-table`（如符合需求）；否则自定义 `DataTable`：粘性表头、斑马行、横向滚动、列压缩（移动端）
  - ThorUI 备选 `t-table` 用于更复杂场景
- 按钮：`u-button`（主按钮、次按钮、危险按钮），固定“计算”按钮位置，减少滚动后找不到操作

## 页面改造计划
- 首页（index）：
  - 使用 `u-grid` + `u-card` 组合四个入口卡片（图标/标题/描述）
  - 顶部右侧：语言选择（下拉）+ 主题切换（暗色）
- 建筑页（building）：
  - 左侧 `u-form`，右侧 `KPIGrid` + 文案说明卡片
  - “包含前置建筑”等高级选项折叠到 `u-collapse` 区，减少主表单噪音
  - 结果表格：粘性表头、紧凑行距、移动端支持横向滚动
- 装备页（gear）：
  - 槽位选择改为 `u-checkbox-group`，每个项使用 `u-avatar`/`u-tag` 表示兵种类别
  - 阶段选择用 `u-picker`，结果以 `KPIGrid` + 表格显示
- 宝石页（charm）：
  - 当前/目标等级用 `u-picker`；兵种数量使用 `u-number-box`，并提供“一键默认 3·3·3”按钮
  - 结果 `KPIGrid` + 明细表格
- 训练页（training）：
  - `u-tabs` 切换两种输入模式（加速天数 / 部队数量）
  - 结果以“指标-单兵-总计”的表格呈现，提供复制/导出（可选）

## 文案与图标
- 文案：优化 i18n 字典，标题/副标题更友好（示例：建筑页“计算升级资源与耗时”）
- 图标：每页使用 3–5 个轻量 SVG（资源/时间/属性/评分），统一颜色与大小

## 可访问性与动效
- 对比度≥4.5；键盘焦点样式统一；按钮/表格列添加 aria-label
- 细微动效：按钮/卡片 hover/press 态、表格行悬停高亮；避免大规模动画

## 性能与工程
- 按需引入 uView 组件；避免全量导入
- 组件封装在 `src/components`，页面仅组合；样式集中在 `uni.scss`
- H5 构建开启压缩；图标/背景图做体积控制

## 交付步骤与验收
- 第1步：落地 uView + Design Tokens，完成 `CalcCard/FormRow/KPIGrid/DataTable` 组件
- 第2步：建筑页 UI 改造（作为范例），联调功能与视觉
- 第3步：装备/宝石/训练页套用统一组件；完善首页导航
- 验收：统一视觉风格、移动端良好体验、表单可交互与清晰的结果呈现、暗色主题正常切换

若确认采用该方案，我将按照以上步骤开始改造，并在每一步提供预览供你验收。