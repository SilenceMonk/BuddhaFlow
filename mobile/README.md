# BuddhaFlow Mobile

基于疲劳累积模型的心流番茄钟移动应用，使用 React Native 和 Expo 开发。

## 功能特点

- ⏱️ **正向计时专注** - 不限制时长，自由专注
- 🧠 **疲劳累积模型** - 用 t_eff 跟踪疲劳，公式: rest = 3 + 0.004 × t_eff²
- 🎯 **动态休息管理** - 休息≥5分钟才能开始
- 🚶 **离开功能** - 外出时自动计算休息效果
- 📊 **数据可视化** - 过去7天专注时间柱状图和24小时效率热力图
- 💾 **数据持久化** - 使用 AsyncStorage 本地存储数据

## 技术栈

- **React Native** - 跨平台移动开发框架
- **Expo** - React Native 开发工具链
- **TypeScript** - 类型安全
- **React Navigation** - 导航管理
- **AsyncStorage** - 数据持久化
- **LinearGradient** - 渐变背景

## 项目结构

```
mobile/
├── src/
│   ├── components/      # UI 组件
│   │   ├── Button.tsx
│   │   ├── StatCard.tsx
│   │   ├── Timer.tsx
│   │   ├── StatusBadge.tsx
│   │   └── LeaveInfoCard.tsx
│   ├── screens/         # 屏幕
│   │   ├── FocusScreen.tsx
│   │   └── StatsScreen.tsx
│   ├── services/        # 服务层
│   │   ├── storage.ts   # 数据持久化
│   │   └── fatigueModel.ts  # 疲劳模型算法
│   ├── hooks/           # 自定义 Hooks
│   │   └── useBuddhaFlow.ts
│   ├── types/           # TypeScript 类型
│   │   └── index.ts
│   ├── constants/       # 常量
│   │   ├── index.ts
│   │   └── styles.ts
│   └── navigation/      # 导航配置
│       └── index.tsx
├── App.js               # 应用入口
├── package.json
└── tsconfig.json
```

## 快速开始

### 安装依赖

```bash
cd mobile
npm install
```

### 运行应用

```bash
# Android
npm run android

# iOS (需要 macOS)
npm run ios

# Web
npm run web
```

### 开发调试

使用 Expo Go 应用扫描二维码即可在真机上调试：

```bash
npm start
```

## 核心算法

### 疲劳累积模型

```typescript
// 从有效专注时间计算休息需求
rest_required = 3 + 0.004 × t_eff²

// 示例：
// t_eff = 30分钟 → 休息需求 = 6.6分钟
// t_eff = 60分钟 → 休息需求 = 17.4分钟
// t_eff = 90分钟 → 休息需求 = 35.4分钟
```

### 休息恢复

```typescript
// 从剩余休息需求反推新的疲劳度
if (rest_remaining <= 3) {
  t_eff = 0  // 完全恢复
} else {
  t_eff = sqrt((rest_remaining - 3) / 0.004)
}
```

## 使用说明

1. **开始专注** - 点击"开始专注"按钮进入专注状态
2. **暂停/继续** - 可以随时暂停或继续专注
3. **开始休息** - 当休息需求≥5分钟时，"开始休息"按钮激活
4. **自动提醒** - 休息时间结束后会自动提醒
5. **离开模式** - 长时间离开（吃饭、睡觉等）时点击"离开"，返回时会自动计算恢复的疲劳
6. **查看统计** - 切换到"统计"标签查看详细的数据分析

## 数据存储

所有数据都存储在设备本地，不会上传到服务器：

- **会话记录** - 每次专注的开始时间、时长和时段
- **离开状态** - 离开时的疲劳度和休息需求

## 开发说明

### 添加新功能

1. 在 `src/types/index.ts` 中定义类型
2. 在 `src/services/` 中实现业务逻辑
3. 在 `src/components/` 中创建 UI 组件
4. 在 `src/screens/` 中组装屏幕

### 修改样式

主要颜色定义在 `src/constants/index.ts` 中：

```typescript
export const COLORS = {
  primary: '#667eea',
  primaryDark: '#764ba2',
  success: '#10b981',
  // ...
};
```

## 许可证

MIT License

## 相关链接

- [Web 版本](../index.html)
- [项目文档](../README.md)
