<template>
  <div class="void-center">
    <div class="scan-line"></div>

    <header class="identity-header">
      <div class="mbti-section">
        <h2 class="glitch-text" data-text="INFJ-T / FEARFUL-AVOIDANT">INFJ-T / FEARFUL-AVOIDANT</h2>
        <div class="trait-tags">
          <span>#深渊凝视者</span>
          <span>#IT架构师</span>
          <span>#信仰脊梁</span>
        </div>
      </div>
      <div class="system-time">
        INTELLECTUAL STATUS:
        <span class="pulse-text">SYNCHRONIZED</span>
      </div>
    </header>

    <main class="dashboard-grid">
      <div class="panel-box">
        <div class="panel-label">PSYCHOLOGICAL RADAR / 心理雷达</div>
        <div ref="radarRef" class="chart-obj"></div>
      </div>

      <div class="panel-box">
        <div class="panel-label">PHYSICAL ATTRIBUTES / 身体机能 (耐力型)</div>
        <div class="physical-container">
          <div ref="physRef" class="chart-obj"></div>
          <div class="phys-desc">
            <div v-for="desc in physDescs" :key="desc.title" class="desc-item">
              <span class="d-title">{{ desc.title }}</span>
              : {{ desc.content }}
            </div>
          </div>
        </div>
      </div>

      <div class="panel-box">
        <div class="panel-label">DEFENSE MECHANISM / 防御机制</div>
        <div class="stat-list">
          <div v-for="item in defenseStats" :key="item.label" class="stat-item">
            <div class="stat-info">
              <span>{{ item.label }}</span>
              <span>{{ item.val }}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill" :style="{ width: item.val + '%', background: item.color }"></div>
            </div>
          </div>
        </div>
        <div class="warning-footer">
          <div class="warning-title">⚠️ ATTACHMENT ALERT</div>
          <p class="warning-desc">检测到亲密距离过近，系统自动隔离协议已开启...</p>
        </div>
      </div>

      <div class="panel-box">
        <div class="panel-label">IT KNOWLEDGE STACK / 技术栈掌握</div>
        <div ref="itRef" class="chart-obj"></div>
      </div>

      <div class="panel-box book-archive">
        <div class="panel-label">LIBRARY ARCHIVE / 书籍存档 ({{ mockBooks.length }})</div>
        <div class="book-scroll-container">
          <div v-for="book in mockBooks" :key="book.id" class="book-card">
            <div class="book-id">#{{ book.id.toString().padStart(2, '0') }}</div>
            <div class="book-main">
              <div class="b-name">{{ book.bookName }}</div>
              <div class="b-author">{{ book.author }}</div>
              <p class="b-brief">{{ book.brief }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="panel-box idol-panel">
        <div class="panel-label">IDEOLOGICAL PILLARS / 精神偶像</div>
        <div class="idol-list">
          <div class="idol-item" v-for="idol in idols" :key="idol.name">
            <div class="idol-avatar">★</div>
            <div class="idol-info">
              <div class="idol-name">{{ idol.name }}</div>
              <div class="idol-motto">{{ idol.motto }}</div>
            </div>
          </div>
        </div>
        <div class="faith-footer">尊严只在剑锋之上，真理只在大炮射程之内。</div>
      </div>
    </main>

    <div class="background-overlay"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive } from 'vue'

  // ===== ECharts 按需引入 =====
  import * as echarts from 'echarts/core'
  import { RadarChart, BarChart } from 'echarts/charts'
  import { TitleComponent, TooltipComponent, LegendComponent, GridComponent, RadarComponent } from 'echarts/components'
  import { CanvasRenderer } from 'echarts/renderers'

  // 注册所有引入的组件
  echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent,
    RadarComponent,
    RadarChart,
    BarChart,
    CanvasRenderer
  ])

  const defenseStats = reactive([
    { label: '社交回避', val: 88, color: '#FF007F' },
    { label: '自我洞察', val: 95, color: '#FFD700' },
    { label: '情感抑制', val: 72, color: '#00FFCC' },
    { label: '独立需求', val: 90, color: '#FFD700' }
  ])

  const idols = [
    { name: '毛泽东', motto: '星星之火，可以燎原。' },
    { name: '艾跃进', motto: '真理只在大炮射程之内。' }
  ]

  const physDescs = [
    { title: '耐力', content: '顶级持久力，擅长长线攻坚。' },
    { title: '爆发', content: '瞬时输出弱，需蓄能。' },
    { title: '力量', content: '绝对力量处于平均基准。' },
    { title: '敏捷', content: '反应与协调能力稳定。' },
    { title: '速度', content: '位移速率较快，启动迅捷。' },
    { title: '柔韧', content: '关节活动幅度受限，僵硬预警。' }
  ]

  const mockBooks = [
    { id: 1, bookName: '平凡的世界', author: '路遥', brief: '全景式展现中国当代城乡社会生活的长篇小说' },
    { id: 2, bookName: '小巷人家', author: '大米', brief: '讲述普通人家的烟火人生' },
    { id: 3, bookName: '三体', author: '刘慈欣', brief: '人类与三体文明的交锋' },
    { id: 4, bookName: '云边有个小卖铺', author: '张嘉佳', brief: '关于思念、成长和告别的故事' },
    { id: 5, bookName: '嫌疑人X的献身', author: '东野圭吾', brief: '极致的推理与极致的爱情' },
    { id: 6, bookName: '罪与罚', author: '陀思妥耶夫斯基', brief: '探讨人性、道德与救赎' },
    { id: 7, bookName: '哑舍', author: '玄色', brief: '围绕古董展开的古风奇幻' },
    { id: 8, bookName: '龙族', author: '江南', brief: '少年与龙族的热血冒险' },
    { id: 9, bookName: '人间失格', author: '太宰治', brief: '人性的孤独与挣扎' },
    { id: 10, bookName: '活着', author: '余华', brief: '苦难与坚韧，直面生命本质' },
    { id: 11, bookName: '第七天', author: '余华', brief: '荒诞笔触描绘死后世界' },
    { id: 12, bookName: '素食者', author: '韩江', brief: '探讨身份、暴力与自我觉醒' },
    { id: 13, bookName: '小王子', author: '圣-埃克苏佩里', brief: '探讨爱与成长的寓言' },
    { id: 14, bookName: '恶意', author: '东野圭吾', brief: '深挖人性深处的恶意' },
    { id: 15, bookName: '双城记', author: '狄更斯', brief: '法国大革命背景下的爱与牺牲' },
    { id: 16, bookName: '月亮与六便士', author: '毛姆', brief: '理想与现实、艺术与生活的冲突' },
    { id: 17, bookName: '解忧杂货店', author: '东野圭吾', brief: '跨越时空的温暖治愈' },
    { id: 18, bookName: '摆渡人', author: '克莱儿', brief: '关于死亡、救赎与爱的奇幻' },
    { id: 19, bookName: '疯人说', author: '穆戈', brief: '精神病院医生的真实记录' },
    { id: 20, bookName: '病隙碎笔', author: '史铁生', brief: '病痛中对生命的深邃思考' },
    { id: 21, bookName: '布鲁克林有棵树', author: '贝蒂', brief: '贫民窟女孩的成长与坚韧' },
    { id: 22, bookName: '被讨厌的勇气', author: '岸见一郎', brief: '阿德勒心理学：勇气与自由' },
    { id: 23, bookName: '山茶文具店', author: '小川糸', brief: '代笔店书写的温柔故事' },
    { id: 24, bookName: '在细雨中呐喊', author: '余华', brief: '回望童年展现生命的真实' },
    { id: 25, bookName: '她的国', author: '吉尔曼', brief: '乌托邦式的女性主义经典' },
    { id: 26, bookName: '一间属于自己的房间', author: '伍尔夫', brief: '女性独立与创作的先声' }
  ]

  const radarRef = ref<HTMLElement>()
  const physRef = ref<HTMLElement>()
  const itRef = ref<HTMLElement>()

  onMounted(() => {
    // 雷达图1：心理雷达
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
              value: [10, 9, 9, 2, 9, 9],
              areaStyle: { color: 'rgba(255, 0, 127, 0.4)' },
              lineStyle: { color: '#FF007F', width: 3 }
            }
          ]
        }
      ]
    })

    // 雷达图2：身体机能
    const physChart = echarts.init(physRef.value!)
    physChart.setOption({
      radar: {
        indicator: [
          { name: '耐力', max: 10 },
          { name: '爆发力', max: 10 },
          { name: '速度', max: 10 },
          { name: '敏捷', max: 10 },
          { name: '柔韧', max: 10 },
          { name: '力量', max: 10 }
        ],
        shape: 'polygon',
        splitNumber: 4,
        axisName: { color: '#fff' },
        splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } },
        splitArea: { show: false }
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: [9, 3, 7, 5, 5, 5],
              areaStyle: { color: 'rgba(255, 215, 0, 0.3)' },
              lineStyle: { color: '#FFD700', width: 3 }
            }
          ]
        }
      ]
    })

    // 柱状图：技术栈
    const itChart = echarts.init(itRef.value!)
    itChart.setOption({
      grid: { left: '15%', right: '10%', top: '5%', bottom: '15%' },
      xAxis: { type: 'value', max: 100, splitLine: { show: false }, axisLabel: { show: false } },
      yAxis: {
        type: 'category',
        data: ['Vue3', 'TS', 'JAVA', 'HTML/CSS', 'Spring', 'ECharts'],
        axisLine: { show: false },
        axisLabel: { color: '#00FFCC', fontWeight: 'bold' }
      },
      series: [
        {
          type: 'bar',
          barWidth: 15,
          data: [90, 85, 70, 88, 65, 40],
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                { offset: 0, color: '#00FFCC' },
                { offset: 1, color: 'transparent' }
              ]
            },
            borderRadius: 2
          },
          label: { show: true, position: 'right', color: '#fff', formatter: '{c}%' }
        }
      ]
    })
  })
