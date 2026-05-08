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
    dialogTitle.value = '编辑游戏'
    editingId.value = game.id
    form.name = game.name
    form.author = game.author
    form.brief = game.brief
    form.coverImg = game.coverImg
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
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    padding: 40px 25px;
    color: #fff;
    font-family: 'Segoe UI', 'PingFang SC', sans-serif;
  }

  /* 顶部玻璃拟态头部 */
  .game-header {
    max-width: 1300px;
    margin: 0 auto 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px 35px;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(15px);
    border-radius: 25px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .title {
    font-size: 26px;
    background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
    letter-spacing: 2px;
  }

  .action-zone {
    display: flex;
    gap: 15px;
    align-items: center;
  }

  /* 霓虹搜索框 */
  .search-box {
    position: relative;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 50px;
    padding: 8px 20px;
    border: 1px solid #4facfe;
    display: flex;
    align-items: center;
  }

  .search-box input {
    background: none;
    border: none;
    color: white;
    outline: none;
    width: 200px;
  }

  /* 霓虹按钮 */
  .btn-neon {
    padding: 10px 20px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    font-weight: bold;
    transition: all 0.3s;
    color: white;
  }

  .btn-add {
    background: #e94560;
    box-shadow: 0 0 15px rgba(233, 69, 96, 0.5);
  }
  .btn-rand {
    background: #0f3460;
    border: 1px solid #4facfe;
  }

  .btn-neon:hover {
    transform: scale(1.05);
    box-shadow: 0 0 25px rgba(79, 172, 254, 0.6);
  }

  /* 游戏卡片网格 */
  .game-grid {
    max-width: 1300px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 35px;
  }

  /* 卡片本体 */
  .game-card {
    background: #16213e;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;
    position: relative;
  }

  .game-card:hover {
    transform: translateY(-12px);
    border-color: #4facfe;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
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
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .game-card:hover .hover-actions {
    opacity: 1;
  }

  .icon-btn {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    border: none;
    background: #fff;
    cursor: pointer;
    font-size: 20px;
  }

  .icon-btn.delete {
    color: #e94560;
  }

  .platform-tag {
    position: absolute;
    top: 12px;
    left: 12px;
    background: #4facfe;
    font-size: 10px;
    padding: 4px 8px;
    border-radius: 6px;
    font-weight: bold;
  }

  /* 文字细节 */
  .game-detail {
    padding: 20px;
  }

  .game-name {
    font-size: 18px;
    margin: 0 0 5px;
    color: #fff;
  }

  .developer {
    font-size: 13px;
    color: #4facfe;
    margin-bottom: 12px;
  }

  .game-brief {
    font-size: 13px;
    color: #a2a2c2;
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-footer-line {
    height: 4px;
    background: linear-gradient(90deg, #4facfe, #00f2fe);
    width: 0;
    transition: width 0.4s;
  }

  .game-card:hover .card-footer-line {
    width: 100%;
  }

  .game-footer {
    text-align: center;
    margin-top: 60px;
    color: #535c68;
  }
</style>
