<template>
  <div class="game-page">
    <header class="game-header">
      <div class="brand">
        <span class="icon">🎮</span>
        <h2 class="title">游乐空间</h2>
      </div>

      <div class="action-zone">
        <div class="search-box">
          <input type="text" v-model="searchQuery" placeholder="搜索已收录的游戏..." />
          <i class="search-icon">🔎</i>
        </div>
        <button v-if="isAdmin" class="btn-neon btn-add" @click="openAddDialog">
          <span class="plus">+</span>
          新增记录
        </button>
        <button class="btn-neon btn-rand" @click="randomRecommend">
          <span class="dice">🎲</span>
          随机推荐
        </button>
      </div>
    </header>

    <main class="game-content">
      <div class="game-grid">
        <div v-for="game in filteredGames" :key="game.id" class="game-card">
          <div class="cover-box">
            <img :src="game.coverImg" :alt="game.name" class="game-img" />
            <div v-if="isAdmin" class="hover-actions">
              <button class="icon-btn edit" @click="openEditDialog(game)"><i>✎</i></button>
              <button class="icon-btn delete" @click="handleDeleteGame(game.id)"><i>🗑</i></button>
            </div>
            <div class="platform-tag">PC / Mobile</div>
          </div>

          <div class="game-detail">
            <h3 class="game-name">{{ game.name }}</h3>
            <div class="developer">{{ game.author }}</div>
            <p class="game-brief" :title="game.brief">{{ game.brief }}</p>
          </div>

          <div class="card-footer-line"></div>
        </div>
      </div>
    </main>

    <footer class="game-footer">
      <p>探索了 {{ gameStore.gameList.length }} 个奇幻世界</p>
    </footer>

    <!-- 新增/编辑弹窗 -->
    <ItemFormDialog
      v-if="dialogVisible"
      v-model:visible="dialogVisible"
      :title="editingId ? '编辑游戏' : '新增游戏'"
      :fields="[
        { key: 'name', label: '游戏名称', type: 'input', required: true },
        { key: 'author', label: '开发商', type: 'input', required: true },
        { key: 'brief', label: '简介', type: 'textarea' }
      ]"
      :initialData="editingId ? currentGame : null"
      :showCover="true"
      @confirm="handleGameSave"
    />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, reactive } from 'vue'
  import { useGameStore } from '@/store/modules/game'
  import { useUserStore } from '@/store/modules/user'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { GameItem, GameFormData } from '@/api/game/type'
  import ItemFormDialog from '@/components/ItemFormDialog.vue'

  const gameStore = useGameStore()
  const userStore = useUserStore()
  const isAdmin = computed(() => userStore.userInfo.role === 'admin')

  const searchQuery = ref('')
  const dialogVisible = ref(false)
  const currentGame = ref<GameItem | null>(null)
  const dialogTitle = ref('新增游戏')
  const editingId = ref<number | null>(null)

  const form = reactive<GameFormData>({
    name: '',
    author: '',
    brief: '',
    coverImg: ''
  })

  // 搜索过滤
  const filteredGames = computed(() => {
    if (!searchQuery.value) return gameStore.gameList
    return gameStore.gameList.filter(
      game =>
        game.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        game.author.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  // 打开新增
  const openAddDialog = () => {
    dialogTitle.value = '新增游戏'
    editingId.value = null
    form.name = ''
    form.author = ''
    form.brief = ''
    form.coverImg = ''
    dialogVisible.value = true
  }

  // 打开编辑
  const openEditDialog = (game: GameItem) => {
    editingId.value = game.id
    currentGame.value = { ...game } // 关键：设置 currentGame 用于 initialData
    dialogVisible.value = true
  }

  // 提交新增/编辑
  const handleGameSave = async (formData: any) => {
    if (!formData.name?.trim() || !formData.author?.trim()) {
      ElMessage.warning('名称和开发商不能为空')
      return
    }
    try {
      if (editingId.value) {
        await gameStore.updateGame(editingId.value, formData)
      } else {
        await gameStore.addGame(formData)
      }
      dialogVisible.value = false
      editingId.value = null
      currentGame.value = null
    } catch (e: any) {
      ElMessage.error(e.message || '操作失败')
    }
  }

  // 删除
  const handleDeleteGame = (id: number) => {
    ElMessageBox.confirm('确定要删除这个游戏吗？', '警告', { type: 'warning' })
      .then(async () => {
        await gameStore.deleteGame(id)
      })
      .catch(() => {})
  }

  // 随机推荐 (示例)
  const randomRecommend = () => {
    const games = gameStore.gameList
    if (games.length === 0) {
      ElMessage.info('暂无游戏可推荐')
      return
    }
    const random = games[Math.floor(Math.random() * games.length)]!
    ElMessage.success(`为你推荐：${random.name}`)
  }

  onMounted(() => {
    gameStore.getGames()
  })
</script>

<style scoped>
  /* 赛博动漫配色方案 */
  .game-page {
    min-height: 100vh;
    padding: 40px 25px;
    font-family: 'Segoe UI', 'PingFang SC', sans-serif;
    color: #fff;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  }

  /* 顶部玻璃拟态头部 */
  .game-header {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
    max-width: 1300px;
    padding: 20px 35px;
    margin: 0 auto 50px;
    background: rgb(255 255 255 / 5%);
    border: 1px solid rgb(255 255 255 / 10%);
    border-radius: 25px;
    box-shadow: 0 15px 35px rgb(0 0 0 / 30%);
    backdrop-filter: blur(15px);
  }

  .brand {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  .title {
    margin: 0;
    font-size: 26px;
    letter-spacing: 2px;
    background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .action-zone {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  /* 霓虹搜索框 */
  .search-box {
    position: relative;
    display: flex;
    align-items: center;
    padding: 8px 20px;
    background: rgb(0 0 0 / 20%);
    border: 1px solid #4facfe;
    border-radius: 50px;
  }

  .search-box input {
    width: 200px;
    color: white;
    outline: none;
    background: none;
    border: none;
  }

  /* 霓虹按钮 */
  .btn-neon {
    padding: 10px 20px;
    font-weight: bold;
    color: white;
    cursor: pointer;
    border: none;
    border-radius: 12px;
    transition: all 0.3s;
  }

  .btn-add {
    background: #e94560;
    box-shadow: 0 0 15px rgb(233 69 96 / 50%);
  }

  .btn-rand {
    background: #0f3460;
    border: 1px solid #4facfe;
  }

  .btn-neon:hover {
    box-shadow: 0 0 25px rgb(79 172 254 / 60%);
    transform: scale(1.05);
  }

  /* 游戏卡片网格 */
  .game-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 35px;
    max-width: 1300px;
    margin: 0 auto;
  }

  /* 卡片本体 */
  .game-card {
    position: relative;
    overflow: hidden;
    background: #16213e;
    border: 1px solid rgb(255 255 255 / 5%);
    border-radius: 20px;
    transition: all 0.3s ease;
  }

  .game-card:hover {
    border-color: #4facfe;
    box-shadow: 0 10px 30px rgb(0 0 0 / 50%);
    transform: translateY(-12px);
  }

  /* 封面效果 */
  .cover-box {
    position: relative;
    height: 180px;
    overflow: hidden;
  }

  .game-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s;
  }

  .game-card:hover .game-img {
    transform: scale(1.15) rotate(2deg);
  }

  .hover-actions {
    position: absolute;
    inset: 0;
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: center;
    background: rgb(0 0 0 / 60%);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .game-card:hover .hover-actions {
    opacity: 1;
  }

  .icon-btn {
    width: 45px;
    height: 45px;
    font-size: 20px;
    cursor: pointer;
    background: #fff;
    border: none;
    border-radius: 50%;
  }

  .icon-btn.delete {
    color: #e94560;
  }

  .platform-tag {
    position: absolute;
    top: 12px;
    left: 12px;
    padding: 4px 8px;
    font-size: 10px;
    font-weight: bold;
    background: #4facfe;
    border-radius: 6px;
  }

  /* 文字细节 */
  .game-detail {
    padding: 20px;
  }

  .game-name {
    margin: 0 0 5px;
    font-size: 18px;
    color: #fff;
  }

  .developer {
    margin-bottom: 12px;
    font-size: 13px;
    color: #4facfe;
  }

  .game-brief {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    font-size: 13px;
    line-height: 1.6;
    color: #a2a2c2;
    -webkit-box-orient: vertical;
  }

  .card-footer-line {
    width: 0;
    height: 4px;
    background: linear-gradient(90deg, #4facfe, #00f2fe);
    transition: width 0.4s;
  }

  .game-card:hover .card-footer-line {
    width: 100%;
  }

  .game-footer {
    margin-top: 60px;
    color: #535c68;
    text-align: center;
  }
</style>