</script>

<style scoped lang="scss">
  .void-center {
    position: relative;
    min-height: 100vh;
    padding: 25px;
    overflow: hidden; /* 确保扫描线不会溢出 */
    font-family: Helvetica, Arial, sans-serif;
    color: #fff;
    background: #020202;
  }

  /* --- 激光扫描条 --- */
  .scan-line {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 2px;
    pointer-events: none; /* 不干扰点击和滚动 */
    background: rgb(0 255 204 / 40%);
    box-shadow:
      0 0 20px rgb(0 255 204 / 80%),
      0 0 40px rgb(0 255 204 / 40%);
    animation: scanning 6s linear infinite;
  }

  @keyframes scanning {
    0% {
      top: -5%;
    }

    100% {
      top: 105%;
    }
  }

  /* 原有布局样式保持不变 */
  .identity-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding-bottom: 10px;
    margin-bottom: 25px;
    border-bottom: 2px solid #ffd700;
  }

  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
  }

  .panel-box {
    position: relative;
    padding: 18px;
    background: rgb(12 12 12 / 95%);
    border: 1px solid #222;

    .panel-label {
      padding-left: 10px;
      margin-bottom: 15px;
      font-size: 13px;
      font-weight: bold;
      color: #ffd700;
      text-transform: uppercase;
      border-left: 4px solid #ff007f;
    }
  }

  .chart-obj {
    width: 100%;
    height: 260px;
  }

  .physical-container {
    display: flex;
    align-items: center;

    .phys-desc {
      z-index: 10;
      width: 140px;
      margin-left: -20px;
      font-size: 11px;
      color: #888;

      .desc-item {
        margin-bottom: 10px;

        .d-title {
          font-weight: bold;
          color: #ffd700;
        }
      }
    }
  }

  .book-archive {
    .book-scroll-container {
      height: 260px;
      padding-right: 8px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: #ffd700;
      }

      .book-card {
        padding: 12px;
        margin-bottom: 12px;
        background: rgb(255 255 255 / 2%);
        border-left: 2px solid #333;
        transition: 0.3s;

        &:hover {
          background: rgb(255 215 0 / 5%);
          border-left-color: #ffd700;
          transform: translateX(5px);
        }

        .book-id {
          font-size: 10px;
          color: #ff007f;
        }

        .b-name {
          margin: 3px 0;
          font-size: 14px;
          font-weight: bold;
        }

        .b-brief {
          margin-top: 5px;
          font-size: 11px;
          line-height: 1.3;
          color: #444;
        }
      }
    }
  }

  .idol-list {
    .idol-item {
      display: flex;
      align-items: flex-start;
      padding: 10px;
      margin-bottom: 15px;
      background: rgb(255 0 0 / 3%);
      border: 1px solid rgb(255 0 0 / 10%);

      .idol-avatar {
        width: 30px;
        font-size: 20px;
        color: #c00;
      }

      .idol-name {
        font-size: 15px;
        font-weight: bold;
        color: #ffd700;
      }

      .idol-motto {
        font-size: 12px;
        font-style: italic;
        color: #888;
      }
    }
  }

  .faith-footer {
    padding-top: 15px;
    font-size: 12px;
    color: #444;
    text-align: center;
    border-top: 1px solid #222;
  }

  .glitch-text {
    font-size: 24px;
    color: #ffd700;
    text-shadow: 2px 0 #ff007f;
  }

  .pulse-text {
    font-weight: bold;
    color: #0fc;
  }

  .stat-item {
    margin-bottom: 15px;

    .stat-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 11px;
      color: #aaa;
    }

    .progress-track {
      height: 3px;
      background: #1a1a1a;

      .progress-fill {
        height: 100%;
        box-shadow: 0 0 10px currentColor;
      }
    }
  }

  .warning-footer {
    padding: 10px;
    margin-top: 15px;
    border: 1px solid #ff007f;

    .warning-title {
      font-size: 12px;
      color: #ff007f;
    }
  }
</style>
