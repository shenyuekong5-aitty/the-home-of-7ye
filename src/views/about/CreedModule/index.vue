<template>
  <div class="creed-page">
    <header class="creed-header">
      <div class="title-section">
        <h2 class="main-title">我的信条</h2>
        <span class="en-title">/ MY CREED</span>
      </div>

      <div class="action-bar">
        <el-input v-model="searchQuery" placeholder="检索信念..." class="search-input" clearable>
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-button type="primary" class="add-btn" plain>
          <el-icon><Plus /></el-icon>
          刻下新语
        </el-button>
      </div>
    </header>

    <main class="creed-list">
      <div v-for="(item, index) in creedStore.creedList" :key="item.id" class="creed-item">
        <div class="creed-decorator">0{{ index + 1 }}</div>

        <div class="creed-content">
          <span class="quote-mark">“</span>
          <p class="text">{{ item.content }}</p>
          <span class="quote-mark-end">”</span>
        </div>

        <div class="creed-actions">
          <el-button-group>
            <el-button type="primary" size="small" plain icon="Edit">编辑</el-button>
            <el-button type="danger" size="small" plain icon="Delete">抹去</el-button>
          </el-button-group>
        </div>
      </div>
    </main>

    <div class="page-footer">
      <div class="divider"></div>
      <p>念念不忘，必有回响</p>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useCreedStore } from '@/store/modules/creed'

  const creedStore = useCreedStore()
  const searchQuery = ref('')

  onMounted(() => {
    creedStore.getCreeds()
  })
</script>

<style scoped>
  /* 极简和风背景 */
  .creed-page {
    min-height: 100vh;
    background-color: #fafafa; /* 宣纸白 */
    background-image: radial-gradient(#e5e5e5 1px, transparent 1px);
    background-size: 20px 20px;
    padding: 60px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* 头部样式 */
  .creed-header {
    width: 100%;
    max-width: 800px;
    margin-bottom: 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }

  .main-title {
    font-size: 32px;
    font-weight: 800;
    color: #2c3e50;
    margin: 0;
    border-bottom: 4px solid #333;
  }

  .en-title {
    font-size: 14px;
    color: #bdc3c7;
    margin-left: 10px;
    letter-spacing: 2px;
  }

  .action-bar {
    display: flex;
    gap: 12px;
  }

  .search-input {
    width: 180px;
  }

  /* 信条卡片样式 */
  .creed-list {
    width: 100%;
    max-width: 800px;
  }

  .creed-item {
    position: relative;
    background: #fff;
    margin-bottom: 30px;
    padding: 40px;
    border-radius: 4px;
    box-shadow: 10px 10px 0px #efefef; /* 动漫风的硬质投影 */
    border: 2px solid #333;
    transition: all 0.3s;
    overflow: hidden;
  }

  .creed-item:hover {
    transform: translate(-4px, -4px);
    box-shadow: 14px 14px 0px #333;
  }

  /* 装饰性数字 */
  .creed-decorator {
    position: absolute;
    top: -10px;
    right: 10px;
    font-size: 80px;
    font-weight: 900;
    color: #f0f0f0;
    z-index: 1;
    font-style: italic;
  }

  .creed-content {
    position: relative;
    z-index: 2;
    text-align: center;
  }

  .quote-mark {
    font-size: 40px;
    color: #e74c3c;
    font-family: 'Georgia', serif;
    display: block;
    text-align: left;
    line-height: 0;
  }

  .quote-mark-end {
    font-size: 40px;
    color: #e74c3c;
    font-family: 'Georgia', serif;
    display: block;
    text-align: right;
    line-height: 0;
  }

  .text {
    font-size: 24px;
    color: #34495e;
    font-weight: 500;
    padding: 10px 0;
    letter-spacing: 1px;
  }

  /* 操作区域 */
  .creed-actions {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    opacity: 0.3;
    transition: opacity 0.3s;
  }

  .creed-item:hover .creed-actions {
    opacity: 1;
  }

  /* 底部装饰 */
  .page-footer {
    margin-top: 60px;
    text-align: center;
  }

  .divider {
    width: 40px;
    height: 4px;
    background: #333;
    margin: 0 auto 15px;
  }

  .page-footer p {
    color: #bdc3c7;
    font-size: 14px;
  }
</style>
