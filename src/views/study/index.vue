<template>
  <div class="ride-container">
    <div class="map-area">
      <div class="mock-route">
        <div class="marker start">起</div>
        <div class="route-line"></div>
        <div class="marker end">顺达五金百货 &gt;</div>
        <div class="distance-tag">距离近 48公里 70分钟</div>
      </div>
    </div>

    <div class="float-btn back-btn">&lt;</div>
    <div class="float-btn safety-btn">盾</div>
    <div class="right-float-group">
      <div class="float-btn icon-btn">◎</div>
      <div class="float-btn icon-btn">⊕</div>
      <div class="float-btn icon-btn">↑</div>
    </div>

    <div class="bottom-sheet">
      <div class="sheet-header">
        <h3>多选车型更快出发</h3>
      </div>

      <div class="sheet-body">
        <div class="sidebar">
          <div
            v-for="(item, index) in categories"
            :key="index"
            class="side-item"
            :class="{ active: activeCategory === index }"
            @click="activeCategory = index"
          >
            {{ item.name }}
            <span v-if="item.badge" class="badge">{{ item.badge }}</span>
          </div>
        </div>

        <div class="car-list">
          <div v-for="car in carList" :key="car.id" class="car-item" @click="toggleSelect(car)">
            <div class="car-info">
              <div class="car-img-wrapper">
                <div class="car-img">🚗</div>
                <span v-if="car.tag" class="car-tag" :class="car.tagType">{{ car.tag }}</span>
              </div>
              <div class="car-desc">
                <div class="car-name">{{ car.name }}</div>
                <div class="car-sub">{{ car.desc }}</div>
              </div>
            </div>

            <div class="price-info">
              <div class="price-top">
                <span class="price-label">{{ car.priceLabel }}</span>
                <span class="price-val">
                  <small>￥</small>
                  {{ car.price }}
                </span>
                <div v-if="car.isButton" class="action-btn">{{ car.btnText }}</div>
                <div v-else class="checkbox" :class="{ checked: car.selected }">
                  <span v-if="car.selected">✓</span>
                </div>
              </div>
              <div v-if="car.originalPrice" class="price-bottom">已优惠￥{{ car.discount }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="action-bar">
        <div class="action-left">
          <span class="action-label">预估</span>
          <span class="action-price">
            <small>￥</small>
            87-111
          </span>
        </div>
        <div class="action-right">立即打车</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'

  // 左侧分类数据
  const activeCategory = ref(0)
  const categories = ref([
    { name: '推荐' },
    { name: '城际' },
    { name: '拼车' },
    { name: '特价', badge: '2' },
    { name: '快速' },
    { name: '舒适' },
    { name: '六座' }
  ])

  // 右侧车型列表 Mock 数据 (对应图2)
  const carList = ref([
    {
      id: 1,
      name: '顺风车',
      desc: '顺路车主来接你',
      tag: '👍',
      tagType: 'recommend',
      priceLabel: '一口价',
      price: '47',
      isButton: true,
      btnText: '去预约',
      selected: false
    },
    {
      id: 2,
      name: '惊喜特价',
      desc: '',
      tag: '折',
      tagType: 'discount',
      priceLabel: '一口价',
      price: '87.5',
      selected: true
    },
    {
      id: 3,
      name: '特惠快车',
      desc: '大家常选',
      tag: '惠',
      tagType: 'sale',
      priceLabel: '一口价',
      price: '110.3',
      originalPrice: '131.3',
      discount: '21',
      selected: true
    },
    {
      id: 4,
      name: '滴滴快车',
      desc: '3秒',
      priceLabel: '一口价',
      price: '117.2',
      originalPrice: '137.9',
      discount: '20.7',
      selected: false
    },
    {
      id: 5,
      name: '滴滴特快',
      desc: '68秒无应答赔5元',
      tag: '⚡',
      tagType: 'fast',
      priceLabel: '一口价',
      price: '140.9',
      selected: false
    }
  ])

  // 切换选中状态
  const toggleSelect = (car: any) => {
    if (!car.isButton) {
      car.selected = !car.selected
    }
  }
</script>

<style scoped>
  /* 全局重置与字体 */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  .ride-container {
    width: 100vw;
    height: 100vh;
    position: relative;
    background-color: #f5f7fa;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    overflow: hidden;
  }

  /* 1. 地图区域占位样式 */
  .map-area {
    width: 100%;
    height: 45%;
    background: #e0f2e9; /* 模拟地图底色 */
    position: relative;
    overflow: hidden;
  }
  .mock-route {
    position: absolute;
    top: 40%;
    left: 30%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .route-line {
    width: 6px;
    height: 80px;
    background: #00b578;
    margin: 5px 0;
    transform: rotate(30deg);
  }
  .marker {
    background: #00b578;
    color: white;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: bold;
  }
  .marker.end {
    background: #ff5000;
    border-radius: 20px;
    padding: 8px 16px;
  }
  .distance-tag {
    background: rgba(0, 0, 0, 0.6);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    margin-top: 10px;
  }

  /* 2. 悬浮按钮控件 */
  .float-btn {
    position: absolute;
    width: 36px;
    height: 36px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 16px;
    color: #333;
  }
  .back-btn {
    top: 20px;
    left: 16px;
  }
  .safety-btn {
    top: 80px;
    left: 16px;
    background: #1677ff;
    color: #fff;
  }
  .right-float-group {
    position: absolute;
    top: 60px;
    right: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* 3. 底部抽屉面板 */
  .bottom-sheet {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60%;
    background: #fff;
    border-radius: 20px 20px 0 0;
    display: flex;
    flex-direction: column;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  }
  .sheet-header {
    padding: 16px;
    font-size: 18px;
    font-weight: 800;
    color: #333;
  }
  .sheet-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  /* 左侧导航 */
  .sidebar {
    width: 80px;
    background: #f7f7f7;
    overflow-y: auto;
  }
  .side-item {
    padding: 16px 0;
    text-align: center;
    font-size: 14px;
    color: #666;
    position: relative;
  }
  .side-item.active {
    background: #fff;
    color: #333;
    font-weight: bold;
  }
  .badge {
    position: absolute;
    top: 8px;
    right: 12px;
    background: #ff5000;
    color: #fff;
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 10px;
  }

  /* 右侧车型列表 */
  .car-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 16px;
  }
  .car-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 0;
    border-bottom: 1px solid #eee;
  }
  .car-info {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .car-img-wrapper {
    position: relative;
    width: 40px;
    height: 40px;
    background: #f0f0f0;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
  }
  .car-tag {
    position: absolute;
    top: -6px;
    left: -6px;
    color: #fff;
    font-size: 10px;
    padding: 2px 4px;
    border-radius: 4px 4px 4px 0;
  }
  .tagType.discount {
    background: #ff5000;
  }
  .tagType.sale {
    background: #ff5000;
  }
  .tagType.recommend {
    background: #00b578;
  }
  .tagType.fast {
    background: #ff8c00;
  }

  .car-name {
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }
  .car-sub {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }

  /* 价格区域 */
  .price-info {
    text-align: right;
  }
  .price-top {
    display: flex;
    align-items: baseline;
    justify-content: flex-end;
    gap: 4px;
  }
  .price-label {
    font-size: 12px;
    color: #999;
  }
  .price-val {
    font-size: 20px;
    font-weight: bold;
    color: #333;
  }
  .price-val small {
    font-size: 14px;
  }

  .price-bottom {
    font-size: 12px;
    color: #ff5000;
    margin-top: 4px;
  }

  /* 交互控件 */
  .action-btn {
    background: #fff;
    border: 1px solid #ff5000;
    color: #ff5000;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    margin-left: 8px;
  }
  .checkbox {
    width: 20px;
    height: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-left: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #fff;
  }
  .checkbox.checked {
    background: #ff5000;
    border-color: #ff5000;
  }

  /* 4. 底部黑橙动作条 */
  .action-bar {
    height: 60px;
    display: flex;
    margin: 10px 16px 20px 16px;
    border-radius: 30px;
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(255, 80, 0, 0.3);
  }
  .action-left {
    flex: 1;
    background: #2b2e3d;
    color: #fff;
    display: flex;
    align-items: baseline;
    padding: 0 20px;
    align-items: center;
  }
  .action-label {
    font-size: 14px;
    margin-right: 8px;
  }
  .action-price {
    font-size: 24px;
    font-weight: bold;
  }
  .action-price small {
    font-size: 16px;
  }

  .action-right {
    width: 120px;
    background: #ff5000;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    font-weight: bold;
  }
</style>
