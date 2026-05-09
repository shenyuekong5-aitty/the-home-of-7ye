<template>
  <div class="quote-page">
    <header class="quote-header">
      <div class="title-group">
        <h2 class="main-title">灵感碎片</h2>
        <p class="subtitle">Fragments of Soul & Poetry</p>
      </div>

      <div class="nav-actions">
        <el-input v-model="searchQuery" placeholder="检索记忆碎片..." class="search-bar" clearable />
        <!-- 管理员新增按钮 -->
        <el-button v-if="isAdmin" class="add-btn" @click="openAddDialog">+ 采撷语录</el-button>
      </div>
    </header>

    <main class="quote-container">
      <div class="quote-list">
        <div v-for="(item, index) in filteredQuotes" :key="item.id" class="quote-card">
          <div class="quote-index">#{{ String(index + 1).padStart(2, '0') }}</div>

          <div class="quote-body">
            <p class="quote-text">{{ item.content }}</p>
          </div>

          <footer class="quote-footer">
            <div class="left-actions">
              <el-button link class="interaction-btn" @click="handleToggleFavorite(item)">
                <span class="icon" :style="{ color: favStatus[item.id] ? '#ff6b6b' : '' }">
                  {{ favStatus[item.id] ? '♥' : '♡' }}
                </span>
                <span>{{ favStatus[item.id] ? '已收藏' : '收藏' }}</span>
              </el-button>
            </div>

            <!-- 管理员操作按钮 -->
            <div v-if="isAdmin" class="right-admin">
              <el-button size="small" link @click="openEditDialog(item)">修正</el-button>
              <el-button size="small" link class="delete-btn" @click="handleDelete(item.id)">抹除</el-button>
            </div>
          </footer>

          <div class="film-deco top"></div>
          <div class="film-deco bottom"></div>
        </div>
      </div>
    </main>

    <div class="end-sign">● END ●</div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-input v-model="editContent" type="textarea" rows="5" placeholder="输入语录内容..." />
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, reactive } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useQuoteStore } from '@/store/modules/quote'
  import { useUserStore } from '@/store/modules/user'
  import { reqToggleFavorite } from '@/api/favorite'
  import type { QuoteItem } from '@/api/quote/type'

  const quoteStore = useQuoteStore()
  const userStore = useUserStore()

  const isAdmin = computed(() => userStore.userInfo?.role === 'admin')
  const currentUserId = computed(() => userStore.userInfo?.userid)

  // 收藏状态映射：{ [quoteId: number]: boolean }
  const favStatus = reactive<Record<number, boolean>>({})

  // 搜索
  const searchQuery = ref('')
  const filteredQuotes = computed(() => {
    if (!searchQuery.value) return quoteStore.quoteList
    return quoteStore.quoteList.filter(item => item.content.toLowerCase().includes(searchQuery.value.toLowerCase()))
  })

  // 增改弹窗
  const dialogVisible = ref(false)
  const dialogTitle = ref('')
  const editContent = ref('')
  const editingId = ref<number | null>(null)

  const openAddDialog = () => {
    dialogTitle.value = '采撷新语录'
    editContent.value = ''
    editingId.value = null
    dialogVisible.value = true
  }

  const openEditDialog = (item: QuoteItem) => {
    dialogTitle.value = '修正语录'
    editContent.value = item.content
    editingId.value = item.id
    dialogVisible.value = true
  }

  const handleSave = async () => {
    if (!editContent.value.trim()) {
      ElMessage.warning('内容不能为空')
      return
    }
    if (editingId.value) {
      await quoteStore.updateQuote(editingId.value, editContent.value)
    } else {
      await quoteStore.addQuote(editContent.value)
    }
    dialogVisible.value = false
  }

  const handleDelete = (id: number) => {
    ElMessageBox.confirm('确定抹除这条语录吗？', '警告', { type: 'warning' })
      .then(() => quoteStore.deleteQuote(id))
      .catch(() => {})
  }

  // 收藏切换
  const handleToggleFavorite = async (item: QuoteItem) => {
    if (!currentUserId.value) {
      ElMessage.warning('请先登录')
      return
    }
    try {
      const res = await reqToggleFavorite({ targetType: 'quote', targetId: item.id })
      if (res.code === 200) {
        const isFav = res.data.isFavorited
        // 更新本地状态
        favStatus[item.id] = isFav
        ElMessage.success(isFav ? '已收藏' : '已取消收藏')
      } else {
        ElMessage.error(res.message || '操作失败')
      }
    } catch {
      ElMessage.error('收藏失败')
    }
  }

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
