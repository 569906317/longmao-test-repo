<template>
  <a-config-provider :theme="themeConfig">
    <a-layout class="layout" :style="{ minHeight: '100vh', background: 'var(--bg-primary)' }">
      <!-- Header -->
      <a-layout-header class="header">
        <div class="header-content">
          <div class="logo">
            <span class="logo-icon">📊</span>
            <span class="logo-text">SaaS Dashboard</span>
          </div>
          <div class="header-actions">
            <a-space :size="16">
              <a-tooltip :title="isDark ? '切换到亮色主题' : '切换到暗色主题'">
                <a-switch
                  :checked="isDark"
                  @change="toggleTheme"
                  checked-children="🌙"
                  un-checked-children="☀️"
                />
              </a-tooltip>
              <a-badge :count="5">
                <a-button type="text" :style="{ color: 'var(--text-primary)' }">
                  <template #icon><BellOutlined /></template>
                </a-button>
              </a-badge>
              <a-avatar :style="{ backgroundColor: '#1890ff' }">Admin</a-avatar>
            </a-space>
          </div>
        </div>
      </a-layout-header>

      <!-- Content -->
      <a-layout-content class="content">
        <!-- Stats Row -->
        <a-row :gutter="[16, 16]" class="stats-row">
          <a-col :xs="24" :sm="12" :lg="6" v-for="stat in stats" :key="stat.title">
            <div class="dashboard-card stat-card">
              <div class="stat-icon" :style="{ backgroundColor: stat.color + '20', color: stat.color }">
                <component :is="stat.icon" />
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.title }}</div>
                <div :class="['stat-change', stat.change >= 0 ? 'positive' : 'negative']">
                  <span v-if="stat.change >= 0">↑</span>
                  <span v-else>↓</span>
                  {{ Math.abs(stat.change) }}% 较上月
                </div>
              </div>
            </div>
          </a-col>
        </a-row>

        <!-- Charts Row -->
        <a-row :gutter="[16, 16]" class="charts-row">
          <a-col :xs="24" :lg="16">
            <div class="dashboard-card">
              <div class="card-header">
                <h3>销售趋势</h3>
                <a-radio-group v-model:value="salesPeriod" size="small">
                  <a-radio-button value="week">本周</a-radio-button>
                  <a-radio-button value="month">本月</a-radio-button>
                  <a-radio-button value="year">本年</a-radio-button>
                </a-radio-group>
              </div>
              <v-chart :option="salesChartOption" :theme="isDark ? 'dark' : ''" autoresize style="height: 350px" />
            </div>
          </a-col>
          <a-col :xs="24" :lg="8">
            <div class="dashboard-card">
              <div class="card-header">
                <h3>产品分类占比</h3>
              </div>
              <v-chart :option="pieChartOption" :theme="isDark ? 'dark' : ''" autoresize style="height: 350px" />
            </div>
          </a-col>
        </a-row>

        <!-- Second Charts Row -->
        <a-row :gutter="[16, 16]" class="charts-row">
          <a-col :xs="24" :lg="12">
            <div class="dashboard-card">
              <div class="card-header">
                <h3>区域销售对比</h3>
              </div>
              <v-chart :option="barChartOption" :theme="isDark ? 'dark' : ''" autoresize style="height: 300px" />
            </div>
          </a-col>
          <a-col :xs="24" :lg="12">
            <div class="dashboard-card">
              <div class="card-header">
                <h3>最近订单</h3>
                <a-button type="link" size="small">查看全部</a-button>
              </div>
              <a-table
                :columns="orderColumns"
                :data-source="recentOrders"
                :pagination="false"
                size="small"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'status'">
                    <a-tag :color="getStatusColor(record.status)">
                      {{ record.status }}
                    </a-tag>
                  </template>
                </template>
              </a-table>
            </div>
          </a-col>
        </a-row>
      </a-layout-content>

      <!-- Footer -->
      <a-layout-footer class="footer">
        SaaS Dashboard ©2024 Created with Vue + Echarts + Ant Design
      </a-layout-footer>
    </a-layout>
  </a-config-provider>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { theme } from 'ant-design-vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart, BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import {
  BellOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  RiseOutlined
} from '@ant-design/icons-vue'
import axios from 'axios'

// Register ECharts components
use([
  CanvasRenderer,
  LineChart,
  PieChart,
  BarChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

// Theme state
const isDark = ref(false)

// Load theme from localStorage
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDark.value = true
    document.documentElement.setAttribute('data-theme', 'dark')
  }
  fetchDashboardData()
})

// Toggle theme
const toggleTheme = (checked) => {
  isDark.value = checked
  if (checked) {
    document.documentElement.setAttribute('data-theme', 'dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
    localStorage.setItem('theme', 'light')
  }
}

// Ant Design theme config
const themeConfig = computed(() => ({
  algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 8
  }
}))

// Stats data
const stats = ref([
  { title: '总销售额', value: '¥126,560', change: 12.5, color: '#1890ff', icon: DollarOutlined },
  { title: '订单数量', value: '8,846', change: 8.2, color: '#52c41a', icon: ShoppingCartOutlined },
  { title: '新增用户', value: '2,450', change: -3.1, color: '#faad14', icon: UserOutlined },
  { title: '转化率', value: '3.8%', change: 15.3, color: '#722ed1', icon: RiseOutlined }
])

