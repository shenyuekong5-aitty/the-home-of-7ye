<template>
  <div class="void-center">
    <header class="identity-header">
      <div class="mbti-section">
        <h2 class="glitch-text" data-text="INFJ-T / FEARFUL-AVOIDANT">INFJ-T / FEARFUL-AVOIDANT</h2>
        <div class="trait-tags">
          <span>#高敏感</span>
          <span>#深渊凝视者</span>
          <span>#渴望与防御</span>
        </div>
      </div>
      <div class="system-time">
        SYSTEM STATUS:
        <span class="pulse-text">ACTIVE</span>
      </div>
    </header>

    <main class="core-grid">
      <div class="panel-box">
        <div class="panel-label">PSYCHOLOGICAL RADAR / 心理雷达</div>
        <div ref="radarRef" class="chart-obj"></div>
      </div>

      <div class="panel-box">
        <div class="panel-label">MENTAL ENTROPY / 精神熵波动</div>
        <div ref="entropyRef" class="chart-obj"></div>
      </div>

      <div class="panel-box right-panel">
        <div class="panel-label">DEFENSE MECHANISM / 防御机制</div>
        <div class="stat-list">
          <div v-for="item in defenseStats" :key="item.label" class="stat-item">
            <div class="stat-info">
              <span class="label">{{ item.label }}</span>
              <span class="value">{{ item.val }}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: item.val + '%', background: item.color }"></div>
            </div>
          </div>
        </div>

        <div class="warning-footer">
          <div class="warning-title">⚠️ ATTACHMENT ALERT</div>
          <p class="warning-desc">恐惧回避触发：检测到亲密距离过近，自动开启疏离协议...</p>
        </div>
      </div>
    </main>

    <div class="background-overlay"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive } from 'vue'
  import * as echarts from 'echarts'

  const defenseStats = reactive([
    { label: '社交回避', val: 88, color: '#FF007F' },
    { label: '自我洞察', val: 95, color: '#FFD700' },
    { label: '情感抑制', val: 72, color: '#00FFCC' },
    { label: '独立需求', val: 90, color: '#FFD700' }
  ])

  const radarRef = ref<HTMLElement>()
  const entropyRef = ref<HTMLElement>()

  onMounted(() => {
    // --- 雷达图：强化矛盾感 ---
    const radarChart = echarts.init(radarRef.value!)
    radarChart.setOption({
      radar: {
        indicator: [
          { name: '洞察力', max: 10 },
          { name: '同理心', max: 10 },
          { name: '防御边界', max: 10 },
          { name: '信任阈值', max: 10 },
          { name: '独立性', max: 10 },
          { name: '创造力', max: 10 }
        ],
        shape: 'polygon',
        splitNumber: 4,
        axisName: { color: '#FFD700', fontWeight: 'bold' },
        splitLine: { lineStyle: { color: 'rgba(255, 215, 0, 0.2)' } },
        splitArea: { show: false }
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: [10, 9, 9, 2, 9, 9], // 信任阈值极低，洞察与防御极高
              areaStyle: { color: 'rgba(255, 0, 127, 0.4)' },
              lineStyle: { color: '#FF007F', width: 3 },
              itemStyle: { color: '#FFF' }
            }
          ]
        }
      ]
    })

    // --- 精神熵图：深海脉冲 ---
    const entropyChart = echarts.init(entropyRef.value!)
    entropyChart.setOption({
      xAxis: {
        type: 'category',
        data: ['0:00', '4:00', '8:00', '12:00', '16:00', '20:00', '24:00'],
        axisLine: { show: false }
      },
      yAxis: { show: false },
      series: [
        {
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: [30, 80, 45, 90, 55, 100, 40], // 剧烈波动的数值
          lineStyle: { width: 4, color: '#00FFCC' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(0, 255, 204, 0.4)' },
              { offset: 1, color: 'transparent' }
            ])
          }
        }
      ]
    })
  })
</script>

<style scoped lang="scss">
  .void-center {
    min-height: 100vh;
    background: #050505;
    color: #fff;
    padding: 40px;
    font-family: 'Courier New', Courier, monospace;
    position: relative;
    overflow: hidden;

    // 故障效果标题
    .glitch-text {
      font-size: 32px;
      font-weight: 900;
      color: #ffd700;
      position: relative;
      text-shadow:
        2px 0 #ff007f,
        -2px 0 #00ffcc;
      &::after {
        content: attr(data-text);
        position: absolute;
        left: 2px;
        text-shadow: -1px 0 red;
        top: 0;
        color: white;
        background: black;
        overflow: hidden;
        clip: rect(0, 900px, 0, 0);
        animation: noise-anim 2s infinite linear alternate-reverse;
      }
    }
  }

  .core-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 30px;
    margin-top: 50px;
  }

  .panel-box {
    background: rgba(20, 20, 20, 0.9);
    border: 1px solid #333;
    padding: 20px;
    position: relative;
    box-shadow: inset 0 0 15px rgba(255, 0, 127, 0.1);

    .panel-label {
      font-size: 14px;
      color: #ffd700;
      margin-bottom: 20px;
      letter-spacing: 2px;
      text-transform: uppercase;
    }
  }

  .chart-obj {
    width: 100%;
    height: 350px;
  }

  /* 进度条样式 */
  .stat-item {
    margin-bottom: 20px;
    .stat-info {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 5px;
    }
    .progress-track {
      height: 4px;
      background: #222;
      .progress-fill {
        height: 100%;
        box-shadow: 0 0 10px currentColor;
      }
    }
  }

  /* 底部警告区 */
  .warning-footer {
    margin-top: 30px;
    border: 1px solid #ff007f;
    padding: 15px;
    animation: border-flash 1s infinite alternate;
    .warning-title {
      color: #ff007f;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .warning-desc {
      font-size: 12px;
      color: #888;
    }
  }

  @keyframes noise-anim {
    0% {
      clip: rect(10px, 9999px, 50px, 0);
    }
    100% {
      clip: rect(80px, 9999px, 100px, 0);
    }
  }

  @keyframes border-flash {
    from {
      opacity: 0.5;
    }
    to {
      opacity: 1;
    }
  }

  .pulse-text {
    color: #00ffcc;
    animation: flash 1s infinite;
  }
  @keyframes flash {
    50% {
      opacity: 0;
    }
  }
</style>
