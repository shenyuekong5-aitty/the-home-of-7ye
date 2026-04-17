<template>
  <div class="data-center">
    <header class="dashboard-header">
      <div class="user-profile">
        <div class="mbti-badge">INFJ-T</div>
        <div class="zodiac-info">
          <span class="icon">♊</span>
          <span class="text">双子座 · 理想主义者</span>
        </div>
      </div>
      <h1 class="title">个人自我分析看板</h1>
      <div class="status-tags">
        <el-tag effect="dark" round type="success">状态：持续进化中</el-tag>
      </div>
    </header>

    <main class="dashboard-main">
      <section class="chart-card stand-ability">
        <h3 class="card-title">Stand Ability (自我分析)</h3>
        <div ref="radarRef" class="chart-container"></div>
      </section>

      <section class="chart-card learning-data">
        <h3 class="card-title">学习力场 (最近 7 日)</h3>
        <div ref="learningRef" class="chart-container"></div>
      </section>

      <section class="chart-card info-panel">
        <h3 class="card-title">精神食粮 (阅读进度)</h3>
        <div class="book-list">
          <div v-for="book in bookData" :key="book.name" class="book-item">
            <div class="book-info">
              <span>{{ book.name }}</span>
              <span>{{ book.progress }}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-inner" :style="{ width: book.progress + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="motto-box">
          <p class="motto">“洞察事物的本质，是提倡者的天赋。”</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive } from 'vue'
  import * as echarts from 'echarts'

  // --- 静态数据配置 ---
  const bookData = reactive([
    { name: '《被讨厌的勇气》', progress: 85 },
    { name: '《1984》', progress: 40 },
    { name: '《深入理解 TypeScript》', progress: 65 },
    { name: '《JOJO 的奇妙冒险》', progress: 100 }
  ])

  // DOM 引用
  const radarRef = ref<HTMLElement>()
  const learningRef = ref<HTMLElement>()

  // --- 图表初始化逻辑 ---
  onMounted(() => {
    initRadarChart()
    initLearningChart()
  })

  // 1. JOJO 替身雷达图
  const initRadarChart = () => {
    if (!radarRef.value) return
    const myChart = echarts.init(radarRef.value)

    const option = {
      radar: {
        shape: 'polygon',
        indicator: [
          { name: '韧性 (Resilience)', max: 10 },
          { name: '抗压 (Stress)', max: 10 },
          { name: '努力 (Effort)', max: 10 },
          { name: '运气 (Luck)', max: 10 },
          { name: '安全感 (Security)', max: 10 },
          { name: '洞察力 (Insight)', max: 10 }
        ],
        axisName: { color: '#888', fontSize: 12 },
        splitArea: {
          areaStyle: {
            color: ['rgba(125, 211, 252, 0.1)', 'rgba(125, 211, 252, 0.2)']
          }
        },
        splitLine: { lineStyle: { color: 'rgba(125, 211, 252, 0.3)' } }
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: [9, 7, 7, 3, 3, 9], // 你的数值
              name: '自我分析',
              areaStyle: { color: 'rgba(167, 139, 250, 0.6)' },
              lineStyle: { color: '#a78bfa', width: 3 },
              itemStyle: { color: '#a78bfa' }
            }
          ]
        }
      ]
    }
    myChart.setOption(option)
  }

  // 2. 学习时长折线图
  const initLearningChart = () => {
    if (!learningRef.value) return
    const myChart = echarts.init(learningRef.value)

    const option = {
      grid: { left: '10%', right: '5%', bottom: '15%' },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisLine: { lineStyle: { color: '#ccc' } }
      },
      yAxis: {
        type: 'value',
        name: 'Hours',
        splitLine: { lineStyle: { type: 'dashed', color: '#eee' } }
      },
      series: [
        {
          data: [4, 6, 5, 8, 3, 10, 7],
          type: 'line',
          smooth: true,
          color: '#7dd3fc',
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(125, 211, 252, 0.5)' },
              { offset: 1, color: 'rgba(125, 211, 252, 0)' }
            ])
          }
        }
      ]
    }
    myChart.setOption(option)
  }
</script>

<style scoped lang="scss">
  .data-center {
    min-height: 100vh;
    background: #0f172a; // 深蓝近黑色，适合大屏
    color: #f8fafc;
    padding: 20px;
    font-family: 'Inter', sans-serif;
  }

  /* 头部样式 */
  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid rgba(125, 211, 252, 0.2);
    padding-bottom: 15px;
    margin-bottom: 30px;

    .mbti-badge {
      background: #10b981; // INFJ 典型的绿色
      color: white;
      padding: 5px 15px;
      border-radius: 8px;
      font-weight: bold;
      font-size: 20px;
      display: inline-block;
    }

    .zodiac-info {
      margin-top: 5px;
      color: #94a3b8;
      font-size: 14px;
      .icon {
        margin-right: 5px;
        color: #fbbf24;
      }
    }

    .title {
      font-size: 24px;
      letter-spacing: 4px;
      background: linear-gradient(to right, #7dd3fc, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  /* 主体布局 */
  .dashboard-main {
    display: grid;
    grid-template-columns: 1fr 1.5fr 1fr;
    gap: 20px;
    height: 600px;
  }

  .chart-card {
    background: rgba(30, 41, 59, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 20px;
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;

    .card-title {
      font-size: 16px;
      color: #7dd3fc;
      margin-bottom: 20px;
      border-left: 4px solid #7dd3fc;
      padding-left: 10px;
    }

    .chart-container {
      flex: 1;
      width: 100%;
    }
  }

  /* 书籍进度条样式 */
  .book-list {
    flex: 1;
    .book-item {
      margin-bottom: 15px;
      .book-info {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        margin-bottom: 5px;
      }
      .progress-bar {
        height: 6px;
        background: #334155;
        border-radius: 3px;
        .progress-inner {
          height: 100%;
          background: linear-gradient(to right, #a78bfa, #f472b6);
          border-radius: 3px;
          transition: width 1s ease-in-out;
        }
      }
    }
  }

  .motto-box {
    margin-top: 20px;
    padding: 15px;
    background: rgba(167, 139, 250, 0.1);
    border-radius: 8px;
    .motto {
      font-style: italic;
      font-size: 13px;
      color: #cbd5e1;
      text-align: center;
    }
  }
</style>
