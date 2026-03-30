<template>
  <div class="music-page">
    <header class="music-header">
      <div class="header-content">
        <h2 class="anime-title">♪ 旋律之森 ♫</h2>
        <p class="subtitle">记录每一份心动瞬间~</p>
      </div>
      <div class="header-icon">🎧</div>
    </header>

    <div class="music-container">
      <div class="music-grid">
        <div 
          v-for="(music, index) in musicStore.musicList" 
          :key="index" 
          class="music-card"
        >
          <div class="card-inner">
            <div class="music-index">{{ index + 1 }}</div>
            <div class="music-info">
              <span class="music-name">{{ music.name }}</span>
              <span class="music-tag">{{ music.author }}</span>
            </div>
            <button class="play-btn" @click="gotoMusic">▶</button>
          </div>
          <div class="card-glow"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMusicStore } from '@/store/modules/music' // 确保路径正确

const musicStore = useMusicStore()
const gotoMusic = () => {
  window.open('https://music.163.com/', '_blank')
}
// 模拟加载数据
onMounted(async () => {
  try {
    await musicStore.getMusics()
  } catch (error) {
    console.error('获取音乐列表失败:', error)
  }
})
</script>

<style scoped>
/* 页面背景：采用淡紫色到粉色的梦幻渐变 */
.music-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
  padding: 30px;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 动漫风头部 */
.music-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  padding: 20px 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 182, 193, 0.3);
  margin-bottom: 30px;
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.anime-title {
  color: #ff85a2;
  font-size: 28px;
  font-weight: bold;
  text-shadow: 2px 2px 0px #fff;
  margin: 0;
}

.subtitle {
  color: #888;
  font-size: 14px;
  margin-top: 5px;
}

.header-icon {
  font-size: 40px;
  filter: drop-shadow(0 0 10px #ffb6c1);
}

/* 列表网格布局 */
.music-container {
  max-width: 1200px;
  margin: 0 auto;
}

.music-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

/* 音乐卡片设计 */
.music-card {
  position: relative;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card-inner {
  position: relative;
  z-index: 2;
  background: rgba(255, 255, 255, 0.9);
  padding: 20px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  border: 2px solid transparent;
  transition: all 0.3s;
}

.music-card:hover {
  transform: translateY(-5px) scale(1.02);
}

.music-card:hover .card-inner {
  border-color: #ffb6c1;
  background: #fff;
}

/* 卡片装饰性光晕 */
.card-glow {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(45deg, #ff9a9e, #fad0c4);
  filter: blur(15px);
  opacity: 0;
  transition: opacity 0.3s;
  border-radius: 15px;
}

.music-card:hover .card-glow {
  opacity: 0.4;
}

/* 内部元素样式 */
.music-index {
  font-size: 24px;
  font-weight: italic;
  color: #ffccd5;
  margin-right: 15px;
}

.music-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.music-name {
  font-size: 16px;
  color: #444;
  font-weight: 600;
  /* 溢出显示省略号 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
}

.music-tag {
  font-size: 12px;
  color: #ffb6c1;
  margin-top: 4px;
}

.play-btn {
  background: #ffb6c1;
  color: white;
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: 0.3s;
}

.play-btn:hover {
  background: #ff85a2;
  transform: scale(1.1);
}
</style>