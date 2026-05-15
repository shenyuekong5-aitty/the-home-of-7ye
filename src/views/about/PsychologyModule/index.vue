<template>
  <div class="emotion-page">
    <header class="emotion-header">
      <div class="header-left">
        <h2 class="title">情绪树洞</h2>
        <p class="subtitle">有些话，说出来会好受一点...</p>
      </div>

      <div class="header-right">
        <el-input v-model="searchQuery" placeholder="搜索心情关键词..." class="search-input" clearable />
        <el-button type="primary" round class="publish-btn" @click="openPublishDialog">
          发表情绪
          <el-icon class="el-icon--right"><Edit /></el-icon>
        </el-button>
      </div>
    </header>

    <main class="emotion-container">
      <div v-if="filteredList.length === 0" class="empty-tip">还没有人倾诉，来做第一个吧 🌱</div>
      <div class="emotion-list">
        <div v-for="item in filteredList" :key="item.id" class="emotion-card">
          <div class="card-top">
            <div class="author-info">
              <el-avatar :size="35" :src="item.avatar">
                {{ item.author.charAt(0).toUpperCase() }}
              </el-avatar>
              <span class="author-name">{{ item.author }}</span>
            </div>
            <span class="time">{{ item.time?.slice(0, 16).replace('T', ' ') }}</span>
          </div>

          <div class="card-content">
            <p>{{ item.content }}</p>
          </div>

          <div class="card-bottom">
            <div class="interaction">
              <el-button link class="comment-btn" @click="toggleReplyInput(item.id)">
                <span class="icon">💬</span>
                {{ item.remarks.length }}
              </el-button>
            </div>

            <!-- 仅作者本人或管理员可见操作按钮 -->
            <div v-if="canEdit(item)" class="admin-btns">
              <el-button type="primary" link size="small" @click="openEditDialog(item)">编辑</el-button>
              <el-button type="danger" link size="small" @click="handleDelete(item.id)">删除</el-button>
            </div>
          </div>

          <!-- 回复列表展示 -->
          <div v-if="item.remarks && item.remarks.length > 0" class="remarks-box">
            <div v-for="(msg, i) in item.remarks" :key="i" class="remark-item">
              <span class="remark-user">匿名路人:</span>
              {{ msg }}
            </div>
          </div>

          <!-- 回复输入框（只对当前点击的情绪展开） -->
          <div v-if="replyTargetId === item.id" class="reply-input-area">
            <el-input
              v-model="replyContent"
              placeholder="说一句安慰的话..."
              size="small"
              @keyup.enter="submitReply(item.id)"
            />
            <el-button size="small" type="primary" @click="submitReply(item.id)">发送</el-button>
            <el-button size="small" @click="clearReply">取消</el-button>
          </div>
        </div>
      </div>
    </main>

    <div class="footer-decoration">☁️ 愿每一个灵魂都能被温柔以待</div>

    <!-- 发表/编辑 共用弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="450px" class="emotion-dialog">
      <el-input
        v-model="editContent"
        type="textarea"
        :rows="5"
        placeholder="此刻的心情（超出字数部分将被截断）..."
        maxlength="500"
        show-word-limit
      />
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useEmotionStore } from '@/store/modules/emotion'
  import { useUserStore } from '@/store/modules/user'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { EmotionItem } from '@/api/emotion/type'

  const emotionStore = useEmotionStore()
  const userStore = useUserStore()

  const searchQuery = ref('')

  // 当前用户
  const currentUserId = computed(() => userStore.userInfo?.userid)
  console.log('当前用户完整信息:', JSON.parse(JSON.stringify(userStore.userInfo)))

  const isAdmin = computed(() => userStore.userInfo?.role === 'admin')

  // 发表/编辑弹窗
  const dialogVisible = ref(false)
  const dialogTitle = ref('发表情绪')
  const editContent = ref('')
  const editingId = ref<number | null>(null)

  // 回复相关
  const replyTargetId = ref<number | null>(null)
  const replyContent = ref('')

  // 搜索过滤
  const filteredList = computed(() => {
    if (!searchQuery.value) return emotionStore.emotionList
    return emotionStore.emotionList.filter(
      item =>
        item.content.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  // 权限判断：管理员或作者本人
  const canEdit = (item: EmotionItem) => {
    if (!currentUserId.value) return false
    return isAdmin.value || currentUserId.value === item.userid
  }

  // 打开新增弹窗
  const openPublishDialog = () => {
    dialogTitle.value = '发表情绪'
    editContent.value = ''
    editingId.value = null
    dialogVisible.value = true
  }

  // 打开编辑弹窗
  const openEditDialog = (item: EmotionItem) => {
    dialogTitle.value = '编辑情绪'
    editContent.value = item.content
    editingId.value = item.id
    dialogVisible.value = true
  }

  // 提交新增或编辑
  const handleSubmit = async () => {
    const content = editContent.value.trim()
    if (!content) {
      ElMessage.warning('内容不能为空')
      return
    }
    try {
      if (editingId.value) {
        await emotionStore.updateEmotion(editingId.value, content)
      } else {
        await emotionStore.addEmotion(content)
      }
      dialogVisible.value = false
    } catch {
      // store 已处理错误提示
    }
  }

  // 删除情绪
  const handleDelete = (id: number) => {
    ElMessageBox.confirm('确定要删除这条情绪吗？', '提示', {
      type: 'warning'
    })
      .then(() => emotionStore.deleteEmotion(id))
      .catch(() => {})
  }

  // 切换回复输入框
  const toggleReplyInput = (id: number) => {
    if (replyTargetId.value === id) {
      clearReply()
    } else {
      replyTargetId.value = id
      replyContent.value = ''
    }
  }

  // 提交回复
  const submitReply = async (emotionId: number) => {
    const text = replyContent.value.trim()
    if (!text) {
      ElMessage.warning('回复内容不能为空')
      return
    }
    try {
      await emotionStore.replyEmotion(emotionId, text)
      clearReply()
    } catch {
      // store 已处理
    }
  }

  // 清空回复状态
  const clearReply = () => {
    replyTargetId.value = null
    replyContent.value = ''
  }

  onMounted(() => {
    emotionStore.getEmotions()
  })
</script>

<style scoped>
  /* 回复输入区 */
  .reply-input-area {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-top: 12px;
  }

  .reply-input-area .el-input {
    flex: 1;
  }

  /* 弹窗美化 */
  .emotion-dialog :deep(.el-textarea__inner) {
    font-size: 15px;
    line-height: 1.8;
    color: #5d6d7e;
    background: #fafafa;
    border-radius: 12px;
  }

  /* 治愈系配色 */
  .emotion-page {
    min-height: 100vh;
    padding: 40px 20px;
    font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', sans-serif;
    background: linear-gradient(180deg, #f0f2f5 0%, #e6e9f0 100%);
  }

  /* 头部样式 */
  .emotion-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    max-width: 900px;
    padding-bottom: 20px;
    margin: 0 auto 30px;
    border-bottom: 2px solid #dcdfe6;
  }

  .title {
    margin: 0;
    font-size: 28px;
    color: #606266;
    letter-spacing: 1px;
  }

  .subtitle {
    margin-top: 8px;
    font-size: 14px;
    color: #909399;
  }

  .header-right {
    display: flex;
    gap: 15px;
  }

  .search-input {
    width: 200px;
  }

  .publish-btn {
    background-color: #a3b18a; /* 莫兰迪绿，给人平静感 */
    border: none;
  }

  .publish-btn:hover {
    background-color: #588157;
  }

  /* 情绪卡片列表 */
  .emotion-container {
    max-width: 800px;
    margin: 0 auto;
  }

  .emotion-card {
    padding: 25px;
    margin-bottom: 25px;
    background: white;
    border-left: 5px solid #bdc3c7; /* 默认灰色边框 */
    border-radius: 16px;
    box-shadow: 0 4px 12px rgb(0 0 0 / 5%);
    transition: all 0.3s ease;
  }

  .emotion-card:hover {
    box-shadow: 0 8px 20px rgb(0 0 0 / 8%);
    transform: translateX(5px);
  }

  /* 重点：每张卡片根据内容可以有不同氛围 */
  .emotion-card:nth-child(even) {
    border-left-color: #95a5a6;
  }

  .card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
  }

  .author-info {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .avatar-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 35px;
    height: 35px;
    font-weight: bold;
    color: #7f8c8d;
    background: #ecf0f1;
    border-radius: 50%;
  }

  .author-name {
    font-weight: 600;
    color: #2c3e50;
  }

  .time {
    font-size: 12px;
    color: #bdc3c7;
  }

  .card-content {
    margin-bottom: 20px;
    font-size: 16px;
    font-style: italic; /* 情绪表达通常比较感性 */
    line-height: 1.8;
    color: #5d6d7e;
  }

  .card-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 15px;
    border-top: 1px solid #f2f6fc;
  }

  .icon {
    margin-right: 5px;
  }

  .comment-btn:hover {
    color: #3498db !important;
  }

  /* 留言区样式 */
  .remarks-box {
    padding: 10px 15px;
    margin-top: 15px;
    font-size: 13px;
    background: #f8f9fa;
    border-radius: 8px;
  }

  .remark-item {
    margin-bottom: 5px;
    color: #7f8c8d;
  }

  .remark-user {
    font-weight: bold;
    color: #95a5a6;
  }

  .footer-decoration {
    margin-top: 50px;
    font-size: 14px;
    color: #bdc3c7;
    text-align: center;
  }
</style>
