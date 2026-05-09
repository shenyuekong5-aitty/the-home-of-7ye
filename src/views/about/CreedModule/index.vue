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
  import { reqToggleFavorite } from '@/api/favorite'
  import type { CreedItem } from '@/api/creed/type'

  const creedStore = useCreedStore()
  const userStore = useUserStore()

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
      const res = await reqToggleFavorite({ targetType: 'creed', targetId: item.id })
      if (res.code === 200) {
        const isFav = res.data.isFavorited
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
  .creed-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
    border-top: 1px solid #f0f0f0;
    padding-top: 15px;
  }
  .favorite-btn {
    color: #888 !important;
    font-size: 14px;
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
