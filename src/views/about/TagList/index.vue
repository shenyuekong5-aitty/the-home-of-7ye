<template>
  <div class="tag-page">
    <header class="tag-header">
      <div class="header-left">
        <h2 class="title">心理画像</h2>
        <p class="subtitle">用标签拼凑真实的自我 🧩</p>
      </div>

      <div class="header-right">
        <el-input placeholder="搜索标签..." class="search-input" prefix-icon="Search" size="small" />
        <el-button type="primary" class="add-btn" circle icon="Plus"></el-button>
      </div>
    </header>

    <main class="tag-container">
      <div class="tag-grid">
        <div v-for="item in tagStore.tagList" :key="item.id" class="tag-sticker">
          <div class="sticker-content">
            <span class="tag-text">{{ item.content }}</span>

            <div class="sticker-admin">
              <el-icon class="admin-icon edit"><Edit /></el-icon>
              <el-icon class="admin-icon delete"><Delete /></el-icon>
            </div>
          </div>

          <div class="sticker-footer">
            <button class="hug-btn" title="给个抱抱">
              <span class="hug-icon">🤗</span>
              <span class="hug-count">99+</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <footer class="tag-footer">
      <p>“标签只是参考，你才是唯一的答案。”</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useTagStore } from '@/store/modules/tag'

  const tagStore = useTagStore()

  onMounted(() => {
    tagStore.getTags()
  })
</script>

<style scoped>
  /* 柔和的莫兰迪/奶油色背景 */
  .tag-page {
    min-height: 100vh;
    background-color: #f7f3f0;
    background-image:
      linear-gradient(90deg, rgba(255, 255, 255, 0.5) 50%, transparent 50%),
      linear-gradient(rgba(255, 255, 255, 0.5) 50%, transparent 50%);
    background-size: 30px 30px; /* 类似网格本的底纹 */
    padding: 40px 20px;
    font-family: 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  }

  /* 头部样式 */
  .tag-header {
    max-width: 900px;
    margin: 0 auto 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
  }

  .title {
    font-size: 24px;
    color: #8c7851;
    margin: 0;
    font-weight: bold;
  }

  .subtitle {
    font-size: 13px;
    color: #a89a7d;
    margin-top: 5px;
  }

  .header-right {
    display: flex;
    gap: 15px;
  }

  .search-input {
    width: 180px;
  }

  /* 标签贴纸网格 */
  .tag-container {
    max-width: 900px;
    margin: 0 auto;
  }

  .tag-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 25px;
  }

  /* 贴纸单体设计 */
  .tag-sticker {
    background: #fff;
    padding: 15px;
    border-radius: 4px;
    box-shadow: 2px 4px 10px rgba(0, 0, 0, 0.05);
    position: relative;
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    border: 1px solid #eee;
    /* 模拟贴纸微微翘起的效果 */
  }

  .tag-sticker:hover {
    transform: rotate(-2deg) translateY(-5px);
    box-shadow: 5px 8px 15px rgba(140, 120, 81, 0.15);
    border-color: #d4a373;
  }

  .sticker-content {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .tag-text {
    font-size: 16px;
    color: #5b4d3d;
    font-weight: 600;
    text-align: center;
  }

  /* 贴纸内部的管理按钮 */
  .sticker-admin {
    position: absolute;
    top: -5px;
    right: -5px;
    display: flex;
    gap: 5px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .tag-sticker:hover .sticker-admin {
    opacity: 1;
  }

  .admin-icon {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 4px;
    font-size: 12px;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }

  .admin-icon.edit:hover {
    color: #409eff;
  }
  .admin-icon.delete:hover {
    color: #f56c6c;
  }

  /* 抱抱按钮样式 */
  .sticker-footer {
    border-top: 1px dashed #eee;
    padding-top: 10px;
    display: flex;
    justify-content: center;
  }

  .hug-btn {
    background: #fefae0;
    border: 1px solid #faedcd;
    border-radius: 20px;
    padding: 4px 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;
  }

  .hug-btn:hover {
    background: #faedcd;
    transform: scale(1.1);
  }

  .hug-icon {
    font-size: 16px;
  }

  .hug-count {
    font-size: 12px;
    color: #d4a373;
    font-weight: bold;
  }

  /* 底部 */
  .tag-footer {
    text-align: center;
    margin-top: 60px;
    color: #c2b9a7;
    font-style: italic;
    font-size: 14px;
  }
</style>
