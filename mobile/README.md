# BuddhaFlow Mobile - 心流番茄钟

React Native 移动端应用，使用创新的疲劳累积模型管理专注时间。

## 功能特点

### 核心功能
- **正向计时器**：不打断心流状态的正向计时
- **疲劳累积模型**：基于二次函数的智能休息时间计算
- **自动休息管理**：根据疲劳度自动提醒和管理休息
- **数据持久化**：使用 AsyncStorage 保存所有会话数据
- **推送通知**：休息结束时的智能提醒

### 数据可视化
- **7天趋势图**：柱状图显示每日专注时长
- **24小时热力图**：展示一天中不同时段的专注表现
- **实时统计**：当前会话、今日、本周专注时间统计

### 疲劳累积模型

```
休息需求 = 3 + 0.004 × t_eff²
```

其中 `t_eff` 是累积的有效专注时间（分钟）

示例：
- 专注30分钟 → 需休息6.6分钟
- 专注60分钟 → 需休息17.4分钟
- 专注90分钟 → 需休息35.4分钟

## 技术栈

- **框架**：React Native (Expo)
- **状态管理**：React Hooks
- **数据持久化**：AsyncStorage
- **图表库**：react-native-chart-kit
- **通知**：expo-notifications
- **UI**：expo-linear-gradient, react-native-svg

## 安装和运行

### 环境要求
- Node.js 14+
- npm 或 yarn
- Expo Go App（用于在真机上测试）

### 安装依赖

```bash
npm install
```

### 运行应用

#### 开发模式（使用 Expo Go）

```bash
# 启动开发服务器
npm start

# 或者指定平台
npm run android  # Android
npm run ios      # iOS (需要 macOS)
npm run web      # Web 浏览器
```

#### 构建独立应用

```bash
# 构建 Android APK
expo build:android

# 构建 iOS IPA (需要 Apple 开发者账号)
expo build:ios
```

## 项目结构

```
mobile/
├── src/
│   ├── components/         # React 组件
│   │   ├── TimerSection.js      # 计时器显示区域
│   │   ├── StatsSection.js      # 统计数据卡片
│   │   ├── WeekChart.js         # 7天趋势图
│   │   └── HeatMap.js           # 24小时热力图
│   ├── hooks/             # 自定义 Hooks
│   │   └── useBuddhaFlow.js     # 核心状态管理
│   ├── utils/             # 工具函数
│   │   └── timeCalculations.js  # 时间计算和格式化
│   └── services/          # 服务层
│       └── storageService.js    # 数据持久化
├── App.js                 # 应用入口
├── app.json              # Expo 配置
└── package.json          # 依赖配置
```

## 使用说明

1. **开始专注**：点击"开始专注"按钮进入专注状态
2. **累积疲劳**：每次专注会累加到有效专注时间（t_eff），代表疲劳度
3. **智能休息**：当休息需求≥5分钟时，可以开始休息
4. **休息恢复**：
   - 休息充分（剩余≤3分钟）→ 疲劳清零
   - 休息不足 → 保留部分疲劳继续累积
5. **自动继续**：休息结束后会自动提醒开始专注

## 与 Web 版本的区别

| 特性 | Web 版本 | Mobile 版本 |
|------|---------|------------|
| 数据存储 | LocalStorage | AsyncStorage |
| 通知 | 浏览器通知 | 推送通知 |
| 图表 | HTML Canvas | react-native-chart-kit |
| 渐变背景 | CSS Gradient | expo-linear-gradient |
| UI 框架 | 原生 HTML/CSS | React Native |

## 开发路线图

- [x] 核心计时功能
- [x] 疲劳累积模型
- [x] 数据可视化
- [x] 数据持久化
- [x] 推送通知
- [ ] 自定义主题
- [ ] 专注音效
- [ ] 统计报告导出
- [ ] 目标设置
- [ ] 多设备同步

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License

## 联系方式

项目地址：https://github.com/SilenceMonk/BuddhaFlow
