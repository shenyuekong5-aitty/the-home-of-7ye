<template>
  <div class="anime-page">
    <header class="action-bar">
      <div class="search-wrapper">
        <input type="text" placeholder="搜寻感兴趣的番剧..." class="search-input" />
        <button class="search-btn">🔍</button>
      </div>

      <div class="button-group">
        <button class="btn btn-add">✨ 新增番剧</button>
        <button class="btn btn-recommend">🎲 随机推荐</button>
      </div>
    </header>

    <main class="anime-container">
      <div class="anime-grid">
        <div v-for="item in animeStore.animeList" :key="item.id" class="anime-card">
          <div class="cover-wrapper">
            <img :src="item.coverImg" :alt="item.name" class="cover-img" />
            <div class="card-overlay">
              <button class="action-icon edit">✍️</button>
              <button class="action-icon delete">🗑️</button>
            </div>
          </div>

          <div class="anime-info">
            <h3 class="anime-name">{{ item.name }}</h3>
            <p class="anime-author">作者：{{ item.author }}</p>
            <p class="anime-brief" :title="item.brief">{{ item.brief }}</p>
          </div>

          <div class="anime-tag">Completed</div>
        </div>
      </div>
    </main>

    <footer class="anime-footer">
      <span>已收录 {{ animeStore.animeList.length }} 部珍贵回忆</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useAnimeStore } from '@/store/modules/anime'

  const animeStore = useAnimeStore()

  onMounted(() => {
    animeStore.getAnimes()
  })
</script>

<style scoped>
  /* 页面整体背景：梦幻天蓝色渐变 */
  .anime-page {
    min-height: 100vh;
    background: linear-gradient(120deg, #e0f2fe 0%, #f5f3ff 100%);
    padding: 40px 20px;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  }

  /* 顶部搜索与按钮区 */
  .action-bar {
    max-width: 1200px;
    margin: 0 auto 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(12px);
    padding: 20px 30px;
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 10px 25px rgba(186, 230, 253, 0.5);
  }

  .search-wrapper {
    display: flex;
    background: white;
    border-radius: 30px;
    padding: 5px 15px;
    border: 2px solid #bae6fd;
    flex: 1;
    max-width: 400px;
  }

  .search-input {
    border: none;
    outline: none;
    padding: 8px;
    flex: 1;
    font-size: 14px;
  }

  .search-btn {
    background: none;
    border: none;
    cursor: pointer;
  }

  .button-group {
    display: flex;
    gap: 15px;
  }

  .btn {
    padding: 10px 20px;
    border-radius: 12px;
    border: none;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-add {
    background: #7dd3fc;
    color: white;
    box-shadow: 0 4px 12px rgba(125, 211, 252, 0.4);
  }

  .btn-recommend {
    background: #a78bfa;
    color: white;
    box-shadow: 0 4px 12px rgba(167, 139, 250, 0.4);
  }

  .btn:hover {
    transform: translateY(-2px);
    filter: brightness(1.1);
  }

  /* 番剧列表布局 */
  .anime-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .anime-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 30px;
  }

  /* 番剧卡片设计 */
  .anime-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 1px solid #f1f5f9;
    position: relative;
  }

  .anime-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 30px rgba(148, 163, 184, 0.2);
  }

  /* 封面图处理 */
  .cover-wrapper {
    position: relative;
    height: 300px;
    overflow: hidden;
  }

  .cover-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .anime-card:hover .cover-img {
    transform: scale(1.1);
  }

  /* 悬浮操作层 */
  .card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .anime-card:hover .card-overlay {
    opacity: 1;
  }

  .action-icon {
    background: white;
    border: none;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    transition: transform 0.2s;
  }

  .action-icon:hover {
    transform: scale(1.2);
  }

  /* 番剧文字信息 */
  .anime-info {
    padding: 15px;
  }

  .anime-name {
    font-size: 16px;
    color: #1e293b;
    margin: 0 0 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .anime-author {
    font-size: 12px;
    color: #94a3b8;
    margin-bottom: 8px;
  }

  .anime-brief {
    font-size: 13px;
    color: #64748b;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* 装饰标签 */
  .anime-tag {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.9);
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 10px;
    color: #7dd3fc;
    font-weight: bold;
    z-index: 1;
  }

  .anime-footer {
    text-align: center;
    margin-top: 60px;
    color: #94a3b8;
    font-size: 14px;
  }
</style>
