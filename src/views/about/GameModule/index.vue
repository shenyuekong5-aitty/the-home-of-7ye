<template>
  <div class="game-page">
    <header class="game-header">
      <div class="brand">
        <span class="icon">🎮</span>
        <h2 class="title">游乐空间</h2>
      </div>

      <div class="action-zone">
        <div class="search-box">
          <input type="text" placeholder="搜索已收录的游戏..." />
          <i class="search-icon">🔎</i>
        </div>
        <button class="btn-neon btn-add">
          <span class="plus">+</span>
          新增记录
        </button>
        <button class="btn-neon btn-rand">
          <span class="dice">🎲</span>
          随机推荐
        </button>
      </div>
    </header>

    <main class="game-content">
      <div class="game-grid">
        <div v-for="game in gameStore.gameList" :key="game.id" class="game-card">
          <div class="cover-box">
            <img :src="game.coverImg" :alt="game.name" class="game-img" />
            <div class="hover-actions">
              <button class="icon-btn edit"><i>✎</i></button>
              <button class="icon-btn delete"><i>🗑</i></button>
            </div>
            <div class="platform-tag">PC / Mobile</div>
          </div>

          <div class="game-detail">
            <h3 class="game-name">{{ game.name }}</h3>
            <div class="developer">{{ game.author }}</div>
            <p class="game-brief" :title="game.brief">{{ game.brief }}</p>
          </div>

          <div class="card-footer-line"></div>
        </div>
      </div>
    </main>

    <footer class="game-footer">
      <p>探索了 {{ gameStore.gameList.length }} 个奇幻世界</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useGameStore } from '@/store/modules/game'

  // 注意：这里将原先代码中的变量名从 animeStore 改为了 gameStore，更符合语义
  const gameStore = useGameStore()

  onMounted(() => {
    gameStore.getGames()
  })
</script>

<style scoped>
  /* 赛博动漫配色方案 */
  .game-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    padding: 40px 25px;
    color: #fff;
    font-family: 'Segoe UI', 'PingFang SC', sans-serif;
  }

  /* 顶部玻璃拟态头部 */
  .game-header {
    max-width: 1300px;
    margin: 0 auto 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px 35px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(15px);
    border-radius: 25px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .title {
    font-size: 26px;
    background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
    letter-spacing: 2px;
  }

  .action-zone {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  /* 霓虹搜索框 */
  .search-box {
    position: relative;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 50px;
    padding: 8px 20px;
    border: 1px solid #4facfe;
    display: flex;
    align-items: center;
  }

  .search-box input {
    background: none;
    border: none;
    color: white;
    outline: none;
    width: 200px;
  }

  /* 霓虹按钮 */
  .btn-neon {
    padding: 10px 20px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s;
    color: white;
  }

  .btn-add {
    background: #e94560;
    box-shadow: 0 0 15px rgba(233, 69, 96, 0.5);
  }
  .btn-rand {
    background: #0f3460;
    border: 1px solid #4facfe;
  }

  .btn-neon:hover {
    transform: scale(1.05);
    box-shadow: 0 0 25px rgba(79, 172, 254, 0.6);
  }

  /* 游戏卡片网格 */
  .game-grid {
    max-width: 1300px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 35px;
  }

  /* 卡片本体 */
  .game-card {
    background: #16213e;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
    position: relative;
  }

  .game-card:hover {
    transform: translateY(-12px);
    border-color: #4facfe;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }

  /* 封面效果 */
  .cover-box {
    position: relative;
    height: 180px;
    overflow: hidden;
  }

  .game-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s;
  }

  .game-card:hover .game-img {
    transform: scale(1.15) rotate(2deg);
  }

  .hover-actions {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .game-card:hover .hover-actions {
    opacity: 1;
  }

  .icon-btn {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    border: none;
    background: #fff;
    cursor: pointer;
    font-size: 20px;
  }

  .icon-btn.delete {
    color: #e94560;
  }

  .platform-tag {
    position: absolute;
    top: 12px;
    left: 12px;
    background: #4facfe;
    font-size: 10px;
    padding: 4px 8px;
    border-radius: 6px;
    font-weight: bold;
  }

  /* 文字细节 */
  .game-detail {
    padding: 20px;
  }

  .game-name {
    font-size: 18px;
    margin: 0 0 5px;
    color: #fff;
  }

  .developer {
    font-size: 13px;
    color: #4facfe;
    margin-bottom: 12px;
  }

  .game-brief {
    font-size: 13px;
    color: #a2a2c2;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-footer-line {
    height: 4px;
    background: linear-gradient(90deg, #4facfe, #00f2fe);
    width: 0;
    transition: width 0.4s;
  }

  .game-card:hover .card-footer-line {
    width: 100%;
  }

  .game-footer {
    text-align: center;
    margin-top: 60px;
    color: #535c68;
  }
</style>
