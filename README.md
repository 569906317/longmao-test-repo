# SaaS Dashboard - 动态主题仪表盘

一个支持 Light/Dark 主题切换的销售数据看板项目。

## 技术栈

- **前端**: Vue 3 + Vite + Ant Design Vue + ECharts
- **后端**: Node.js + Express
- **容器化**: Docker + Docker Compose

## 项目结构

```
├── frontend/                # 前端项目
│   ├── src/
│   │   ├── App.vue         # 主组件 (含主题切换、图表)
│   │   ├── main.js         # 入口文件
│   │   └── styles/
│   │       └── global.css  # 全局样式 (主题变量)
│   ├── Dockerfile          # 前端容器配置
│   ├── nginx.conf          # Nginx 配置
│   └── package.json
├── backend/                 # 后端项目
│   ├── server.js           # Express 服务器
│   ├── Dockerfile          # 后端容器配置
│   └── package.json
├── docker-compose.yml       # Docker Compose 编排文件
└── README.md
```

## 功能特性

- **主题切换**: 支持 Light/Dark 主题一键切换，自动保存用户偏好
- **销售数据概览**: 总销售额、订单数量、新增用户、转化率等核心指标
- **可视化图表**:
  - 销售趋势折线图 (支持周/月/年维度切换)
  - 产品分类占比饼图
  - 区域销售对比柱状图
- **最近订单列表**: 实时展示最新订单状态
- **响应式设计**: 适配不同屏幕尺寸

## 快速启动

### 方式一：Docker Compose 一键启动 (推荐)

```bash
# 构建并启动所有服务
docker-compose up --build

# 后台运行
docker-compose up -d --build
```

启动后访问:
- **前端页面**: http://localhost:3000
- **后端 API**: http://localhost:8080/api/dashboard

### 方式二：本地开发

**启动后端服务:**

```bash
cd backend
npm install
npm start
```

**启动前端服务:**

```bash
cd frontend
npm install
npm run dev
```

## API 接口

| 接口 | 方法 | 描述 |
|------|------|------|
| `/api/dashboard` | GET | 获取仪表盘全部数据 |
| `/api/stats` | GET | 获取统计卡片数据 |
| `/api/sales` | GET | 获取销售趋势数据 |
| `/api/categories` | GET | 获取产品分类数据 |
| `/api/regions` | GET | 获取区域销售数据 |
| `/api/orders` | GET | 获取最近订单列表 |
| `/api/health` | GET | 健康检查接口 |

## 常用命令

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down

# 查看日志
docker-compose logs -f

# 重新构建
docker-compose up --build

# 单独构建前端
docker-compose build frontend

# 单独构建后端
docker-compose build backend
```

## 截图预览

### Light 主题
主题通过顶部导航栏的开关进行切换，支持浅色/深色两种模式。

### 图表功能
- 销售趋势图支持周/月/年三种时间维度
- 产品分类饼图展示各类目占比
- 区域柱状图对比本月与上月数据

## License

MIT
