# Markdown Editor 发布指南

## 文档信息

| 项目 | 内容 |
|------|------|
| 版本号 | v0.2.0 |
| 发布日期 | 2026-05-13 |
| 作者 | 胡宇峰 |

---

## 前置准备

### 环境要求

- Node.js 20.x
- pnpm 9.x
- Git

### 国内网络环境配置

在中国网络环境下，需要配置以下镜像源：

#### 1. pnpm 淘宝镜像

```bash
pnpm config set registry https://registry.npmmirror.com
```

#### 2. Electron 国内镜像

```bash
# 设置环境变量
export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
export ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/

# Windows (PowerShell)
$env:ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
$env:ELECTRON_BUILDER_BINARIES_MIRROR="https://npmmirror.com/mirrors/electron-builder-binaries/"

# Windows (CMD)
set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
set ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/
```

#### 3. 在 package.json 中配置（可选）

在项目根目录或 `apps/markdown-editor` 目录下的 `.npmrc` 文件中添加：

```ini
registry=https://registry.npmmirror.com
electron_mirror=https://npmmirror.com/mirrors/electron/
electron_builder_binaries_mirror=https://npmmirror.com/mirrors/electron-builder-binaries/
```

---

## 安装依赖

### 标准安装（需要网络）

```bash
cd /workspace
pnpm install
```

### 如果 Electron 下载失败

1. 先安装其他依赖（跳过 Electron）

```bash
pnpm install --ignore-scripts
```

2. 手动下载 Electron

可以从国内镜像下载对应版本的 Electron：
- 访问: https://npmmirror.com/mirrors/electron/
- 下载对应版本和平台的压缩包
- 解压到 `node_modules/electron/dist/` 目录

---

## 开发模式

### 启动开发服务器

```bash
# 进入应用目录
cd apps/markdown-editor

# 启动开发模式
pnpm dev
```

应用会在开发模式下启动，Vite 开发服务器会在默认端口运行，Electron 窗口会自动打开。

---

## 构建应用

### 1. 类型检查

```bash
# 在项目根目录
pnpm typecheck

# 或者在应用目录
cd apps/markdown-editor
pnpm typecheck
```

### 2. 代码检查

```bash
pnpm lint
```

### 3. 构建应用

```bash
# 根目录构建所有包
pnpm build

# 或者仅构建应用
cd apps/markdown-editor
pnpm build
```

构建产物会输出到 `apps/markdown-editor/dist/` 目录。

---

## 发布打包

### 安装依赖（首次）

确保已正确配置镜像源后安装：

```bash
cd /workspace
pnpm install
```

### 打包应用（不发布）

```bash
cd apps/markdown-editor
pnpm pack
```

这会创建可执行文件但不会生成安装包，产物在 `release/` 目录。

### 生成安装包

```bash
cd apps/markdown-editor
pnpm dist
```

这会根据当前平台生成对应的安装包：
- Windows: `.nsis` 安装包 + 便携版
- macOS: `.dmg` 磁盘镜像 + `.zip`
- Linux: `.AppImage` + `.deb` 包

产物会输出到 `apps/markdown-editor/release/` 目录。

### 特定平台打包

```bash
# Windows 平台
pnpm dist:win

# macOS 平台
pnpm dist:mac

# Linux 平台
pnpm dist:linux
```

---

## 构建产物说明

### 输出目录

构建完成后，`apps/markdown-editor/release/` 目录会包含：

```
release/
├── Markdown Editor-0.2.0-win.exe      # Windows 安装包
├── Markdown Editor-0.2.0-win-portable.exe # Windows 便携版
├── Markdown Editor-0.2.0-mac.dmg      # macOS 安装包
├── Markdown Editor-0.2.0-mac.zip      # macOS 压缩版
├── Markdown Editor-0.2.0-linux.AppImage # Linux AppImage
└── Markdown Editor-0.2.0-linux.deb    # Debian/Ubuntu 包
```

### 文件命名规范

格式: `${productName}-${version}-${platform}.${ext}`

示例:
- Windows: `Markdown Editor-0.2.0-win.exe`
- macOS: `Markdown Editor-0.2.0-mac.dmg`
- Linux: `Markdown Editor-0.2.0-linux.AppImage`

---

## 测试安装包

### Windows 测试

1. 下载或生成 `.exe` 安装包
2. 运行安装程序
3. 按照向导完成安装
4. 从开始菜单或桌面快捷方式启动应用

### macOS 测试

