# 大连理工校友就业平台

一个专为大连理工大学校友设计的职位发布与求职平台，旨在促进校友间的职业互助与资源共享。

## 功能特点

- 用户角色区分：职位发布者和个人求职者
- 职位发布与管理功能
- 多维度职位筛选系统
- 校友企业标记功能
- 简洁直观的用户界面

## 部署指南

### 前置要求

- Node.js 14+
- pnpm 6+
- Cloudflare账号

### 本地开发

1. 克隆仓库
```bash
git clone <repository-url>
cd dlut-alumni-jobs
```

2. 安装依赖
```bash
pnpm install
```

3. 启动开发服务器
```bash
pnpm dev
```

4. 在浏览器中访问 http://localhost:3000

### 构建生产版本

```bash
pnpm build
```

构建文件将输出到 `dist/static` 目录

### 在Cloudflare上部署

1. **准备工作**
   - 确保您的项目已推送到GitHub/GitLab/Bitbucket仓库
   - 拥有Cloudflare账号并登录到 [Cloudflare Dashboard](https://dash.cloudflare.com/)

2. **创建Cloudflare Pages项目**
   - 在Cloudflare Dashboard中，点击左侧导航栏的"Pages"
   - 点击"Create a project"按钮
   - 选择"Connect to Git"并授权Cloudflare访问您的代码仓库
   - 选择您的项目仓库

3. **配置构建设置**
   - **构建命令**: `pnpm build`
   - **构建输出目录**: `dist/static`
   - 点击"Environment variables (advanced)"展开环境变量设置
   - 添加变量: `NODE_VERSION` = `16` (或更高版本)
   - 添加变量: `PNPM_VERSION` = `7` (或更高版本)

4. **部署项目**
   - 点击"Save and Deploy"按钮
   - 等待构建和部署完成 (通常需要1-2分钟)
   - 部署完成后，您将获得一个 `*.pages.dev` 域名，可以通过该域名访问您的应用

5. **(可选) 自定义域名**
   - 在项目设置中，点击"Custom domains"
   - 点击"Set up a custom domain"
   - 输入您的域名并按照Cloudflare的指引完成DNS配置

## 技术栈

- React 18+
- TypeScript
- Tailwind CSS
- Vite
- React Router
- localStorage (数据存储)