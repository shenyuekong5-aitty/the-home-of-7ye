<template>
  <div class="anime-page">
    <header class="action-bar">
      <div class="search-wrapper">
        <input v-model="searchQuery" type="text" placeholder="搜寻感兴趣的番剧..." class="search-input" />
        <button class="search-btn">🔍</button>
      </div>

      <div class="button-group">
        <!-- 管理员：新增番剧 -->
        <button v-if="isAdmin" class="btn btn-add" @click="openAdminDialog('add')">✨ 新增番剧</button>
        <!-- 朋友：推荐番剧（打开推荐弹窗） -->
        <button v-if="isFriend" class="btn btn-recommend" @click="openRecommendDialog">🎬 推荐番剧</button>
        <!-- 朋友：随机推荐（基于已有列表） -->
        <button v-if="isFriend" class="btn btn-recommend" @click="handleRandomRecommend">🎲 随机推荐</button>
      </div>
    </header>

    <main class="anime-container">
      <div class="anime-grid">
        <div v-for="item in filteredList" :key="item.id" class="anime-card">
          <div class="cover-wrapper">
            <img :src="item.coverImg" :alt="item.name" class="cover-img" />

            <!-- 管理员：编辑/删除 -->
            <div v-if="isAdmin" class="card-overlay">
              <button class="action-icon edit" @click="openAdminDialog('edit', item)">✍️</button>
              <button class="action-icon delete" @click="handleDelete(item.id)">🗑️</button>
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

    <!-- 统一的表单弹窗（管理员新增/编辑 & 朋友推荐） -->
    <ItemFormDialog
      v-if="dialogVisible"
      v-model:visible="dialogVisible"
      :title="dialogTitle"
      :fields="[
        { key: 'name', label: '番剧名称', type: 'input', required: true, placeholder: '请输入番剧名' },
        { key: 'author', label: '作者', type: 'input', required: true, placeholder: '请输入作者' },
        { key: 'brief', label: '简介', type: 'textarea', placeholder: '请输入简介' }
      ]"
      :showCover="true"
      :initialData="dialogInitialData"
      @confirm="handleDialogConfirm"
    />

    <!-- 分页器 -->
    <div v-if="animeStore.totalPages > 1" style="display: flex; justify-content: center; margin-top: 30px">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="animeStore.totalElements"
        :page-size="animeStore.pageSize"
        v-model:current-page="currentPage"
        @current-change="handlePageChange"
      />
    </div>

    <footer class="anime-footer">
      <span>已收录 {{ animeStore.animeList.length }} 部珍贵回忆</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { useAnimeStore } from '@/store/modules/anime'
  import { useUserStore } from '@/store/modules/user'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { AnimeItem } from '@/api/anime/type'
  import ItemFormDialog from '@/components/ItemFormDialog.vue'

  const animeStore = useAnimeStore()
  const userStore = useUserStore()

  const isAdmin = computed(() => userStore.userInfo.role === 'admin')
  const isFriend = computed(() => userStore.userInfo.role === 'friend')

  const currentPage = ref(1)

  const searchQuery = ref('')
  const filteredList = computed(() => {
    if (!searchQuery.value) return animeStore.animeList
    return animeStore.animeList.filter(
      item =>
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  // ========== 统一弹窗逻辑 ==========
  const dialogVisible = ref(false)
  const dialogMode = ref<'admin-add' | 'admin-edit' | 'recommend'>('admin-add')
  const editingItem = ref<AnimeItem | null>(null)

  const dialogTitle = computed(() => {
    if (dialogMode.value === 'admin-add') return '新增番剧回忆'
    if (dialogMode.value === 'admin-edit') return '修改番剧信息'
    return '推荐新番剧'
  })

  const dialogInitialData = computed(() => {
    if (dialogMode.value === 'admin-edit' && editingItem.value) {
      return { ...editingItem.value }
    }
    return null
  })

  function openAdminDialog(mode: 'add' | 'edit', item?: AnimeItem) {
    if (mode === 'edit' && item) {
      dialogMode.value = 'admin-edit'
      editingItem.value = { ...item }
    } else {
      dialogMode.value = 'admin-add'
      editingItem.value = null
    }
    dialogVisible.value = true
  }

  function openRecommendDialog() {
    dialogMode.value = 'recommend'
    editingItem.value = null
    dialogVisible.value = true
  }

  async function handleDialogConfirm(formData: Record<string, any>) {
    // 非空校验
    const name = (formData.name || '').trim()
    const author = (formData.author || '').trim()
    if (!name) {
      ElMessage.warning('番剧名称不能为空')
      return
    }
    if (!author) {
      ElMessage.warning('作者不能为空')
      return
    }

    try {
      const animeData = { ...formData, name, author } as {
        name: string
        author: string
        brief: string
        coverImg: string
      }

      if (dialogMode.value === 'admin-add') {
        await animeStore.addAnime(animeData)
        ElMessage.success('新增成功')
      } else if (dialogMode.value === 'admin-edit') {
        if (!editingItem.value) return
        await animeStore.updateAnime({ id: editingItem.value.id, ...animeData })
        ElMessage.success('修改成功')
      } else if (dialogMode.value === 'recommend') {
        await animeStore.recommendAnime(animeData)
        ElMessage.success('推荐成功！等待管理员审核 ✨')
      }
      dialogVisible.value = false
    } catch (err: any) {
      ElMessage.error(err.message || '操作失败')
    }
  }

  // ========== 删除 ==========
  const handleDelete = (id: number) => {
    ElMessageBox.confirm('确定要抹除这段番剧回忆吗？', '警告', { type: 'warning' })
      .then(async () => {
        await animeStore.deleteAnime(id)
        ElMessage.success('已删除')
      })
      .catch(() => {})
  }

  // ========== 随机推荐 ==========
  const handleRandomRecommend = () => {
    const list = animeStore.animeList
    if (list.length === 0) {
      ElMessage.warning('暂无番剧可推荐')
      return
    }
    const random = list[Math.floor(Math.random() * list.length)]
    if (!random) return
    ElMessageBox.alert(`✨ 今日森林为你选中的是：\n《${random.name}》`, '随机推荐')
  }

  //分页处理函数
  const handlePageChange = (page: number) => {
    animeStore.getAnimes(page - 1, animeStore.pageSize) // 转换为 0-based
  }

  onMounted(async () => {
    try {
      await animeStore.getAnimes(0, 12) // 明确传入第一页
      currentPage.value = 1
    } catch {
      ElMessage.error('加载番剧列表失败')
    }
  })
</script>

<style scoped>
  .anime-page {
    min-height: 100vh;
    padding: 40px 20px;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
    background: linear-gradient(120deg, #e0f2fe 0%, #f5f3ff 100%);
  }

  .action-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    padding: 20px 30px;
    margin: 0 auto 40px;
    background: rgb(255 255 255 / 60%);
    border: 1px solid rgb(255 255 255 / 80%);
    border-radius: 20px;
    box-shadow: 0 10px 25px rgb(186 230 253 / 50%);
    backdrop-filter: blur(12px);
  }

  .search-wrapper {
    display: flex;
    flex: 1;
    max-width: 400px;
    padding: 5px 15px;
    background: white;
    border: 2px solid #bae6fd;
    border-radius: 30px;
  }

  .search-input {
    flex: 1;
    padding: 8px;
    font-size: 14px;
    outline: none;
    border: none;
  }

  .search-btn {
    cursor: pointer;
    background: none;
    border: none;
  }

  .button-group {
    display: flex;
    gap: 15px;
  }

  .btn {
    padding: 10px 20px;
    font-weight: bold;
    cursor: pointer;
    border: none;
    border-radius: 12px;
    transition: all 0.3s ease;
  }

  .btn-add {
    color: white;
    background: #7dd3fc;
    box-shadow: 0 4px 12px rgb(125 211 252 / 40%);
  }

  .btn-recommend {
    color: white;
    background: #a78bfa;
    box-shadow: 0 4px 12px rgb(167 139 250 / 40%);
  }

  .btn:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
  }

  .anime-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .anime-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 30px;
  }

  .anime-card {
    position: relative;
    overflow: hidden;
    background: white;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .anime-card:hover {
    box-shadow: 0 20px 30px rgb(148 163 184 / 20%);
    transform: translateY(-10px);
  }

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

  .card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: rgb(0 0 0 / 30%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .anime-card:hover .card-overlay {
    opacity: 1;
  }

  .action-icon {
    width: 45px;
    height: 45px;
    font-size: 20px;
    cursor: pointer;
    background: white;
    border: none;
    border-radius: 50%;
    transition: transform 0.2s;
  }

  .action-icon:hover {
    transform: scale(1.2);
  }

  .anime-info {
    padding: 15px;
  }

  .anime-name {
    margin: 0 0 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 16px;
    color: #1e293b;
    white-space: nowrap;
  }

  .anime-author {
    margin-bottom: 8px;
    font-size: 12px;
    color: #94a3b8;
  }

  .anime-brief {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    font-size: 13px;
    line-height: 1.5;
    color: #64748b;
    -webkit-box-orient: vertical;
  }

  .anime-tag {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1;
    padding: 4px 10px;
    font-size: 10px;
    font-weight: bold;
    color: #7dd3fc;
    background: rgb(255 255 255 / 90%);
    border-radius: 20px;
  }

  .anime-footer {
    margin-top: 60px;
    font-size: 14px;
    color: #94a3b8;
    text-align: center;
  }

  :deep(.anime-dialog) {
    overflow: hidden;
    border-radius: 20px;
  }

  :deep(.el-dialog__header) {
    margin-right: 0;
    background: #f0f9ff;
  }

  .btn:active {
    transform: scale(0.95);
  }

  @media (width <= 768px) {
    .search-wrapper {
      order: 2;
      max-width: 100%;
    }

    .button-group {
      justify-content: center;
      order: 1;
      width: 100%;
    }
  }

  /* 新增封面上传样式 */
  .cover-upload-area {
    .cover-preview {
      position: relative;
      display: inline-block;

      img {
        max-width: 200px;
        max-height: 200px;
        border: 1px solid #ddd;
        border-radius: 8px;
      }

      .remove-cover {
        position: absolute;
        top: -8px;
        right: -8px;
        padding: 2px;
        font-size: 18px;
        color: #fff;
        cursor: pointer;
        background: #ff4d4f;
        border-radius: 50%;
      }
    }

    .upload-tip {
      margin-top: 5px;
      font-size: 12px;
      color: #999;
    }
  }
</style>
