<template>
  <div class="hardcore-dashboard">
    <header class="header-section">
      <div class="mbti-container">
        <div class="mbti-tag">INFJ-T</div>
        <div class="identity-text">THE ADVOCATE / 提倡者</div>
      </div>
      <div class="center-title">
        <h1 class="main-title">STAND STATUS CENTER</h1>
        <div class="sub-title">精神维度 · 自我观测系统</div>
      </div>
      <div class="zodiac-badge">
        <span class="zodiac-icon">♑</span>
        <span>CAPRICORN</span>
      </div>
    </header>

    <main class="grid-layout">
      <div class="data-box radar-box">
        <div class="box-header">STAND ABILITY / 替身能力</div>
        <div ref="radarRef" class="chart-instance"></div>
      </div>

      <div class="data-box line-box">
        <div class="box-header">MENTAL OUTPUT / 精神产出</div>
        <div ref="learningRef" class="chart-instance"></div>
      </div>

      <div class="data-box info-box">
        <div class="box-header">KNOWLEDGE ARCHIVE / 知识存档</div>
        <div class="progress-wrapper">
          <div v-for="book in bookData" :key="book.name" class="progress-card">
            <div class="label-row">
              <span class="name">{{ book.name }}</span>
              <span class="val">{{ book.progress }}%</span>
            </div>
            <div class="bar-bg">
              <div class="bar-fill" :style="{ width: book.progress + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="terminal-footer">
          <div class="motto-glitch" data-text="“命运只垂青于清醒的疯子”">“命运只垂青于清醒的疯子”</div>
        </div>
      </div>
    </main>

    <div class="scan-line"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive } from 'vue'
  import * as echarts from 'echarts'

  const bookData = reactive([
    { name: 'STEEL BALL RUN', progress: 100 },
    { name: 'DEEP WORK', progress: 75 },
    { name: 'TYPESCRIPT DESIGN', progress: 60 },
    { name: 'PSYCHOLOGY OF SOUL', progress: 30 }
  ])

  const radarRef = ref<HTMLElement>()
  const learningRef = ref<HTMLElement>()

  onMounted(() => {
    // 1. 初始化雷达图 (极致 JOJO 风)
    const radarChart = echarts.init(radarRef.value!)
    radarChart.setOption({
      radar: {
        shape: 'polygon',
        splitNumber: 5,
        axisName: {
          color: '#FFD700',
          fontSize: 14,
          fontWeight: 'bold',
          fontStyle: 'italic',
          formatter: (val: string) => `【${val}】`
        },
        splitLine: { lineStyle: { color: 'rgba(255, 215, 0, 0.2)', type: 'dashed' } },
        splitArea: { show: false },
        axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        indicator: [
          { name: '韧性', max: 10 },
          { name: '抗压', max: 10 },
          { name: '努力', max: 10 },
          { name: '运气', max: 10 },
          { name: '安全', max: 10 },
          { name: '洞察', max: 10 }
        ]
      },
      series: [
        {
          type: 'radar',
          animationDuration: 2500,
          data: [
            {
              value: [9, 7, 7, 3, 3, 9],
              name: 'Inner Power',
              symbol: 'diamond',
              symbolSize: 10,
              lineStyle: { color: '#FF007F', width: 4, shadowBlur: 15, shadowColor: '#FF007F' },
              areaStyle: {
                color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
                  { offset: 0, color: 'rgba(255, 0, 127, 0)' },
                  { offset: 1, color: 'rgba(255, 0, 127, 0.7)' }
                ])
              },
              itemStyle: { color: '#fff', borderColor: '#FF007F', borderWidth: 2 }
            }
          ]
        }
      ]
    })

    // 2. 初始化折线图 (霓虹流线)
    const learningChart = echarts.init(learningRef.value!)
    learningChart.setOption({
      grid: { left: '10%', right: '5%', top: '15%', bottom: '15%' },
      xAxis: {
        type: 'category',
        data: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
        axisLine: { lineStyle: { color: '#444' } },
        axisLabel: { color: '#888' }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
        axisLabel: { color: '#888' }
      },
      series: [
        {
          data: [4, 6, 9, 5, 8, 12, 7],
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            width: 5,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#FF007F' },
              { offset: 1, color: '#FFD700' }
            ]),
            shadowBlur: 10,
            shadowColor: 'rgba(255, 0, 127, 0.5)'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(255, 0, 127, 0.3)' },
              { offset: 1, color: 'transparent' }
            ])
          }
        }
      ]
    })
  })
</script>

<style scoped lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Noto+Sans+SC:wght@400;900&display=swap');

  .hardcore-dashboard {
    min-height: 100vh;
    background: #000;
    color: #fff;
    padding: 40px;
    font-family: 'Noto Sans SC', sans-serif;
    overflow: hidden;
    position: relative;

    // 背景网格装饰
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255, 215, 0, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 215, 0, 0.05) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
    }
  }

  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 50px;
    border-bottom: 4px solid #ffd700;
    padding-bottom: 10px;

    .mbti-tag {
      font-family: 'Bebas Neue', cursive;
      font-size: 48px;
      line-height: 1;
      color: #ffd700;
      text-shadow: 3px 3px #ff007f;
    }

    .main-title {
      font-family: 'Bebas Neue', cursive;
      font-size: 64px;
      letter-spacing: 8px;
      text-align: center;
      background: linear-gradient(#ffd700, #ff007f);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 0 10px rgba(255, 0, 127, 0.5));
    }
  }

  .grid-layout {
    display: grid;
    grid-template-columns: 1fr 1.2fr 1fr;
    gap: 30px;
    height: 550px;
  }

  .data-box {
    background: rgba(20, 20, 20, 0.8);
    border: 1px solid #333;
    position: relative;
    padding: 20px;

    // 装饰角
    &::after {
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      width: 20px;
      height: 20px;
      border-top: 4px solid #ff007f;
      border-right: 4px solid #ff007f;
    }

    .box-header {
      font-family: 'Bebas Neue';
      font-size: 20px;
      color: #ffd700;
      margin-bottom: 20px;
      letter-spacing: 2px;
    }
  }

  .chart-instance {
    width: 100%;
    height: 90%;
  }

  /* 阅读进度美化 */
  .progress-card {
    margin-bottom: 25px;
    .label-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-weight: 900;
      font-style: italic;
      font-size: 14px;
      color: #ccc;
    }
    .bar-bg {
      height: 12px;
      background: #1a1a1a;
      border: 1px solid #333;
      overflow: hidden;
      .bar-fill {
        height: 100%;
        background: linear-gradient(90deg, #ff007f, #ffd700);
        box-shadow: 0 0 15px #ff007f;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: scan 2s infinite linear;
        }
      }
    }
  }

  @keyframes scan {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(100%);
    }
  }

  .terminal-footer {
    margin-top: auto;
    padding: 20px;
    border: 1px dashed #ffd700;
    text-align: center;
    .motto-glitch {
      font-weight: 900;
      font-size: 18px;
      color: #ffd700;
      letter-spacing: 2px;
    }
  }

  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: rgba(255, 0, 127, 0.2);
    box-shadow: 0 0 10px #ff007f;
    animation: moveScan 8s infinite linear;
    pointer-events: none;
  }

  @keyframes moveScan {
    from {
      top: 0;
    }
    to {
      top: 100%;
    }
  }
</style>
