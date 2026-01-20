const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from frontend build (for production)
app.use(express.static(path.join(__dirname, 'public')));

// Mock data for dashboard
const dashboardData = {
  stats: [
    { title: '总销售额', value: '¥126,560', change: 12.5, color: '#1890ff' },
    { title: '订单数量', value: '8,846', change: 8.2, color: '#52c41a' },
    { title: '新增用户', value: '2,450', change: -3.1, color: '#faad14' },
    { title: '转化率', value: '3.8%', change: 15.3, color: '#722ed1' }
  ],
  salesData: {
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    sales: [65, 78, 92, 85, 110, 125, 142, 138, 155, 168, 175, 190],
    orders: [420, 510, 580, 520, 680, 750, 820, 790, 890, 950, 1020, 1100]
  },
  categoryData: [
    { name: '电子产品', value: 1048 },
    { name: '服装鞋帽', value: 735 },
    { name: '食品饮料', value: 580 },
    { name: '家居用品', value: 484 },
    { name: '其他', value: 300 }
  ],
  regionData: {
    regions: ['华东', '华南', '华北', '华中', '西南', '西北'],
    currentMonth: [320, 280, 250, 220, 180, 120],
    lastMonth: [280, 260, 230, 200, 160, 100]
  },
  recentOrders: [
    { key: '1', orderId: 'ORD-001', customer: '张三', amount: '¥1,234', status: '已完成' },
    { key: '2', orderId: 'ORD-002', customer: '李四', amount: '¥2,567', status: '处理中' },
    { key: '3', orderId: 'ORD-003', customer: '王五', amount: '¥890', status: '已发货' },
    { key: '4', orderId: 'ORD-004', customer: '赵六', amount: '¥3,456', status: '已完成' },
    { key: '5', orderId: 'ORD-005', customer: '钱七', amount: '¥678', status: '待付款' }
  ]
};

// API Routes
app.get('/api/dashboard', (req, res) => {
  // Simulate some random variations in data
  const data = JSON.parse(JSON.stringify(dashboardData));
  
  // Add some randomness to make it feel more dynamic
  data.stats = data.stats.map(stat => ({
    ...stat,
    change: parseFloat((stat.change + (Math.random() - 0.5) * 2).toFixed(1))
  }));
  
  res.json(data);
});

app.get('/api/stats', (req, res) => {
  res.json(dashboardData.stats);
});

app.get('/api/sales', (req, res) => {
  const { period } = req.query;
  let data = { ...dashboardData.salesData };
  
  if (period === 'week') {
    data = {
      months: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      sales: [12, 15, 14, 18, 22, 25, 20],
      orders: [85, 92, 88, 105, 130, 145, 120]
    };
  } else if (period === 'year') {
    data = {
      months: ['2019', '2020', '2021', '2022', '2023', '2024'],
      sales: [850, 920, 1100, 1350, 1580, 1900],
      orders: [5200, 5800, 7200, 8500, 9800, 11500]
    };
  }
  
  res.json(data);
});

app.get('/api/categories', (req, res) => {
  res.json(dashboardData.categoryData);
});

app.get('/api/regions', (req, res) => {
  res.json(dashboardData.regionData);
});

app.get('/api/orders', (req, res) => {
  res.json(dashboardData.recentOrders);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Catch all - serve frontend for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Dashboard API available at http://0.0.0.0:${PORT}/api/dashboard`);
});
