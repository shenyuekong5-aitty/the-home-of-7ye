<template>
  <div class="study-page">
    <header class="study-header">
      <div class="header-content">
        <h2 class="study-title">📚 学习中心</h2>
        <p class="subtitle">记录技术心得，沉淀知识财富</p>
      </div>
      <div class="header-right">
        <el-button v-permission="['admin']" class="add-btn" @click="openAddDialog">
          <el-icon><Plus /></el-icon>
          新建条目
        </el-button>
      </div>
    </header>

    <div class="study-toolbar">
      <el-input
        v-model="searchQuery"
        placeholder="搜索标题或描述..."
        class="search-input"
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
    </div>

    <div class="study-list" v-loading="loading">
      <div v-for="item in filteredList" :key="item.id" class="study-card" @click="goToDetail(item.id)">
        <div class="card-header">
          <h3 class="card-title">{{ item.title }}</h3>
          <div class="card-meta">
            <span class="author">{{ item.authorName }}</span>
            <span class="time">{{ formatTime(item.createTime) }}</span>
          </div>
        </div>
        <p class="card-desc">{{ truncateText(item.description, 120) }}</p>
        <div class="card-advantages">
          <span class="label">✅ 优点：</span>
          {{ truncateText(item.advantage, 60) }}
        </div>
        <div class="card-disadvantages">
          <span class="label">⚠️ 缺点：</span>
          {{ truncateText(item.disadvantage, 60) }}
        </div>
        <div class="card-footer">
          <div class="stats">
            <span class="stat-item" @click.stop="handleLike(item.id)">
              <el-icon><Star /></el-icon>
              {{ item.likeCount }}
            </span>
            <span class="stat-item" @click.stop="handleFavorite(item.id)">
              <el-icon :class="{ favorited: favoriteStatus[item.id] }"><Collection /></el-icon>
              {{ item.favoriteCount }}
            </span>
            <span class="stat-item">
              <el-icon><View /></el-icon>
              {{ item.viewCount }}
            </span>
            <span class="stat-item" @click.stop="openCommentDrawer(item.id)">
              <el-icon><ChatDotRound /></el-icon>
              评论
            </span>
          </div>
          <div v-if="canEdit(item)" class="actions" @click.stop>
            <el-button link size="small" @click="openEditDialog(item)">编辑</el-button>
            <el-button link size="small" type="danger" @click="handleDelete(item.id)">删除</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="pagination-footer">
      <el-pagination
        v-if="studyStore.total > 0"
        background
        v-model:current-page="studyStore.pageNo"
        :page-size="studyStore.pageSize"
        :total="studyStore.total"
        layout="prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑学习条目' : '新建学习条目'"
      width="600px"
      class="study-dialog"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="详细描述" />
        </el-form-item>
        <el-form-item label="优点" prop="advantage">
          <el-input v-model="form.advantage" type="textarea" :rows="2" placeholder="列举优点" />
        </el-form-item>
        <el-form-item label="缺点" prop="disadvantage">
          <el-input v-model="form.disadvantage" type="textarea" :rows="2" placeholder="列举缺点" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确认</el-button>
      </template>
    </el-dialog>

    <!-- 评论抽屉 -->
    <el-drawer
      v-model="commentDrawerVisible"
      :title="`评论 · ${currentStudyTitle}`"
      direction="rtl"
      size="500px"
      custom-class="comment-drawer"
    >
      <CommentModule v-if="currentStudyId" :target-type="'study'" :target-id="currentStudyId" />
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Plus, Search, Star, Collection, View, ChatDotRound } from '@element-plus/icons-vue'
  import { useStudyStore } from '@/store/modules/study'
  import { useUserStore } from '@/store/modules/user'
  import type { FormInstance, FormRules } from 'element-plus'
  import type { StudyItem, AddStudyParams } from '@/api/study/type'
  import dayjs from 'dayjs'
  import CommentModule from '@/views/comment/index.vue'

  const router = useRouter()
  const studyStore = useStudyStore()
  const userStore = useUserStore()

  const loading = ref(false)
  const searchQuery = ref('')
  const dialogVisible = ref(false)
  const isEdit = ref(false)
  const currentId = ref<number | null>(null)
  const formRef = ref<FormInstance>()
  const favoriteStatus = reactive<Record<number, boolean>>({})

  // 评论抽屉
  const commentDrawerVisible = ref(false)
  const currentStudyId = ref<number | null>(null)
  const currentStudyTitle = ref('')

  const form = reactive<AddStudyParams>({
    title: '',
    description: '',
    advantage: '',
    disadvantage: ''
  })

  const rules: FormRules = {
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
    advantage: [{ required: true, message: '请输入优点', trigger: 'blur' }],
    disadvantage: [{ required: true, message: '请输入缺点', trigger: 'blur' }]
  }

  const isAdmin = computed(() => userStore.userInfo.roles?.includes('admin'))
  const currentUserId = computed(() => userStore.userInfo.userid ?? 0)

  const filteredList = computed(() => {
    if (!searchQuery.value) return studyStore.studyList
    return studyStore.studyList.filter(
      item =>
        item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })

  const canEdit = (item: StudyItem) => {
    return isAdmin.value || item.authorId === currentUserId.value
  }

  const formatTime = (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm')
  const truncateText = (text: string, maxLen: number) => {
    if (!text) return ''
    return text.length > maxLen ? text.slice(0, maxLen) + '...' : text
  }

  const handleSearch = () => {
    // 可添加防抖
  }

  const fetchList = async () => {
    loading.value = true
    try {
      await studyStore.getStudyList(studyStore.pageNo, studyStore.pageSize)
      for (const item of studyStore.studyList) {
        try {
          favoriteStatus[item.id] = await studyStore.checkFavorite(item.id)
        } catch {
          favoriteStatus[item.id] = false
        }
      }
    } finally {
      loading.value = false
    }
  }

  const handlePageChange = (page: number) => {
    studyStore.pageNo = page
    fetchList()
  }

  const openAddDialog = () => {
    isEdit.value = false
    currentId.value = null
    form.title = ''
    form.description = ''
    form.advantage = ''
    form.disadvantage = ''
    dialogVisible.value = true
  }

  const openEditDialog = (item: StudyItem) => {
    isEdit.value = true
    currentId.value = item.id
    form.title = item.title
    form.description = item.description
    form.advantage = item.advantage
    form.disadvantage = item.disadvantage
    dialogVisible.value = true
  }

  const submitForm = async () => {
    if (!formRef.value) return
    await formRef.value.validate(async valid => {
      if (!valid) return
      try {
        if (isEdit.value && currentId.value) {
          await studyStore.updateStudy({ id: currentId.value, ...form })
          ElMessage.success('编辑成功')
        } else {
          await studyStore.addStudy(form)
          ElMessage.success('创建成功')
        }
        dialogVisible.value = false
        fetchList()
      } catch (err: any) {
        ElMessage.error(err.message || '操作失败')
      }
    })
  }

  const handleDelete = async (id: number) => {
    ElMessageBox.confirm('确定删除该学习条目吗？', '提示', { type: 'warning' })
      .then(async () => {
        await studyStore.deleteStudy(id)
        ElMessage.success('删除成功')
        fetchList()
      })
      .catch(() => {})
  }

  const handleLike = async (id: number) => {
    try {
      await studyStore.likeStudy(id)
    } catch (err: any) {
      ElMessage.error(err.message || '点赞失败')
    }
  }

  const handleFavorite = async (id: number) => {
    try {
      const newStatus = await studyStore.toggleFavorite(id)
      favoriteStatus[id] = newStatus
    } catch (err: any) {
      ElMessage.error(err.message || '操作失败')
    }
  }

  const goToDetail = (id: number) => {
    router.push(`/study/${id}`)
  }

  const openCommentDrawer = (id: number) => {
    const item = studyStore.studyList.find(s => s.id === id)
    if (item) {
      currentStudyId.value = id
      currentStudyTitle.value = item.title
      commentDrawerVisible.value = true
    }
  }

  onMounted(() => {
    fetchList()
  })
</script>

<style scoped lang="scss">
  .study-page {
    min-height: 100vh;
    background: #f8fafc;
    padding: 30px;
  }

  .study-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 30px;
    .header-content {
      .study-title {
        font-size: 28px;
        font-weight: 700;
        color: #1e293b;
        margin: 0 0 8px;
      }
      .subtitle {
        color: #64748b;
        font-size: 14px;
        margin: 0;
      }
    }
    .add-btn {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 500;
      &:hover {
        background: #2563eb;
      }
    }
  }

  .study-toolbar {
    margin-bottom: 20px;
    .search-input {
      max-width: 400px;
    }
  }

  .study-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .study-card {
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    transition: all 0.2s;
    cursor: pointer;
    border: 1px solid #e2e8f0;
    &:hover {
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }
    .card-header {
      margin-bottom: 12px;
      .card-title {
        font-size: 18px;
        font-weight: 600;
        color: #0f172a;
        margin: 0 0 6px;
      }
      .card-meta {
        display: flex;
        gap: 12px;
        font-size: 12px;
        color: #64748b;
      }
    }
    .card-desc {
      font-size: 14px;
      color: #334155;
      margin-bottom: 12px;
      line-height: 1.5;
    }
    .card-advantages,
    .card-disadvantages {
      font-size: 13px;
      margin-bottom: 8px;
      color: #475569;
      .label {
        font-weight: 600;
      }
    }
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid #f1f5f9;
      .stats {
        display: flex;
        gap: 16px;
        .stat-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          color: #64748b;
          cursor: pointer;
          &:hover {
            color: #3b82f6;
          }
          .el-icon {
            font-size: 16px;
          }
          .favorited {
            color: #f59e0b;
          }
        }
      }
      .actions {
        display: flex;
        gap: 8px;
      }
    }
  }

  .pagination-footer {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .study-dialog {
    :deep(.el-dialog) {
      border-radius: 12px;
    }
  }
</style>
