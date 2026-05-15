<template>
  <div class="music-page">
    <header class="music-header">
      <div class="header-content">
        <h2 class="anime-title">♪ 旋律之森 ♫</h2>
        <p class="subtitle">记录每一份心动瞬间~</p>
      </div>
    </header>

    <div class="music-container">
      <div class="music-toolbar">
        <el-input v-model="searchQuery" placeholder="搜索歌名或歌手..." class="custom-search" clearable>
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <!-- 管理员：添加旋律 -->
        <el-button v-if="isAdmin" class="custom-add-btn" @click="openAddDialog">
          <el-icon><Plus /></el-icon>
          添加旋律
        </el-button>

        <!--  朋友：推荐旋律 -->
        <div class="header-right">
          <el-button v-if="isFriend" class="custom-recommend-btn" @click="openRecommendDialog">
            <el-icon><Plus /></el-icon>
            推荐旋律
          </el-button>
          <div class="message-entry" @click="handleMessage">
            <el-icon><ChatLineRound /></el-icon>
            <span>森林留言</span>
          </div>
        </div>
      </div>

      <div class="music-grid">
        <div v-for="music in filteredMusicList" :key="music.id" class="music-card">
          <div class="card-inner">
            <div class="music-info">
              <span class="music-name">{{ music.name }}</span>
              <span class="music-tag">{{ music.author }}</span>
            </div>

            <div class="card-actions">
              <div v-if="isAdmin" class="admin-tools">
                <el-button link @click="openEditDialog(music)">
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button link @click="handleDeleteMusic(music)">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>

              <!-- 朋友：推荐已有歌曲（卡片上的星星） -->
              <el-button v-if="isFriend" link class="recommend-btn" @click="handleRecommend(music)">
                <el-icon><Star /></el-icon>
              </el-button>

              <button class="play-btn" @click="gotoMusic">▶</button>
            </div>
          </div>
          <div class="card-glow"></div>
        </div>
      </div>
    </div>

    <!-- 管理员新增/编辑音乐 -->
    <ItemFormDialog
      v-if="dialogVisible"
      v-model:visible="dialogVisible"
      :title="editingId ? '编辑音乐' : '新增旋律'"
      :fields="[
        { key: 'name', label: '歌名', type: 'input', required: true, placeholder: '歌曲名称' },
        { key: 'author', label: '歌手', type: 'input', required: true, placeholder: '歌手/作者' }
      ]"
      :initialData="currentMusicData"
      @confirm="handleSave"
    />

    <!-- 朋友推荐音乐 -->
    <ItemFormDialog
      v-if="recommendDialogVisible"
      v-model:visible="recommendDialogVisible"
      title="推荐新旋律"
      :fields="[
        { key: 'name', label: '歌名', type: 'input', required: true, placeholder: '歌曲名称' },
        { key: 'author', label: '歌手', type: 'input', required: true, placeholder: '歌手/作者' }
      ]"
      :initialData="null"
      @confirm="submitRecommend"
    />

    <!-- 留言抽屉 -->
    <el-drawer
      v-model="messageDrawerVisible"
      title="森林留言板"
      direction="rtl"
      size="400px"
      custom-class="manga-drawer"
    >
      <div class="message-container">
        <!-- 回复提示 -->
        <div v-if="replyTo" class="replying-to">
          <span>回复 @{{ replyTo.username }}</span>
          <el-button link @click="replyTo = null">取消</el-button>
        </div>
        <div class="post-message">
          <el-input
            v-model="newMessage"
            type="textarea"
            :rows="2"
            :placeholder="replyTo ? `回复 @${replyTo.username}...` : '写下你的留言...'"
            resize="none"
            @keyup.enter="handlePostMessage"
          />
          <el-button type="primary" size="small" @click="handlePostMessage">发送</el-button>
        </div>

        <div class="message-list" v-loading="messageLoading">
          <CommentItem
            v-for="comment in commentList"
            :key="comment.id"
            :comment="comment"
            :current-user-id="currentUserId"
            :is-admin="isAdmin"
            @reply="handleReply"
            @delete="handleDeleteComment"
          />

          <el-empty v-if="!messageLoading && commentList.length === 0" description="暂无留言" />
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useMusicStore } from '@/store/modules/music'
  import { useCommentStore } from '@/store/modules/comment'
  import { useUserStore } from '@/store/modules/user'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Search, Plus, Edit, Delete, Star, ChatLineRound } from '@element-plus/icons-vue'
  import type { MusicItem } from '@/api/music/type'
  import CommentItem from '@/components/CommentItem.vue'
  import ItemFormDialog from '@/components/ItemFormDialog.vue'

  const musicStore = useMusicStore()
  const commentStore = useCommentStore()
  const userStore = useUserStore()

  // 当前用户ID
  const currentUserId = computed(() => userStore.userInfo?.userid ?? undefined)
  // 权限判断
  const isAdmin = computed(() => userStore.userInfo.role === 'admin')
  const isFriend = computed(() => userStore.userInfo.role === 'friend')

  const searchQuery = ref('')

  // 留言抽屉
  const messageDrawerVisible = ref(false)
  const newMessage = ref('')
  const messageLoading = ref(false)
  const commentList = ref<any[]>([])
  const replyTo = ref<{ id: number; username: string } | null>(null)

  // ========== 管理员弹窗 ==========
  const dialogVisible = ref(false)
  const editingId = ref<number | null>(null)
  const currentMusicData = ref<MusicItem | null>(null)

  const openAddDialog = () => {
    editingId.value = null
    currentMusicData.value = null
    dialogVisible.value = true
  }

  const openEditDialog = (music: MusicItem) => {
    editingId.value = music.id
    currentMusicData.value = { ...music }
    dialogVisible.value = true
  }

  const handleSave = async (formData: any) => {
    if (!formData.name?.trim() || !formData.author?.trim()) {
      ElMessage.warning('请填写完整信息')
      return
    }
    try {
      if (editingId.value) {
        await musicStore.updateMusic({ id: editingId.value, ...formData })
        ElMessage.success('修改成功')
      } else {
        await musicStore.addMusic(formData)
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
    } catch (err: any) {
      ElMessage.error(err.message || '操作失败')
    }
  }

  // 音乐删除方法
  const handleDeleteMusic = (music: MusicItem) => {
    ElMessageBox.confirm(`确定要删除《${music.name}》吗？`, '删除确认', { type: 'warning' })
      .then(async () => {
        await musicStore.deleteMusic(music.id)
        ElMessage.success('删除成功')
      })
      .catch(() => {})
  }

  // ========== 朋友推荐弹窗 ==========
  const recommendDialogVisible = ref(false)

  const openRecommendDialog = () => {
    recommendDialogVisible.value = true
  }

  const submitRecommend = async (formData: any) => {
    if (!formData.name?.trim() || !formData.author?.trim()) {
      ElMessage.warning('请填写完整信息')
      return
    }
    try {
      await musicStore.recommendMusic(formData)
      ElMessage.success('推荐成功！等待管理员审核 ✨')
      recommendDialogVisible.value = false
    } catch (err: any) {
      ElMessage.error(err.message || '推荐失败')
    }
  }

  // 推荐已有歌曲（卡片星星）
  const handleRecommend = async (music: MusicItem) => {
    try {
      await musicStore.recommendMusic({ name: music.name, author: music.author })
      ElMessage.success(`已推荐《${music.name}》，等待管理员审核 ✨`)
    } catch (err: any) {
      ElMessage.error(err.message || '推荐失败')
    }
  }

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

  // ========== 留言功能 ==========
  const findCommentById = (list: any[], id: number): any | null => {
    for (const item of list) {
      if (item.id === id) return item
      if (item.children) {
        const found = findCommentById(item.children, id)
        if (found) return found
      }
    }
    return null
  }

  const handleMessage = async () => {
    messageDrawerVisible.value = true
    await fetchComments()
  }

  const fetchComments = async () => {
    messageLoading.value = true
    try {
      await commentStore.fetchComments(1, 10, 'music')
      commentList.value = commentStore.commentList
      console.log('音乐评论数据:', JSON.parse(JSON.stringify(commentList.value))) // 临时打印
    } catch {
      ElMessage.error('加载留言失败')
    } finally {
      messageLoading.value = false
    }
  }

  const handlePostMessage = async () => {
    if (!newMessage.value.trim()) {
      ElMessage.warning('留言内容不能为空')
      return
    }
    try {
      await commentStore.addComment({
        content: newMessage.value,
        parentId: replyTo.value?.id,
        targetType: 'music'
      })
      ElMessage.success(replyTo.value ? '回复成功' : '留言成功')
      newMessage.value = ''
      replyTo.value = null
      await fetchComments()
    } catch (err: any) {
      ElMessage.error(err.message || '留言失败')
    }
  }

  const handleReply = (commentId: number) => {
    const comment = findCommentById(commentList.value, commentId)
    if (comment) {
      replyTo.value = { id: commentId, username: comment.username }
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    try {
      await commentStore.deleteComment(commentId)
      ElMessage.success('删除成功')
      await fetchComments()
    } catch (err: any) {
      ElMessage.error(err.message || '删除失败')
    }
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
    padding: 30px;
    background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
  }

  .music-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 30px;

    .header-content {
      .anime-title {
        margin: 0 0 8px;
        font-size: 32px;
        font-weight: 800;
        color: #4a3a2e;
      }

      .subtitle {
        margin: 0;
        font-size: 14px;
        color: #8b7a6b;
      }
    }
  }

  .music-toolbar {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 0 30px;

    .custom-search {
      flex: 1;
      max-width: 400px;

      :deep(.el-input__wrapper) {
        background: rgb(255 255 255 / 60%);
        border: 1px solid rgb(255 255 255 / 50%);
        border-radius: 20px;
        box-shadow: 0 4px 12px rgb(0 0 0 / 3%) !important;
        backdrop-filter: blur(5px);
      }
    }

    .header-right {
      display: flex;
      gap: 20px;
      align-items: center;

      .message-entry {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 12px;
        color: #ff85a2;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          filter: brightness(1.1);
          transform: scale(1.1);
        }

        .el-icon {
          margin-bottom: 2px;
          font-size: 24px;
        }
      }
    }

    .custom-add-btn {
      padding: 12px 25px;
      margin-left: 580px;
      font-weight: bold;
      color: white;
      background: #ffb6c1;
      border: none;
      border-radius: 20px;
      box-shadow: 0 4px 15px rgb(255 182 193 / 40%);

      &:hover {
        background: #ff85a2;
        transform: translateY(-2px);
      }
    }

    .custom-recommend-btn {
      padding: 12px 25px;
      font-weight: bold;
      color: white;
      background: #ffb6c1;
      border: none;
      border-radius: 20px;
      box-shadow: 0 4px 15px rgb(255 182 193 / 40%);

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
    background: rgb(255 255 255 / 85%);
    border: 1px solid rgb(255 255 255 / 50%);
    border-radius: 18px;
    backdrop-filter: blur(5px);
  }

  .music-info {
    display: flex;
    flex: 1;
    flex-direction: column;
    margin-right: 10px;
    overflow: hidden;

    .music-name {
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 15px;
      font-weight: 600;
      color: #444;
      white-space: nowrap;
    }

    .music-tag {
      font-size: 12px;
      color: #8b7a6b;
    }
  }

  .card-actions {
    display: flex;
    flex-shrink: 0;
    gap: 12px;
    align-items: center;

    .admin-tools {
      display: flex;
      gap: 4px;
      padding-right: 8px;
      border-right: 1px solid #f0f0f0;
      opacity: 0.3;
      transition: opacity 0.3s;

      .el-button {
        font-size: 16px;
        color: #999;

        &:hover {
          color: #ff85a2;
        }
      }
    }

    .recommend-btn {
      font-size: 18px;
      color: #ffccd5;

      &:hover {
        color: #f7ba2a;
      }
    }
  }

  .music-card:hover .admin-tools {
    opacity: 1;
  }

  .play-btn {
    width: 32px;
    height: 32px;
    color: white;
    cursor: pointer;
    background: #ffb6c1;
    border: none;
    border-radius: 50%;
    box-shadow: 0 4px 10px rgb(255 182 193 / 30%);
  }

  .manga-dialog {
    border: 2px solid #000;
    border-radius: 12px;
  }

  .manga-drawer {
    :deep(.el-drawer__header) {
      padding: 16px 20px;
      margin-bottom: 0;
      border-bottom: 2px solid #000;
    }

    :deep(.el-drawer__body) {
      padding: 20px;
    }
  }

  .message-container {
    display: flex;
    flex-direction: column;
    height: 100%;

    .post-message {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;

      .el-textarea {
        flex: 1;
      }

      .el-button {
        align-self: flex-end;
      }
    }

    .message-list {
      flex: 1;
      overflow-y: auto;

      .message-item {
        padding: 15px 0;
        border-bottom: 1px dashed #eee;

        &:last-child {
          border-bottom: none;
        }

        .message-header {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 8px;

          .username {
            font-weight: bold;
            color: #333;
          }

          .time {
            margin-left: auto;
            font-size: 12px;
            color: #999;
          }
        }

        .message-content {
          margin-left: 42px;
          line-height: 1.5;
          color: #555;
        }
      }
    }
  }

  .replying-to {
    display: flex;
    gap: 8px;
    align-items: center;
    padding: 6px 10px;
    margin-bottom: 8px;
    font-size: 13px;
    color: #555;
    background: #f0f0f0;
    border-radius: 8px;
  }

  .music-page {
    min-height: 100vh;
    padding: 30px;
    background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
  }
</style>
