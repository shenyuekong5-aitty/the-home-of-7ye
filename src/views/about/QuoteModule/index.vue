<template>
  <div class="quote-page">
    <header class="quote-header">
      <div class="title-group">
        <h2 class="main-title">灵感碎片</h2>
        <p class="subtitle">Fragments of Soul & Poetry</p>
      </div>

      <div class="nav-actions">
        <el-input placeholder="检索记忆碎片..." class="search-bar" prefix-icon="Search" clearable />
        <el-button type="dark" class="add-btn" plain>+ 采撷语录</el-button>
      </div>
    </header>

    <main class="quote-container">
      <div class="quote-list">
        <div v-for="(item, index) in quoteStore.quoteList" :key="item.id" class="quote-card">
          <div class="quote-index">#{{ String(index + 1).padStart(2, '0') }}</div>

          <div class="quote-body">
            <p class="quote-text">{{ item.content }}</p>
          </div>

          <footer class="quote-footer">
            <div class="left-actions">
              <el-button link class="interaction-btn">
                <span class="icon">♥</span>
                <span>收藏</span>
              </el-button>
              <el-button link class="interaction-btn">
                <span class="icon">💬</span>
                <span>感悟</span>
              </el-button>
            </div>

            <div class="right-admin">
              <el-button-group>
                <el-button size="small" link icon="Edit">修正</el-button>
                <el-button size="small" link icon="Delete" class="delete-btn">抹除</el-button>
              </el-button-group>
            </div>
          </footer>

          <div class="film-deco top"></div>
          <div class="film-deco bottom"></div>
        </div>
      </div>
    </main>

    <div class="end-sign">● END ●</div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useQuoteStore } from '@/store/modules/quote'

  const quoteStore = useQuoteStore()

  onMounted(() => {
    quoteStore.getQuotes()
  })
</script>

<style scoped>
  /* 页面背景：深邃的夜色渐变，衬托文字的破碎感 */
  .quote-page {
    min-height: 100vh;
    background: #121212; /* 纯黑背景，极致对比 */
    background-image: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 0);
    background-size: 30px 30px;
    padding: 60px 20px;
    color: #e0e0e0;
    font-family: 'Times New Roman', 'PingFang SC', serif;
  }

  /* 头部样式：简约高级感 */
  .quote-header {
    max-width: 1000px;
    margin: 0 auto 60px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-left: 4px solid #fff;
    padding-left: 25px;
  }

  .main-title {
    font-size: 36px;
    font-weight: 300;
    letter-spacing: 4px;
    margin: 0;
    color: #fff;
  }

  .subtitle {
    color: #666;
    font-size: 14px;
    margin-top: 5px;
    text-transform: uppercase;
  }

  .nav-actions {
    display: flex;
    gap: 20px;
  }

  .search-bar {
    width: 240px;
  }

  /* 卡片布局：单列流式布局，适合沉浸式阅读 */
  .quote-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .quote-card {
    position: relative;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 50px 40px;
    margin-bottom: 40px;
    transition: all 0.4s ease;
    overflow: hidden;
  }

  .quote-card:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.01);
  }

  /* 编号背景 */
  .quote-index {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 40px;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.05);
    font-style: italic;
  }

  /* 语录文本排版 */
  .quote-body {
    margin-bottom: 30px;
    position: relative;
    z-index: 2;
  }

  .quote-text {
    font-size: 20px;
    line-height: 1.8;
    color: #eee;
    text-align: justify;
    letter-spacing: 1px;
  }

  /* 底部功能栏 */
  .quote-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 20px;
  }

  .interaction-btn {
    color: #888 !important;
    font-size: 14px;
    margin-right: 15px;
  }

  .interaction-btn:hover {
    color: #fff !important;
  }

  .interaction-btn .icon {
    margin-right: 4px;
  }

  .right-admin .el-button {
    color: #555 !important;
  }

  .right-admin .el-button:hover {
    color: #aaa !important;
  }

  .delete-btn:hover {
    color: #f56c6c !important;
  }

  /* 电影胶片装饰效果 */
  .film-deco {
    position: absolute;
    left: 0;
    width: 100%;
    height: 6px;
    display: flex;
    justify-content: space-around;
  }

  .film-deco::before {
    content: '■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■';
    color: rgba(255, 255, 255, 0.05);
    font-size: 8px;
    letter-spacing: 10px;
  }

  .film-deco.top {
    top: 10px;
  }
  .film-deco.bottom {
    bottom: 10px;
  }

  .end-sign {
    text-align: center;
    color: #333;
    letter-spacing: 10px;
    margin-top: 60px;
  }
</style>
