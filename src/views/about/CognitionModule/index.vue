<template>
  <div class="cognition-page">
    <header class="cognition-header">
      <div class="header-content">
        <div class="brand">
          <h2 class="title">认知重构</h2>
          <div class="divider"></div>
          <p class="slogan">Deep Thinking & Self-Cognition</p>
        </div>

        <div class="header-ops">
          <el-input placeholder="搜索命题关键词..." class="search-box" prefix-icon="Search" clearable />
          <el-button type="primary" class="btn-create" icon="EditPen">记录新命题</el-button>
        </div>
      </div>
    </header>

    <main class="cognition-list">
      <article v-for="item in cognitionStore.cognitionList" :key="item.id" class="cognition-card">
        <div class="card-aside">
          <div class="time-stamp">
            <span class="date">{{ item.cognize_time.split(' ')[0] }}</span>
          </div>
        </div>

        <div class="card-main">
          <div class="card-header">
            <h3 class="topic-title"># {{ item.title }}</h3>
            <div class="admin-actions">
              <el-button link size="small" icon="Edit">编辑</el-button>
              <el-button link size="small" icon="Delete" type="danger">删除</el-button>
            </div>
          </div>

          <div class="card-content">
            <p class="content-text">{{ item.content }}</p>
          </div>

          <footer class="card-footer">
            <div class="interaction">
              <el-button link class="action-item">
                <el-icon><Star /></el-icon>
                <span>共鸣 ({{ item.favorite }})</span>
              </el-button>
              <el-button link class="action-item">
                <el-icon><ChatDotRound /></el-icon>
                <span>批注 ({{ item.remarks.length }})</span>
              </el-button>
            </div>

            <div class="meta-info">
              <el-tag size="small" effect="plain" type="info">认知碎片</el-tag>
            </div>
          </footer>

          <div v-if="item.remarks.length > 0 && item.remarks[0] !== ''" class="remarks-area">
            <div v-for="(msg, i) in item.remarks" :key="i" class="remark-line">
              <span class="remark-label">【批注】</span>
              {{ msg }}
            </div>
          </div>
        </div>
      </article>
    </main>

    <div class="page-end">
      <el-divider content-position="center">Thought never ends</el-divider>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useCognitionStore } from '@/store/modules/cognition'

  const cognitionStore = useCognitionStore()

  onMounted(() => {
    cognitionStore.getCognitions()
  })
</script>

<style scoped>
  /* 认知模块专用的“手稿感”配色：纸张白 + 墨水黑 + 极简蓝 */
  .cognition-page {
    min-height: 100vh;
    background-color: #fcfcfc;
    background-image: linear-gradient(#f1f1f1 1px, transparent 1px);
    background-size: 100% 40px; /* 模拟信纸行线 */
    padding: 60px 20px;
    font-family: 'Optima', 'Candara', 'Noto Sans SC', sans-serif;
  }

  /* 头部设计 */
  .cognition-header {
    max-width: 900px;
    margin: 0 auto 60px;
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-bottom: 20px;
    border-bottom: 2px solid #333;
  }

  .title {
    font-size: 32px;
    margin: 0;
    color: #1a1a1a;
    letter-spacing: 2px;
  }

  .divider {
    width: 40px;
    height: 4px;
    background: #3498db;
    margin: 10px 0;
  }

  .slogan {
    font-size: 12px;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 3px;
  }

  .header-ops {
    display: flex;
    gap: 15px;
  }

  .search-box {
    width: 200px;
  }

  .btn-create {
    background-color: #1a1a1a;
    border: none;
  }

  /* 命题卡片流布局 */
  .cognition-list {
    max-width: 900px;
    margin: 0 auto;
  }

  .cognition-card {
    display: flex;
    background: #fff;
    border-radius: 8px;
    margin-bottom: 50px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
    transition: transform 0.3s;
    border: 1px solid #eee;
  }

  .cognition-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
  }

  /* 左侧时间轴装饰 */
  .card-aside {
    width: 60px;
    background: #1a1a1a;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px 0 0 8px;
  }

  .time-stamp {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    font-size: 11px;
    letter-spacing: 2px;
    opacity: 0.8;
  }

  /* 右侧内容主体 */
  .card-main {
    flex: 1;
    padding: 30px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .topic-title {
    font-size: 20px;
    color: #2c3e50;
    margin: 0;
    font-weight: 700;
  }

  .admin-actions {
    opacity: 0;
    transition: opacity 0.3s;
  }

  .cognition-card:hover .admin-actions {
    opacity: 1;
  }

  /* 长文本排版 */
  .content-text {
    font-size: 15px;
    line-height: 1.8;
    color: #444;
    text-align: justify;
    margin-bottom: 25px;
    white-space: pre-wrap; /* 保留换行 */
  }

  /* 底部功能栏 */
  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 20px;
    border-top: 1px dashed #eee;
  }

  .action-item {
    margin-right: 20px;
    color: #7f8c8d !important;
  }

  .action-item:hover {
    color: #3498db !important;
  }

  .action-item .el-icon {
    margin-right: 5px;
    font-size: 16px;
  }

  /* 留言/批注区 */
  .remarks-area {
    margin-top: 20px;
    background: #f9f9f9;
    padding: 15px;
    border-radius: 4px;
    font-size: 13px;
    color: #7f8c8d;
  }

  .remark-label {
    color: #3498db;
    font-weight: bold;
  }

  .page-end {
    margin: 80px 0;
    opacity: 0.5;
  }
</style>
