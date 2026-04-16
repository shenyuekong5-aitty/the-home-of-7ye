<template>
  <div class="music-page">
    <header class="music-header">
      <div class="header-content">
        <h2 class="anime-title">♪ 旋律之森 ♫</h2>
        <p class="subtitle">记录每一份心动瞬间~</p>
      </div>
      <div class="header-right">
        <div v-permission="['friend']" class="message-entry" @click="handleMessage">
          <el-icon><ChatLineRound /></el-icon>
          <span>森林留言</span>
        </div>
      </div>
    </header>

    <div class="music-container">
      <div class="music-toolbar">
        <el-input v-model="searchQuery" placeholder="搜索歌名或歌手..." class="custom-search" clearable>
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-button v-permission="['admin']" class="custom-add-btn" @click="openAddDialog">
          <el-icon><Plus /></el-icon>
          添加旋律
        </el-button>
      </div>

      <div class="music-grid">
        <div v-for="music in filteredMusicList" :key="music.id" class="music-card">
          <div class="card-inner">
            <div class="music-info">
              <span class="music-name">{{ music.name }}</span>
              <span class="music-tag">{{ music.author }}</span>
            </div>

            <div class="card-actions">
              <div class="admin-tools" v-permission="['admin']">
                <el-button link @click="openEditDialog(music)">
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button link @click="handleDelete(music)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>

              <el-button v-permission="['friend']" link class="recommend-btn" @click="handleRecommend(music)">
                <el-icon><Star /></el-icon>
              </el-button>

              <button class="play-btn" @click="gotoMusic">▶</button>
            </div>
          </div>
          <div class="card-glow"></div>
        </div>
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="400px" class="manga-dialog">
      <el-form :model="form" label-width="60px">
        <el-form-item label="歌名">
          <el-input v-model="form.name" placeholder="歌曲名称" />
        </el-form-item>
        <el-form-item label="歌手">
          <el-input v-model="form.author" placeholder="歌手/作者" @keyup.enter="handleSave" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, reactive } from 'vue'
  import { useMusicStore } from '@/store/modules/music'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Search, Plus, Edit, Delete, Star, ChatLineRound } from '@element-plus/icons-vue'
  import type { MusicItem } from '@/api/music/type'

  const musicStore = useMusicStore()
  const searchQuery = ref('')

  // 弹窗相关
  const dialogVisible = ref(false)
  const dialogTitle = ref('新增音乐')
  const editingId = ref<number | null>(null)
  const form = reactive({ name: '', author: '' })

  // 搜索过滤
  const filteredMusicList = computed(() => {
    if (!searchQuery.value) return musicStore.musicList
    return musicStore.musicList.filter(
      item =>
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  const gotoMusic = () => {
    window.open('https://music.163.com/', '_blank')
  }

  // ---------- 管理员功能 ----------
  const openAddDialog = () => {
    dialogTitle.value = '新增音乐'
    editingId.value = null
    form.name = ''
    form.author = ''
    dialogVisible.value = true
  }

  const openEditDialog = (music: MusicItem) => {
    dialogTitle.value = '编辑音乐'
    editingId.value = music.id
    form.name = music.name
    form.author = music.author
    dialogVisible.value = true
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.author.trim()) {
      ElMessage.warning('请填写完整信息')
      return
    }
    try {
      if (editingId.value) {
        await musicStore.updateMusic({ id: editingId.value, ...form })
        ElMessage.success('修改成功')
      } else {
        await musicStore.addMusic(form)
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
    } catch (err: any) {
      ElMessage.error(err.message || '操作失败')
    }
  }

  const handleDelete = (music: MusicItem) => {
    ElMessageBox.confirm(`确定要删除《${music.name}》吗？`, '删除确认', { type: 'warning' })
      .then(async () => {
        await musicStore.deleteMusic(music.id)
        ElMessage.success('删除成功')
      })
      .catch(() => {})
  }

  // ---------- 朋友功能 ----------
  const handleRecommend = async (music: MusicItem) => {
    try {
      await musicStore.recommendMusic({ name: music.name, author: music.author })
      ElMessage.success(`已推荐《${music.name}》，等待管理员审核 ✨`)
    } catch (err: any) {
      ElMessage.error(err.message || '推荐失败')
    }
  }

  const handleMessage = () => {
    ElMessage.info('正在前往留言板...（功能开发中）')
  }

  onMounted(async () => {
    try {
      await musicStore.getMusics()
    } catch {
      ElMessage.error('加载音乐列表失败')
    }
  })
</script>

<style scoped lang="scss">
  .music-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
    padding: 30px;
  }

  .music-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 30px;
    .header-content {
      .anime-title {
        font-size: 32px;
        font-weight: 800;
        color: #4a3a2e;
        margin: 0 0 8px;
      }
      .subtitle {
        color: #8b7a6b;
        font-size: 14px;
        margin: 0;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 20px;
    .message-entry {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      color: #ff85a2;
      font-size: 12px;
      transition: all 0.3s;
      &:hover {
        transform: scale(1.1);
        filter: brightness(1.1);
      }
      .el-icon {
        font-size: 24px;
        margin-bottom: 2px;
      }
    }
  }

  .music-toolbar {
    max-width: 1200px;
    margin: 0 0 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;

    .custom-search {
      flex: 1;
      max-width: 400px;
      :deep(.el-input__wrapper) {
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(5px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03) !important;
        border: 1px solid rgba(255, 255, 255, 0.5);
      }
    }

    .custom-add-btn {
      background: #ffb6c1;
      color: white;
      border: none;
      padding: 12px 25px;
      border-radius: 20px;
      font-weight: bold;
      box-shadow: 0 4px 15px rgba(255, 182, 193, 0.4);
      &:hover {
        background: #ff85a2;
        transform: translateY(-2px);
      }
    }
  }

  .music-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }

  .music-card {
    position: relative;
    cursor: pointer;
    transition: transform 0.2s;
    &:hover {
      transform: translateY(-5px);
    }
  }

  .card-inner {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    background: rgba(255, 255, 255, 0.85);
    border-radius: 18px;
    border: 1px solid rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(5px);
  }

  .music-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-right: 10px;
    overflow: hidden;
    .music-name {
      font-size: 15px;
      font-weight: 600;
      color: #444;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .music-tag {
      font-size: 12px;
      color: #8b7a6b;
    }
  }

  .card-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
    .admin-tools {
      display: flex;
      gap: 4px;
      opacity: 0.3;
      transition: opacity 0.3s;
      border-right: 1px solid #f0f0f0;
      padding-right: 8px;
      .el-button {
        color: #999;
        font-size: 16px;
        &:hover {
          color: #ff85a2;
        }
      }
    }
    .recommend-btn {
      color: #ffccd5;
      font-size: 18px;
      &:hover {
        color: #f7ba2a;
      }
    }
  }

  .music-card:hover .admin-tools {
    opacity: 1;
  }

  .play-btn {
    background: #ffb6c1;
    color: white;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(255, 182, 193, 0.3);
  }

  .manga-dialog {
    border: 2px solid #000;
    border-radius: 12px;
  }
</style>
