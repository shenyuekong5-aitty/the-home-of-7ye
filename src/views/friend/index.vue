<template>
  <div class="friend-page">
    <!-- 彩灯装饰 -->
    <div class="lights">
      <span v-for="(char, i) in 'OUR STORY'.split('')" :key="i" class="bulb" :style="{ animationDelay: `${i * 0.2}s` }">
        {{ char === ' ' ? '\u00A0' : char }}
      </span>
    </div>

    <!-- 管理员切换朋友选择器 -->
    <div v-if="isAdmin" class="admin-bar">
      <el-select v-model="selectedFriendId" placeholder="选择一位朋友" @change="handleSelectFriend">
        <el-option v-for="f in friendStore.friendUsers" :key="f.userId" :label="f.nickname" :value="f.userId" />
      </el-select>
    </div>

    <!-- 伙伴昵称标题 -->
    <h3 class="partner-title">{{ partnerNickname }}</h3>

    <!-- 回忆内容 -->
    <div v-loading="friendStore.loading" class="memory-feed">
      <div v-if="isAdmin && !selectedFriendId" class="empty-hint">请选择一位朋友，查看你们的专属回忆 🕊️</div>
      <div v-else-if="friendStore.memories.length === 0" class="empty-hint">
        还没有任何回忆，快去添加第一张照片吧 📸
      </div>
      <div v-else class="card-list">
        <div v-for="memory in friendStore.memories" :key="memory.id" class="memory-card">
          <div class="card-photo-wrapper">
            <img v-if="memory.photo" :src="memory.photo" class="card-photo" alt="回忆照片" />
            <div v-else class="photo-placeholder">📷</div>
          </div>
          <div class="card-content">
            <h4 class="card-title">{{ memory.title }}</h4>
            <p class="card-time">{{ memory.memoryTime }}</p>
            <p class="card-desc">{{ memory.description }}</p>
            <div class="card-actions">
              <el-button text type="danger" size="small" @click="handleDelete(memory.id)">删除</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="friendStore.currentPage < friendStore.totalPages - 1" style="text-align: center; margin-top: 20px">
      <el-button :loading="friendStore.loading" @click="loadMore">加载更多回忆</el-button>
    </div>
    <!-- 添加回忆按钮 -->
    <div class="add-btn-area">
      <el-button type="primary" round @click="openAddMemoryDialog">+ 珍藏回忆</el-button>
    </div>

    <!-- 添加回忆对话框 -->
    <el-dialog v-model="addMemoryDialogVisible" title="珍藏回忆" width="450px">
      <el-form :model="memoryForm" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="memoryForm.title" placeholder="给这段回忆起个名字" />
        </el-form-item>
        <el-form-item label="时间">
          <el-input v-model="memoryForm.memoryTime" placeholder="如 2024 夏天" />
        </el-form-item>
        <el-form-item label="照片">
          <el-upload
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handlePhotoChange"
            accept="image/*"
          >
            <el-button size="small">选择照片</el-button>
          </el-upload>
          <img v-if="memoryForm.photo" :src="memoryForm.photo" class="preview-img" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="memoryForm.description" type="textarea" rows="3" placeholder="写点什么..." />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="addMemoryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddMemory">珍藏</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useFriendStore } from '@/store/modules/friend'
  import { useUserStore } from '@/store/modules/user'
  import { ElMessage, ElMessageBox } from 'element-plus'

  const friendStore = useFriendStore()
  const userStore = useUserStore()

  const isAdmin = computed(() => userStore.userInfo?.role === 'admin')
  const selectedFriendId = ref<number | null>(null)

  const partnerNickname = computed(() => {
    if (isAdmin.value && selectedFriendId.value) {
      const f = friendStore.friendUsers.find(u => u.userId === selectedFriendId.value)
      return f ? `与 ${f.nickname} 的回忆` : '朋友'
    }
    if (!isAdmin.value) {
      return '我们的故事'
    }
    return '选择一个朋友'
  })

  const handleSelectFriend = (val: number) => {
    selectedFriendId.value = val
    friendStore.fetchMemories(val, 0, friendStore.pageSize, false)
  }

  const handleDelete = (memoryId: number) => {
    ElMessageBox.confirm('确定要删除这条回忆吗？', '警告', { type: 'warning' })
      .then(() => friendStore.deleteMemory(memoryId))
      .catch(() => {})
  }

  // ---------- 添加回忆 ----------
  const addMemoryDialogVisible = ref(false)
  const memoryForm = ref({
    title: '',
    memoryTime: '',
    photo: '',
    description: ''
  })

  const handlePhotoChange = (file: any) => {
    const reader = new FileReader()
    reader.onload = e => {
      memoryForm.value.photo = e.target?.result as string
    }
    reader.readAsDataURL(file.raw)
  }

  const openAddMemoryDialog = () => {
    memoryForm.value = { title: '', memoryTime: '', photo: '', description: '' }
    addMemoryDialogVisible.value = true
  }

  const handleAddMemory = async () => {
    if (!memoryForm.value.title) {
      ElMessage.warning('标题不能为空')
      return
    }
    let friendId: number
    if (isAdmin.value) {
      if (!selectedFriendId.value) {
        ElMessage.warning('请先选择一个朋友')
        return
      }
      friendId = selectedFriendId.value
    } else {
      friendId = 1 // 核心用户ID
    }
    await friendStore.addMemory({
      friendId,
      title: memoryForm.value.title,
      photo: memoryForm.value.photo,
      description: memoryForm.value.description,
      memoryTime: memoryForm.value.memoryTime
    })
    addMemoryDialogVisible.value = false
  }

  const loadMore = () => {
    const nextPage = friendStore.currentPage + 1
    const partnerId = isAdmin.value ? selectedFriendId.value : null
    friendStore.fetchMemories(partnerId, nextPage, friendStore.pageSize, true) // 追加
  }

  onMounted(async () => {
    if (isAdmin.value) {
      await friendStore.fetchFriendUsers()
      if (friendStore.friendUsers.length > 0) {
        const first = friendStore.friendUsers[0]!
        selectedFriendId.value = first.userId
        friendStore.fetchMemories(first.userId, 0, friendStore.pageSize, false)
      }
    } else {
      friendStore.fetchMemories(null, 0, friendStore.pageSize, false)
    }
  })
