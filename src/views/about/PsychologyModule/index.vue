<template>
  <div class="emotion-page">
    <header class="emotion-header">
      <div class="header-left">
        <h2 class="title">情绪树洞</h2>
        <p class="subtitle">有些话，说出来会好受一点...</p>
      </div>

      <div class="header-right">
        <el-input placeholder="搜索心情关键词..." class="search-input" :prefix-icon="'Search'" />
        <el-button type="primary" round class="publish-btn">
          发表情绪
          <el-icon class="el-icon--right"><Edit /></el-icon>
        </el-button>
      </div>
    </header>

    <main class="emotion-container">
      <div class="emotion-list">
        <div v-for="item in emotionStore.emotionList" :key="item.id" class="emotion-card">
          <div class="card-top">
            <div class="author-info">
              <div class="avatar-placeholder">{{ item.author.charAt(0) }}</div>
              <span class="author-name">{{ item.author }}</span>
            </div>
            <span class="time">{{ item.time }}</span>
          </div>

          <div class="card-content">
            <p>{{ item.content }}</p>
          </div>

          <div class="card-bottom">
            <div class="interaction">
              <el-button link class="like-btn">
                <span class="icon">❤</span>
                {{ item.like }}
              </el-button>
              <el-button link class="comment-btn">
                <span class="icon">💬</span>
                {{ item.remarks.length }}
              </el-button>
            </div>

            <div class="admin-btns">
              <el-button type="primary" link size="small">编辑</el-button>
              <el-button type="danger" link size="small">删除</el-button>
            </div>
          </div>

          <div v-if="item.remarks.length > 0" class="remarks-box">
            <div v-for="(msg, i) in item.remarks" :key="i" class="remark-item">
              <span class="remark-user">匿名路人:</span>
              {{ msg }}
            </div>
          </div>
        </div>
      </div>
    </main>

    <div class="footer-decoration">☁️ 愿每一个灵魂都能被温柔以待</div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useEmotionStore } from '@/store/modules/emotion'
  // 注意：如果你的 Element Plus 图标是按需引入，这里需要手动导入 Edit 和 Search
  // 这里假设你已经全局注册了图标，直接使用即可

  const emotionStore = useEmotionStore()

  onMounted(() => {
    emotionStore.getEmotions()
  })
</script>

<style scoped>
  /* 治愈系配色 */
  .emotion-page {
    min-height: 100vh;
    background: linear-gradient(180deg, #f0f2f5 0%, #e6e9f0 100%);
    padding: 40px 20px;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', sans-serif;
  }

  /* 头部样式 */
  .emotion-header {
    max-width: 900px;
    margin: 0 auto 30px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 2px solid #dcdfe6;
    padding-bottom: 20px;
  }

  .title {
    font-size: 28px;
    color: #606266;
    margin: 0;
    letter-spacing: 1px;
  }

  .subtitle {
    color: #909399;
    font-size: 14px;
    margin-top: 8px;
  }

  .header-right {
    display: flex;
    gap: 15px;
  }

  .search-input {
    width: 200px;
  }

  .publish-btn {
    background-color: #a3b18a; /* 莫兰迪绿，给人平静感 */
    border: none;
  }

  .publish-btn:hover {
    background-color: #588157;
  }

  /* 情绪卡片列表 */
  .emotion-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .emotion-card {
    background: white;
    border-radius: 16px;
    padding: 25px;
    margin-bottom: 25px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    border-left: 5px solid #bdc3c7; /* 默认灰色边框 */
  }

  .emotion-card:hover {
    transform: translateX(5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }

  /* 重点：每张卡片根据内容可以有不同氛围 */
  .emotion-card:nth-child(even) {
    border-left-color: #95a5a6;
  }

  .card-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .author-info {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .avatar-placeholder {
    width: 35px;
    height: 35px;
    background: #ecf0f1;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #7f8c8d;
    font-weight: bold;
  }

  .author-name {
    font-weight: 600;
    color: #2c3e50;
  }

  .time {
    font-size: 12px;
    color: #bdc3c7;
  }

  .card-content {
    font-size: 16px;
    color: #5d6d7e;
    line-height: 1.8;
    margin-bottom: 20px;
    font-style: italic; /* 情绪表达通常比较感性 */
  }

  .card-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #f2f6fc;
    padding-top: 15px;
  }

  .icon {
    margin-right: 5px;
  }

  .like-btn:hover {
    color: #e74c3c !important;
  }
  .comment-btn:hover {
    color: #3498db !important;
  }

  /* 留言区样式 */
  .remarks-box {
    margin-top: 15px;
    background: #f8f9fa;
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 13px;
  }

  .remark-item {
    margin-bottom: 5px;
    color: #7f8c8d;
  }

  .remark-user {
    color: #95a5a6;
    font-weight: bold;
  }

  .footer-decoration {
    text-align: center;
    margin-top: 50px;
    color: #bdc3c7;
    font-size: 14px;
  }
</style>
2