// Sales period
const salesPeriod = ref('month')

// Fetch dashboard data
const fetchDashboardData = async () => {
  try {
    const response = await axios.get('/api/dashboard')
    if (response.data) {
      // Update stats if API returns data
      if (response.data.stats) {
        stats.value = response.data.stats.map((s, i) => ({
          ...s,
          icon: [DollarOutlined, ShoppingCartOutlined, UserOutlined, RiseOutlined][i]
        }))
      }
    }
  } catch (error) {
    console.log('Using mock data - API not available')
  }
}

// Chart colors based on theme
const chartColors = computed(() => isDark.value 
  ? ['#1890ff', '#52c41a', '#faad14', '#722ed1', '#eb2f96']
  : ['#1890ff', '#52c41a', '#faad14', '#722ed1', '#eb2f96']
)

const textColor = computed(() => isDark.value ? 'rgba(255,255,255,0.85)' : '#333')

// Sales chart option
const salesChartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross' }
  },
  legend: {
    data: ['销售额', '订单量'],
    textStyle: { color: textColor.value }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    axisLabel: { color: textColor.value }
  },
  yAxis: [
    {
      type: 'value',
      name: '销售额(万)',
      axisLabel: { color: textColor.value },
      splitLine: { lineStyle: { color: isDark.value ? '#333' : '#eee' } }
    },
    {
      type: 'value',
      name: '订单量',
      axisLabel: { color: textColor.value },
      splitLine: { show: false }
    }
  ],
  series: [
    {
      name: '销售额',
      type: 'line',
      smooth: true,
      data: [65, 78, 92, 85, 110, 125, 142, 138, 155, 168, 175, 190],
      itemStyle: { color: '#1890ff' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(24,144,255,0.3)' },
            { offset: 1, color: 'rgba(24,144,255,0.05)' }
          ]
        }
      }
    },
    {
      name: '订单量',
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      data: [420, 510, 580, 520, 680, 750, 820, 790, 890, 950, 1020, 1100],
      itemStyle: { color: '#52c41a' }
    }
  ]
}))

// Pie chart option
const pieChartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item',
    formatter: '{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    right: 10,
    top: 'center',
    textStyle: { color: textColor.value }
  },
  series: [
    {
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: isDark.value ? '#1f1f1f' : '#fff',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      labelLine: { show: false },
      data: [
        { value: 1048, name: '电子产品', itemStyle: { color: '#1890ff' } },
        { value: 735, name: '服装鞋帽', itemStyle: { color: '#52c41a' } },
        { value: 580, name: '食品饮料', itemStyle: { color: '#faad14' } },
        { value: 484, name: '家居用品', itemStyle: { color: '#722ed1' } },
        { value: 300, name: '其他', itemStyle: { color: '#eb2f96' } }
      ]
    }
  ]
}))

// Bar chart option
const barChartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' }
  },
  legend: {
    data: ['本月', '上月'],
    textStyle: { color: textColor.value }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['华东', '华南', '华北', '华中', '西南', '西北'],
    axisLabel: { color: textColor.value }
  },
  yAxis: {
    type: 'value',
    axisLabel: { color: textColor.value },
    splitLine: { lineStyle: { color: isDark.value ? '#333' : '#eee' } }
  },
  series: [
    {
      name: '本月',
      type: 'bar',
      data: [320, 280, 250, 220, 180, 120],
      itemStyle: { color: '#1890ff', borderRadius: [4, 4, 0, 0] }
    },
    {
      name: '上月',
      type: 'bar',
      data: [280, 260, 230, 200, 160, 100],
      itemStyle: { color: '#91d5ff', borderRadius: [4, 4, 0, 0] }
    }
  ]
}))

// Order table columns
const orderColumns = [
  { title: '订单号', dataIndex: 'orderId', key: 'orderId' },
  { title: '客户', dataIndex: 'customer', key: 'customer' },
  { title: '金额', dataIndex: 'amount', key: 'amount' },
  { title: '状态', dataIndex: 'status', key: 'status' }
]

// Recent orders
const recentOrders = ref([
  { key: '1', orderId: 'ORD-001', customer: '张三', amount: '¥1,234', status: '已完成' },
  { key: '2', orderId: 'ORD-002', customer: '李四', amount: '¥2,567', status: '处理中' },
  { key: '3', orderId: 'ORD-003', customer: '王五', amount: '¥890', status: '已发货' },
  { key: '4', orderId: 'ORD-004', customer: '赵六', amount: '¥3,456', status: '已完成' },
  { key: '5', orderId: 'ORD-005', customer: '钱七', amount: '¥678', status: '待付款' }
])

// Get status color
const getStatusColor = (status) => {
  const colorMap = {
    '已完成': 'success',
    '处理中': 'processing',
    '已发货': 'warning',
    '待付款': 'error'
  }
  return colorMap[status] || 'default'
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
}

.header {
  background: var(--bg-secondary) !important;
  padding: 0 24px;
  box-shadow: var(--card-shadow);
  position: sticky;
  top: 0;
  z-index: 100;
  height: 64px;
  line-height: 64px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 24px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.content {
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

.stats-row {
  margin-bottom: 16px;
}

.stat-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.charts-row {
  margin-bottom: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

.footer {
  text-align: center;
  background: transparent !important;
  color: var(--text-secondary);
  padding: 16px 24px;
}
</style>
