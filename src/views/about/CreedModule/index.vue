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

        <el-button v-if="isAdmin" type="primary" class="add-btn" plain @click="openAddDialog">
          <el-icon><Plus /></el-icon>
          刻下新语
        </el-button>
      </div>
    </header>

    <main class="creed-list">
      <div v-for="(item, index) in filteredCreeds" :key="item.id" class="creed-item">
        <div class="creed-decorator">0{{ index + 1 }}</div>

        <div class="creed-content">
          <span class="quote-mark">“</span>
          <p class="text">{{ item.content }}</p>
          <span class="quote-mark-end">”</span>
        </div>

        <div class="creed-footer">
          <!-- 收藏按钮 -->
          <el-button link class="favorite-btn" @click="handleToggleFavorite(item)">
            <span class="icon" :style="{ color: favStatus[item.id] ? '#e74c3c' : '' }">
              {{ favStatus[item.id] ? '♥' : '♡' }}
            </span>
            <span>{{ favStatus[item.id] ? '已收藏' : '收藏' }}</span>
          </el-button>

          <!-- 管理员操作 -->
          <div v-if="isAdmin" class="creed-actions">
            <el-button-group>
              <el-button size="small" plain @click="openEditDialog(item)">编辑</el-button>
              <el-button size="small" plain type="danger" @click="handleDelete(item.id)">抹去</el-button>
            </el-button-group>
          </div>
        </div>
      </div>
    </main>

    <div class="page-footer">
      <div class="divider"></div>
      <p>念念不忘，必有回响</p>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-input v-model="editContent" type="textarea" rows="5" placeholder="输入信条内容..." />
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
  import { Search, Plus } from '@element-plus/icons-vue'
  import { useCreedStore } from '@/store/modules/creed'
  import { useUserStore } from '@/store/modules/user'
  import { useFavoriteStore } from '@/store/modules/favorite'
  import type { CreedItem } from '@/api/creed/type'

  const creedStore = useCreedStore()
  const userStore = useUserStore()
  const favoriteStore = useFavoriteStore()

  const isAdmin = computed(() => userStore.userInfo?.role === 'admin')
  const currentUserId = computed(() => userStore.userInfo?.userid)

  // 收藏状态映射
  const favStatus = reactive<Record<number, boolean>>({})

  // 搜索
  const searchQuery = ref('')
  const filteredCreeds = computed(() => {
    if (!searchQuery.value) return creedStore.creedList
    return creedStore.creedList.filter(item => item.content.toLowerCase().includes(searchQuery.value.toLowerCase()))
  })

  // 增改弹窗
  const dialogVisible = ref(false)
  const dialogTitle = ref('')
  const editContent = ref('')
  const editingId = ref<number | null>(null)

  const openAddDialog = () => {
    dialogTitle.value = '刻下新语'
    editContent.value = ''
    editingId.value = null
    dialogVisible.value = true
  }

  const openEditDialog = (item: CreedItem) => {
    dialogTitle.value = '修正信条'
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
      await creedStore.updateCreed(editingId.value, editContent.value)
    } else {
      await creedStore.addCreed(editContent.value)
    }
    dialogVisible.value = false
  }

  const handleDelete = (id: number) => {
    ElMessageBox.confirm('确定抹去这条信条吗？', '警告', { type: 'warning' })
      .then(() => creedStore.deleteCreed(id))
      .catch(() => {})
  }

  // 收藏切换
  const handleToggleFavorite = async (item: CreedItem) => {
    if (!currentUserId.value) {
      ElMessage.warning('请先登录')
      return
    }
    try {
      const isFav = await favoriteStore.toggleFavorite('creed', item.id)
      favStatus[item.id] = isFav
      ElMessage.success(isFav ? '已收藏' : '已取消收藏')
    } catch {
      ElMessage.error('收藏失败')
    }
  }

  onMounted(async () => {
    await creedStore.getCreeds()
    // 批量同步收藏状态
    const ids = creedStore.creedList.map(item => item.id)
    if (ids.length > 0) {
      const statusMap = await favoriteStore.batchCheckFavorite('creed', ids)
      Object.entries(statusMap).forEach(([id, liked]) => {
        favStatus[Number(id)] = liked
      })
    }
  })
</script>

<style scoped>
  /* 极简和风背景 */
  .creed-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    padding: 60px 20px;
    background-color: #fafafa; /* 宣纸白 */
    background-image: radial-gradient(#e5e5e5 1px, transparent 1px);
    background-size: 20px 20px;
  }

  /* 头部样式 */
  .creed-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
    max-width: 800px;
    margin-bottom: 50px;
  }

  .main-title {
    margin: 0;
    font-size: 32px;
    font-weight: 800;
    color: #2c3e50;
    border-bottom: 4px solid #333;
  }

  .en-title {
    margin-left: 10px;
    font-size: 14px;
    color: #bdc3c7;
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
    padding: 40px;
    margin-bottom: 30px;
    overflow: hidden;
    background: #fff;
    border: 2px solid #333;
    border-radius: 4px;
    box-shadow: 10px 10px 0 #efefef; /* 动漫风的硬质投影 */
    transition: all 0.3s;
  }

  .creed-item:hover {
    box-shadow: 14px 14px 0 #333;
    transform: translate(-4px, -4px);
  }

  /* 装饰性数字 */
  .creed-decorator {
    position: absolute;
    top: -10px;
    right: 10px;
    z-index: 1;
    font-size: 80px;
    font-style: italic;
    font-weight: 900;
    color: #f0f0f0;
  }

  .creed-content {
    position: relative;
    z-index: 2;
    text-align: center;
  }

  .quote-mark {
    display: block;
    font-family: Georgia, serif;
    font-size: 40px;
    line-height: 0;
    color: #e74c3c;
    text-align: left;
  }

  .quote-mark-end {
    display: block;
    font-family: Georgia, serif;
    font-size: 40px;
    line-height: 0;
    color: #e74c3c;
    text-align: right;
  }

  .text {
    padding: 10px 0;
    font-size: 24px;
    font-weight: 500;
    color: #34495e;
    letter-spacing: 1px;
  }

  /* 操作区域 */
  .creed-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
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
    margin: 0 auto 15px;
    background: #333;
  }

  .page-footer p {
    font-size: 14px;
    color: #bdc3c7;
  }

  .creed-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 15px;
    margin-top: 20px;
    border-top: 1px solid #f0f0f0;
  }

  .favorite-btn {
    font-size: 14px;
    color: #888 !important;
  }

  .favorite-btn:hover {
    color: #e74c3c !important;
  }

  .creed-actions {
    opacity: 0.3;
    transition: opacity 0.3s;
  }

  .creed-item:hover .creed-actions {
    opacity: 1;
  }
</style>
