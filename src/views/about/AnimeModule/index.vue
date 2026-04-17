<template>
  <div class="anime-page">
    <header class="action-bar">
      <div class="search-wrapper">
        <input v-model="searchQuery" type="text" placeholder="搜寻感兴趣的番剧..." class="search-input" />
        <button class="search-btn">🔍</button>
      </div>

      <div class="button-group">
        <button v-permission="['admin']" class="btn btn-add" @click="openDialog('add')">✨ 新增番剧</button>
        <button v-permission="['friend']" class="btn btn-recommend" @click="handleRandomRecommend">🎲 随机推荐</button>
      </div>
    </header>

    <main class="anime-container">
      <div class="anime-grid">
        <div v-for="item in filteredList" :key="item.id" class="anime-card">
          <div class="cover-wrapper">
            <img :src="item.coverImg" :alt="item.name" class="cover-img" />

            <div v-permission="['admin']" class="card-overlay">
              <button class="action-icon edit" @click="openDialog('edit', item)">✍️</button>
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

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增番剧回忆' : '修改番剧信息'"
      width="400px"
      custom-class="anime-dialog"
    >
      <el-form label-position="top">
        <el-form-item label="番剧名称">
          <el-input v-model="form.name" placeholder="请输入番剧名" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="form.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="封面链接">
          <el-input v-model="form.coverImg" placeholder="请输入图片 URL" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.brief" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" color="#7dd3fc">保存</el-button>
      </template>
    </el-dialog>

    <footer class="anime-footer">
      <span>已收录 {{ animeStore.animeList.length }} 部珍贵回忆</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed, reactive } from 'vue'
  import { useAnimeStore } from '@/store/modules/anime'
  import { ElMessage, ElMessageBox } from 'element-plus'

  const animeStore = useAnimeStore()

  // --- 搜索逻辑 ---
  const searchQuery = ref('')
  const filteredList = computed(() => {
    return animeStore.animeList.filter(
      item =>
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  // --- 弹窗与表单逻辑 ---
  const dialogVisible = ref(false)
  const dialogType = ref<'add' | 'edit'>('add')
  const currentId = ref<number | null>(null)
  const form = reactive({
    name: '',
    author: '',
    coverImg: 'https://via.placeholder.com/200x300?text=New+Anime',
    brief: ''
  })

  const openDialog = (type: 'add' | 'edit', item?: any) => {
    dialogType.value = type
    if (type === 'edit' && item) {
      currentId.value = item.id
      Object.assign(form, item)
    } else {
      currentId.value = null
      form.name = ''
      form.author = ''
      form.brief = ''
      form.coverImg = 'https://via.placeholder.com/200x300?text=New+Anime'
    }
    dialogVisible.value = true
  }

  // 保存逻辑 (Admin)
  const handleSave = () => {
    if (dialogType.value === 'add') {
      const newAnime = { ...form, id: Date.now() }
      animeStore.animeList.unshift(newAnime)
      ElMessage.success('成功添加至森林！')
    } else {
      const index = animeStore.animeList.findIndex(i => i.id === currentId.value)
      if (index !== -1) animeStore.animeList[index] = { ...form, id: currentId.value as number }
      ElMessage.success('回忆已更新')
    }
    dialogVisible.value = false
  }

  // 删除逻辑 (Admin)
  const handleDelete = (id: number) => {
    ElMessageBox.confirm('确定要抹除这段番剧回忆吗？', '警告', { type: 'warning' }).then(() => {
      const index = animeStore.animeList.findIndex(i => i.id === id)
      animeStore.animeList.splice(index, 1)
      ElMessage.success('已删除')
    })
  }

  // 推荐逻辑 (Friend)
  const handleRandomRecommend = () => {
    const list = animeStore.animeList
    if (list.length === 0) return
    const random = list[Math.floor(Math.random() * list.length)]
    ElMessageBox.alert(`✨ 今日森林为你选中的是：\n《${random.name}》`, '随机推荐')
  }

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
  /* 让弹窗更有动漫感 */
  :deep(.anime-dialog) {
    border-radius: 20px;
    overflow: hidden;
  }

  :deep(.el-dialog__header) {
    background: #f0f9ff;
    margin-right: 0;
  }

  /* 按钮点击时的简单反馈 */
  .btn:active {
    transform: scale(0.95);
  }

  /* 移动端搜索框适配 */
  @media (max-width: 768px) {
    .search-wrapper {
      max-width: 100%;
      order: 2;
    }
    .button-group {
      width: 100%;
      justify-content: center;
      order: 1;
    }
  }
</style>
