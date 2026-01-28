# 八音 BaYinUI

一个现代化的音乐播放器应用，基于 React + Vite + TypeScript 构建。

## 项目简介

八音是一个功能完整的音乐播放器前端应用，提供歌曲、专辑、艺术家、播放列表等管理功能，支持 Navidrome 音乐服务器集成。

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 6
- **UI 组件**: Radix UI + shadcn/ui
- **样式**: Tailwind CSS
- **路由**: React Router
- **图标**: Lucide React

## 主要功能

- 🎵 歌曲浏览与播放
- 💿 专辑与艺术家管理
- 📝 播放列表创建与编辑
- 🔍 音乐搜索
- 📂 本地音乐扫描
- 🎨 现代化 UI 设计
- 🌐 Navidrome 服务器支持

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动。

### 构建生产版本

```bash
npm run build
```

构建产物将输出到 `build` 目录。

## 项目结构

```
src/
├── components/        # React 组件
│   ├── ui/           # shadcn/ui 基础组件
│   └── ...           # 业务组件（页面、播放器等）
├── context/          # React Context（音乐状态管理）
├── styles/           # 全局样式
├── routes.ts         # 路由配置
└── main.tsx          # 应用入口
```