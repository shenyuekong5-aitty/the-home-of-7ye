<template>
  <div class="cognition-page">
    <header class="cognition-header">
      <div class="header-content">
        <div class="brand">
          <h2 class="title">认知重构</h2>
          <div class="divider"></div>
          <p class="slogan">Deep Thinking & Self‑Cognition</p>
        </div>

        <div class="header-ops">
          <el-button v-permission="['admin']" type="primary" class="btn-create" @click="openAddDialog">
            记录新命题
          </el-button>
        </div>
      </div>
    </header>

    <main class="cognition-list">
      <article v-for="item in cognizeStore.list" :key="item.id" class="cognition-card">
        <div class="card-aside">
          <div class="time-stamp">
            <span class="date">{{ formatTime(item.createTime) }}</span>
          </div>
        </div>

        <div class="card-main">
          <div class="card-header">
            <h3 class="topic-title"># {{ item.title }}</h3>
            <div v-if="canEdit(item)" class="admin-actions">
              <el-button link @click="openEditDialog(item)">编辑</el-button>
              <el-button link type="danger" @click="handleDelete(item.id)">删除</el-button>
            </div>
          </div>

          <div class="card-content">
            <p class="content-text">{{ item.content }}</p>
          </div>

          <footer class="card-footer">
            <div class="interaction">
              <!-- 收藏 -->
              <el-button
                link
                class="action-item"
                :class="{ favorited: favoriteStatus[item.id] }"
                @click="toggleFavorite(item)"
              >
                <el-icon><Star /></el-icon>
                <span>{{ favoriteStatus[item.id] ? '已共鸣' : '共鸣' }}</span>
              </el-button>
              <!-- 评论 -->
              <el-button link class="action-item" @click="openComment(item)">
                <el-icon><ChatDotRound /></el-icon>
                <span>留言</span>
              </el-button>
            </div>

            <div class="meta-info">
              <span class="author">{{ item.authorName }}</span>
              <el-tag size="small" effect="plain" type="info">认知碎片</el-tag>
            </div>
          </footer>
        </div>
      </article>
    </main>

    <div class="page-end">
      <el-divider content-position="center">Thought never ends</el-divider>
    </div>

    <!-- 评论抽屉 -->
    <el-drawer v-model="commentDrawerVisible" :title="`批注 · ${currentCognizeTitle}`" direction="rtl" size="500px">
      <CommentModule v-if="currentCognizeId" :target-type="'cognize'" :target-id="currentCognizeId" />
    </el-drawer>

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑命题' : '记录新命题'" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="60px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="命题标题" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="12" placeholder="写下你的思考，段落间保留换行" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, computed, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Star, ChatDotRound } from '@element-plus/icons-vue'
  import { useCognizeStore } from '@/store/modules/cognize'
  import { useFavoriteStore } from '@/store/modules/favorite'
  import { useUserStore } from '@/store/modules/user'
  import type { FormInstance, FormRules } from 'element-plus'
  import type { CognizeItem, AddCognizeParams } from '@/api/cognize/type'
  import dayjs from 'dayjs'
  import CommentModule from '@/views/comment/index.vue'

  const cognizeStore = useCognizeStore()
  const favoriteStore = useFavoriteStore()
  const userStore = useUserStore()

  // 权限信息
  const isAdmin = computed(() => userStore.userInfo.role == 'admin')
  const currentUserId = computed(() => userStore.userInfo.userid ?? 0)

  const dialogVisible = ref(false)
  const isEdit = ref(false)
  const currentId = ref<number | null>(null)
  const formRef = ref<FormInstance>()

  // 表单数据
  const form = reactive<AddCognizeParams>({
    title: '',
    content: ''
  })

  const rules: FormRules = {
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    content: [{ required: true, message: '请输入内容', trigger: 'blur' }]
  }

  // 收藏状态
  const favoriteStatus = reactive<Record<number, boolean>>({})

  // 评论抽屉
  const commentDrawerVisible = ref(false)
  const currentCognizeId = ref<number | null>(null)
  const currentCognizeTitle = ref('')

  // 权限判断：是否可编辑/删除
  const canEdit = (item: CognizeItem) => {
    return isAdmin.value || item.authorId === currentUserId.value
  }

  // 时间格式化
  const formatTime = (time: string) => dayjs(time).format('YYYY.MM.DD')

  // ========== 数据加载 ==========
  const fetchList = async () => {
    await cognizeStore.fetchList(1, 10)
    await refreshFavoriteStatus()
  }

  const refreshFavoriteStatus = async () => {
    const items = cognizeStore.list
    if (!items.length) return
    const ids: number[] = items.map((item: CognizeItem) => item.id)
    const results = await Promise.all(ids.map(id => favoriteStore.checkFavorite('cognize', id)))
    ids.forEach((id, idx) => {
      favoriteStatus[id] = results[idx] ?? false
    })
  }

  // ========== 收藏/评论交互 ==========
  const toggleFavorite = async (item: CognizeItem) => {
    try {
      const isFav = await favoriteStore.toggleFavorite('cognize', item.id)
      favoriteStatus[item.id] = isFav
    } catch (err: any) {
      ElMessage.error(err.message || '操作失败')
    }
  }

  const openComment = (item: CognizeItem) => {
    currentCognizeId.value = item.id
    currentCognizeTitle.value = item.title
    commentDrawerVisible.value = true
  }

  // ========== 新增/编辑逻辑 ==========
  const openAddDialog = () => {
    isEdit.value = false
    currentId.value = null
    form.title = ''
    form.content = ''
    dialogVisible.value = true
  }

  const openEditDialog = (item: CognizeItem) => {
    isEdit.value = true
    currentId.value = item.id
    form.title = item.title
    form.content = item.content
    dialogVisible.value = true
  }

  const submitForm = async () => {
    if (!formRef.value) return
    await formRef.value.validate(async valid => {
      if (!valid) return
      try {
        if (isEdit.value && currentId.value) {
          await cognizeStore.update({ id: currentId.value, ...form })
          ElMessage.success('编辑成功')
        } else {
          await cognizeStore.add(form)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        fetchList()
      } catch (err: any) {
        ElMessage.error(err.message || '操作失败')
      }
    })
  }

  // ========== 删除 ==========
  const handleDelete = async (id: number) => {
    ElMessageBox.confirm('确定删除该命题吗？', '提示', { type: 'warning' })
      .then(async () => {
        await cognizeStore.delete(id)
        ElMessage.success('删除成功')
        fetchList()
      })
      .catch(() => {})
  }

  // 初始化
  onMounted(() => {
    fetchList()
  })
</script>

<style scoped>
  /* 原样式完全保留，仅新增 / 覆盖必要样式 */
  .cognition-page {
    min-height: 100vh;
    padding: 60px 20px;
    font-family: Optima, Candara, 'Noto Sans SC', sans-serif;
    background-color: #fcfcfc;
    background-image: linear-gradient(#f1f1f1 1px, transparent 1px);
    background-size: 100% 40px;
  }

  .cognition-header {
    max-width: 900px;
    margin: 0 auto 60px;
  }

  .header-content {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding-bottom: 20px;
    border-bottom: 2px solid #333;
  }

  .title {
    margin: 0;
    font-size: 32px;
    color: #1a1a1a;
    letter-spacing: 2px;
  }

  .divider {
    width: 40px;
    height: 4px;
    margin: 10px 0;
    background: #3498db;
  }

  .slogan {
    font-size: 12px;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 3px;
  }

  .header-ops {
    display: flex;
    gap: 15px;
  }

  .search-box {
    width: 200px;
  }

  .btn-create {
    background-color: #1a1a1a;
    border: none;
  }

  .cognition-list {
    max-width: 900px;
    margin: 0 auto;
  }

  .cognition-card {
    display: flex;
    margin-bottom: 50px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgb(0 0 0 / 3%);
    transition: transform 0.3s;
  }

  .cognition-card:hover {
    box-shadow: 0 15px 40px rgb(0 0 0 / 8%);
    transform: translateY(-5px);
  }

  .card-aside {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    color: #fff;
    background: #1a1a1a;
    border-radius: 8px 0 0 8px;
  }

  .time-stamp {
    font-size: 11px;
    letter-spacing: 2px;
    opacity: 0.8;
    writing-mode: vertical-rl;
    text-orientation: mixed;
  }

  .card-main {
    flex: 1;
    padding: 30px;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .topic-title {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #2c3e50;
  }

  .admin-actions {
    opacity: 0;
    transition: opacity 0.3s;
  }

  .cognition-card:hover .admin-actions {
    opacity: 1;
  }

  .content-text {
    margin-bottom: 25px;
    font-size: 15px;
    line-height: 1.8;
    color: #444;
    text-align: justify;
    white-space: pre-wrap;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 20px;
    border-top: 1px dashed #eee;
  }

  .interaction {
    display: flex;
    gap: 10px;
  }

  .action-item {
    color: #7f8c8d !important;
  }

  .action-item:hover {
    color: #3498db !important;
  }

  .action-item .el-icon {
    margin-right: 5px;
    font-size: 16px;
  }

  /* 已收藏状态高亮 */
  .action-item.favorited {
    color: #f39c12 !important;
  }

  .meta-info {
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 13px;
    color: #888;
  }

  .author {
    font-style: italic;
  }

  .page-end {
    margin: 80px 0;
    opacity: 0.5;
  }
</style>
