<template>
  <div class="anime-page">
    <header class="action-bar">
      <div class="search-wrapper">
        <input v-model="searchQuery" type="text" placeholder="搜寻感兴趣的番剧..." class="search-input" />
        <button class="search-btn">🔍</button>
      </div>

      <div class="button-group">
        <!-- 管理员：新增番剧 -->
        <button v-if="isAdmin" class="btn btn-add" @click="openDialog('add')">✨ 新增番剧</button>
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

    <!-- 管理员新增/编辑弹窗 -->
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
        <el-form-item label="封面">
          <div class="cover-upload-area">
            <div v-if="form.coverImg" class="cover-preview">
              <img :src="form.coverImg" alt="封面预览" />
              <el-icon class="remove-cover" @click="form.coverImg = ''">
                <CircleClose />
              </el-icon>
            </div>
            <el-upload
              v-else
              class="cover-upload"
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleCoverChange"
              accept="image/*"
            >
              <el-button size="small" type="primary" plain>选择本地图片</el-button>
            </el-upload>
            <p class="upload-tip">支持 jpg/png，将转为 Base64 存储</p>
          </div>
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

    <!-- 朋友推荐弹窗 -->
    <el-dialog v-model="recommendDialogVisible" title="推荐新番剧" width="400px" custom-class="anime-dialog">
      <el-form label-position="top">
        <el-form-item label="番剧名称">
          <el-input v-model="recommendForm.name" placeholder="请输入番剧名" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="recommendForm.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="封面">
          <div class="cover-upload-area">
            <div v-if="recommendForm.coverImg" class="cover-preview">
              <img :src="recommendForm.coverImg" alt="封面预览" />
              <el-icon class="remove-cover" @click="recommendForm.coverImg = ''">
                <CircleClose />
              </el-icon>
            </div>
            <el-upload
              v-else
              class="cover-upload"
              action="#"
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleRecommendCoverChange"
              accept="image/*"
            >
              <el-button size="small" type="primary" plain>选择本地图片</el-button>
            </el-upload>
            <p class="upload-tip">支持 jpg/png，将转为 Base64 存储</p>
          </div>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="recommendForm.brief" type="textarea" rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="recommendDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitRecommend" color="#a78bfa">提交推荐</el-button>
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
  import { useUserStore } from '@/store/modules/user'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { CircleClose } from '@element-plus/icons-vue'
  import type { AnimeItem } from '@/api/anime/type'

  const animeStore = useAnimeStore()
  const userStore = useUserStore()

  const isAdmin = computed(() => userStore.userInfo.roles?.includes('admin'))
  const isFriend = computed(() => userStore.userInfo.roles?.includes('friend'))

  const searchQuery = ref('')
  const filteredList = computed(() => {
    if (!searchQuery.value) return animeStore.animeList
    return animeStore.animeList.filter(
      item =>
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  // 管理员弹窗
  const dialogVisible = ref(false)
  const dialogType = ref<'add' | 'edit'>('add')
  const currentId = ref<number | null>(null)
  const form = reactive({
    name: '',
    author: '',
    coverImg: '',
    brief: ''
  })

  // 朋友推荐弹窗
  const recommendDialogVisible = ref(false)
  const recommendForm = reactive({
    name: '',
    author: '',
    coverImg: '',
    brief: ''
  })

  // 管理员封面上传处理
  const handleCoverChange = (file: any) => {
    const reader = new FileReader()
    reader.onload = e => {
      form.coverImg = e.target?.result as string
    }
    reader.readAsDataURL(file.raw)
  }

  // 朋友推荐封面上传处理
  const handleRecommendCoverChange = (file: any) => {
    const reader = new FileReader()
    reader.onload = e => {
      recommendForm.coverImg = e.target?.result as string
    }
    reader.readAsDataURL(file.raw)
  }

  const openDialog = (type: 'add' | 'edit', item?: AnimeItem) => {
    dialogType.value = type
    if (type === 'edit' && item) {
      currentId.value = item.id
      Object.assign(form, item)
    } else {
      currentId.value = null
      form.name = ''
      form.author = ''
      form.brief = ''
      form.coverImg = ''
    }
    dialogVisible.value = true
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.author.trim()) {
      ElMessage.warning('请填写完整信息')
      return
    }
    try {
      if (dialogType.value === 'add') {
        await animeStore.addAnime(form)
        ElMessage.success('新增成功')
      } else {
        await animeStore.updateAnime({ id: currentId.value!, ...form })
        ElMessage.success('修改成功')
      }
      dialogVisible.value = false
    } catch (err: any) {
      ElMessage.error(err.message || '操作失败')
    }
  }

  const handleDelete = (id: number) => {
    ElMessageBox.confirm('确定要抹除这段番剧回忆吗？', '警告', { type: 'warning' })
      .then(async () => {
        await animeStore.deleteAnime(id)
        ElMessage.success('已删除')
      })
      .catch(() => {})
  }

  // 朋友推荐弹窗
  const openRecommendDialog = () => {
    recommendForm.name = ''
    recommendForm.author = ''
    recommendForm.brief = ''
    recommendForm.coverImg = ''
    recommendDialogVisible.value = true
  }

  const submitRecommend = async () => {
    if (!recommendForm.name.trim() || !recommendForm.author.trim()) {
      ElMessage.warning('请填写完整信息')
      return
    }
    try {
      await animeStore.recommendAnime(recommendForm)
      ElMessage.success('推荐成功！等待管理员审核 ✨')
      recommendDialogVisible.value = false
    } catch (err: any) {
      ElMessage.error(err.message || '推荐失败')
    }
  }

  const handleRandomRecommend = () => {
    const list = animeStore.animeList
    if (list.length === 0) {
      ElMessage.warning('暂无番剧可推荐')
      return
    }
    const random = list[Math.floor(Math.random() * list.length)]
    ElMessageBox.alert(`✨ 今日森林为你选中的是：\n《${random.name}》`, '随机推荐')
  }

  onMounted(async () => {
    try {
      await animeStore.getAnimes()
    } catch {
      ElMessage.error('加载番剧列表失败')
    }
  })
</script>

<style scoped>
  /* 原有样式保持不变 */
  .anime-page {
    min-height: 100vh;
    background: linear-gradient(120deg, #e0f2fe 0%, #f5f3ff 100%);
    padding: 40px 20px;
    font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  }

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

  :deep(.anime-dialog) {
    border-radius: 20px;
    overflow: hidden;
  }

  :deep(.el-dialog__header) {
    background: #f0f9ff;
    margin-right: 0;
  }

  .btn:active {
    transform: scale(0.95);
  }

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

  /* 新增封面上传样式 */
  .cover-upload-area {
    .cover-preview {
      position: relative;
      display: inline-block;
      img {
        max-width: 200px;
        max-height: 200px;
        border-radius: 8px;
        border: 1px solid #ddd;
      }
      .remove-cover {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #ff4d4f;
        color: #fff;
        border-radius: 50%;
        font-size: 18px;
        cursor: pointer;
        padding: 2px;
      }
    }
    .upload-tip {
      font-size: 12px;
      color: #999;
      margin-top: 5px;
    }
  }
</style>
