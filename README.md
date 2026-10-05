# iwaraDown（byHarryZhang）

批量下载 Iwara 视频的工具，支持 Tampermonkey 脚本和浏览器扩展两种安装方式。

## 功能特性

- 🎬 批量下载 Iwara 视频
- 📁 自定义下载路径和文件名模板
- 🎨 液态玻璃 UI 效果
- ⚙️ 界面缩放设置（30%-100%）
- ⌨️ ESC 键关闭设置面板
- 📦 支持 Aria2 / 浏览器下载 / iwaradl 多种下载方式
- 🔧 导入/导出配置

## 安装方式

### 方式一：浏览器扩展（推荐）

1. 下载 [extension](https://github.com/HarryZLH/iwaraDown/tree/main/extension) 文件夹
2. 打开 Edge 浏览器，访问 `edge://extensions/`
3. 开启「开发人员模式」
4. 点击「加载解压缩的扩展」
5. 选择下载的 extension 文件夹

### 方式二：Tampermonkey 脚本

1. 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展
2. 点击 [iwaraDown.user.js](https://github.com/HarryZLH/iwaraDown/raw/main/v1.0/iwaraDown.user.js) 安装脚本

## 使用方法

- 页面右侧展开菜单栏，点击「设置」打开配置面板
- 在设置面板中配置下载路径、下载方式等
- 支持 ESC 键、点击遮罩、点击 × 按钮关闭面板

## 目录结构

```
iwaraDown（byHarryZhang）/
├── v1.0/
│   └── iwaraDown.user.js    # Tampermonkey 脚本
├── extension/                # 浏览器扩展
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── gm-compat.js
│   ├── iwaraDown.user.js
│   ├── popup.html
│   └── icons/
├── 打包扩展.bat
└── 更新脚本.bat
```

## 版本历史

| 版本 | 日期 | 更新内容 |
|------|------|----------|
| v1.0 | 2026-10-05 | 初始版本，液态玻璃 UI，自定义缩放，浏览器扩展支持 |

## 许可证

Apache-2.0