</script>

<style scoped>
  .friend-page {
    min-height: 100vh;
    padding: 40px 20px;
    overflow-x: hidden;
    font-family: 'PingFang SC', 'Hiragino Sans GB', sans-serif;
    background: linear-gradient(135deg, #fdf6ec 0%, #ffe8d6 100%);
  }

  .lights {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-bottom: 30px;
    text-align: center;
  }

  .bulb {
    display: inline-block;
    margin: 0 3px;
    font-size: 2.2rem;
    font-weight: bold;
    color: #ffb84d;
    text-shadow:
      0 0 12px #ffcc80,
      0 0 24px #fa3;
    animation: glow 1.8s ease-in-out infinite alternate;
  }

  @keyframes glow {
    from {
      opacity: 0.4;
      transform: scale(0.95);
    }

    to {
      opacity: 1;
      transform: scale(1.05);
    }
  }

  .admin-bar {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  .partner-title {
    margin-bottom: 30px;
    font-size: 2rem;
    color: #b36b3e;
    text-align: center;
  }

  .memory-feed {
    max-width: 900px;
    margin: 0 auto;
  }

  /* ========== 核心改动：交错倾斜布局 ========== */
  .card-list {
    display: flex;
    flex-direction: column;
    gap: 80px; /* 卡片之间的垂直间距 */
    align-items: center;
    padding: 40px 0;
  }

  .memory-card {
    position: relative;
    align-self: center;
    width: 320px;
    background: white;
    border-radius: 12px;
    box-shadow:
      0 10px 25px rgb(0 0 0 / 12%),
      0 0 0 5px white,
      0 0 0 8px rgb(0 0 0 / 5%);
    transform: rotate(-2deg);
    transition:
      transform 0.3s ease,
      box-shadow 0.3s ease;
    animation: fade-in-up 0.6s ease backwards;
  }

  /* 奇数卡片左倾，偶数卡片右倾，并偏移位置 */
  .memory-card:nth-child(odd) {
    align-self: flex-start;
    margin-left: 5%;
    transform: rotate(-3deg);
  }

  .memory-card:nth-child(even) {
    align-self: flex-end;
    margin-right: 5%;
    transform: rotate(3deg);
  }

  .memory-card:hover {
    z-index: 10;
    box-shadow:
      0 15px 30px rgb(0 0 0 / 18%),
      0 0 0 5px white,
      0 0 0 8px rgb(0 0 0 / 8%);
    transform: rotate(0deg) scale(1.03);
  }

  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px) rotate(-5deg);
    }

    to {
      opacity: 1;
      transform: translateY(0) rotate(-3deg);
    }
  }

  /* 偶数卡片动画起始角度相反 */
  .memory-card:nth-child(even) {
    animation-name: fade-in-up-even;
  }

  @keyframes fade-in-up-even {
    from {
      opacity: 0;
      transform: translateY(30px) rotate(5deg);
    }

    to {
      opacity: 1;
      transform: translateY(0) rotate(3deg);
    }
  }

  .card-photo-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 220px;
    overflow: hidden;
    background: #f0e0d0;
    border-radius: 12px 12px 0 0;
  }

  .card-photo {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .photo-placeholder {
    font-size: 50px;
    color: #ccb39a;
  }

  .card-content {
    padding: 18px 16px;
    background: #fffef7;
    border-radius: 0 0 12px 12px;
  }

  .card-title {
    margin-bottom: 6px;
    font-size: 1.3rem;
    font-weight: 600;
    color: #5b3e1e;
  }

  .card-time {
    margin-bottom: 10px;
    font-size: 0.85rem;
    color: #b38b6e;
  }

  .card-desc {
    margin-bottom: 12px;
    font-size: 0.95rem;
    line-height: 1.6;
    color: #6e5c45;
  }

  .card-actions {
    padding-top: 10px;
    margin-top: 10px;
    text-align: right;
    border-top: 1px dashed #e7d7c4;
  }

  .preview-img {
    max-height: 100px;
    margin-top: 8px;
    border: 2px solid white;
    border-radius: 8px;
  }

  .empty-hint {
    margin-top: 80px;
    font-size: 1.2rem;
    color: #b38b6e;
    text-align: center;
  }

  .add-btn-area {
    margin-top: 50px;
    text-align: center;
  }
</style>