1. 下载或生成 `.dmg` 文件
2. 双击打开磁盘镜像
3. 将应用拖拽到 Applications 文件夹
4. 从 Launchpad 或 Applications 文件夹启动
5. 如遇安全提示，在"系统偏好设置 → 安全性与隐私"中允许

### Linux 测试

#### AppImage

```bash
chmod +x Markdown\ Editor-0.2.0-linux.AppImage
./Markdown\ Editor-0.2.0-linux.AppImage
```

#### Debian/Ubuntu

```bash
sudo dpkg -i Markdown\ Editor-0.2.0-linux.deb
sudo apt-get install -f  # 修复依赖（如需要）
```

---

## 发布流程

### 1. 准备发布

- [ ] 检查所有测试通过
- [ ] 更新版本号（`package.json`）
- [ ] 更新 CHANGELOG
- [ ] 更新发布文档
- [ ] 检查所有资源文件（图标、许可证等）

### 2. 创建 Git 标签

```bash
# 提交所有更改
git add .
git commit -m "chore: release v0.2.0"

# 创建标签
git tag -a v0.2.0 -m "Release v0.2.0"

# 推送标签
git push origin v0.2.0
```

### 3. 构建所有平台安装包

使用 CI/CD 或在不同平台上分别构建：

```bash
# 在 Windows 上
pnpm dist:win

# 在 macOS 上
pnpm dist:mac

# 在 Linux 上
pnpm dist:linux
```

### 4. 发布到 GitHub Releases

1. 访问项目仓库
2. 点击 "Releases" → "Draft a new release"
3. 选择刚创建的标签 `v0.2.0`
4. 填写发布说明（可从 README 复制）
5. 上传所有构建产物
6. 点击 "Publish release"

---

## 常见问题

### Q: Electron 下载超时？

**A:** 配置国内镜像：
```bash
export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
```

### Q: electron-builder 下载二进制失败？

**A:** 配置 electron-builder 镜像：
```bash
export ELECTRON_BUILDER_BINARIES_MIRROR=https://npmmirror.com/mirrors/electron-builder-binaries/
```

### Q: 如何不执行 postinstall 脚本？

**A:**
```bash
pnpm install --ignore-scripts
```

### Q: 如何在 CI 中构建？

**A:** 使用 GitHub Actions 或其他 CI 服务，配置镜像源，使用 `electron-builder` 多平台构建。

### Q: 签名应用需要什么？

**A:** 对于正式发布，需要：
- Windows: 代码签名证书
- macOS: Apple Developer ID
- 可以在 `package.json` 的 `build` 配置中添加签名相关配置

---

## electron-builder 配置说明

在 [apps/markdown-editor/package.json](file:///workspace/apps/markdown-editor/package.json) 中的关键配置：

### 基础配置

```json
{
  "appId": "com.markdown-editor.app",
  "productName": "Markdown Editor",
  "copyright": "Copyright © 2026 Hu Yufeng"
}
```

### 文件配置

```json
{
  "directories": {
    "output": "release",
    "buildResources": "build"
  },
  "files": [
    "dist/**/*"
  ]
}
```

### 平台特定配置

```json
{
  "mac": {
    "category": "public.app-category.productivity",
    "target": ["dmg", "zip"],
    "icon": "public/icon.svg"
  },
  "win": {
    "target": ["nsis", "portable"],
    "icon": "public/icon.svg"
  },
  "linux": {
    "target": ["AppImage", "deb"],
    "icon": "public/icon.svg",
    "category": "Office"
  }
}
```

### NSIS 安装程序配置

```json
{
  "nsis": {
    "oneClick": false,
    "perMachine": false,
    "allowToChangeInstallationDirectory": true,
    "deleteAppDataOnUninstall": false
  }
}
```

---

## 应用图标

当前使用 SVG 格式图标 [public/icon.svg](file:///workspace/apps/markdown-editor/public/icon.svg)。

如需更专业的图标，可以：
1. 使用在线工具将 SVG 转换为各平台格式
2. Windows: `.ico`
3. macOS: `.icns`
4. Linux: PNG 不同尺寸（16x16 到 256x256）

---

## 下一步

v0.2.0 发布后，下一版本（v0.3.0）可以考虑：

- 云端同步功能
- 协作编辑
- 插件系统
- 更多主题
- 多语言支持
- 性能优化

---

## 联系方式

- 开发者: 胡宇峰
- 邮箱: hyf2k@163.com
