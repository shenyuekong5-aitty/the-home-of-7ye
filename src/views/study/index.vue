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

    <!-- 分类筛选区域 -->
    <div class="category-bar">
      <!-- 一级分类按钮组 -->
      <div class="parent-categories">
        <button class="category-btn" :class="{ active: activeParentId === null }" @click="handleParentClick(null)">
          全部
        </button>
        <button
          v-for="parent in parentCategories"
          :key="parent.id"
          class="category-btn"
          :class="{ active: activeParentId === parent.id }"
          @click="handleParentClick(parent.id)"
        >
          {{ parent.name }}
        </button>
      </div>

      <!-- 二级分类按钮组（仅当选中一级且非“全部”时显示） -->
      <div v-if="activeParentId !== null" class="sub-categories">
        <el-radio-group v-model="selectedCategoryId" @change="handleCategoryChange">
          <el-radio-button :value="undefined">全部</el-radio-button>
          <el-radio-button v-for="child in currentSubCategories" :key="child.id" :value="child.id">
            {{ child.name }}
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 搜索框 -->
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

    <!-- 列表区域 -->
    <div class="study-list" v-loading="loading">
      <div v-for="item in filteredList" :key="item.id" class="study-card" @click="goToDetail(item.id)">
        <div class="card-header">
          <h3 class="card-title">{{ item.title }}</h3>
          <div class="card-meta">
            <span class="author">{{ item.authorName }}</span>
            <span class="time">{{ formatTime(item.createTime) }}</span>
            <span v-if="item.categoryName" class="category-tag">{{ item.categoryName }}</span>
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
            <span class="stat-item" @click.stop="handleLike(item)">
              <el-icon :class="{ liked: likeStatus[item.id] }"><Pointer /></el-icon>
              {{ item.likeCount }}
            </span>
            <span class="stat-item" @click.stop="handleFavorite(item)">
              <el-icon :class="{ favorited: favoriteStatus[item.id] }"><Star /></el-icon>
              {{ item.favoriteCount }}
            </span>
            <el-tooltip content="累计浏览次数" placement="top">
              <span class="stat-item" @click.stop="showViewCount(item)">
                <el-icon><View /></el-icon>
                {{ item.viewCount ?? 0 }}
              </span>
            </el-tooltip>
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

    <!-- 分页 -->
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

    <!-- 新增/编辑弹窗（带级联选择器） -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑学习条目' : '新建学习条目'"
      width="600px"
      class="study-dialog"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分类" prop="categoryId">
          <el-cascader
            v-model="form.categoryId"
            :options="categoryCascaderOptions"
            :props="{ checkStrictly: false, emitPath: false, value: 'id', label: 'name' }"
            placeholder="请选择分类"
            clearable
          />
        </el-form-item>
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
  import { Plus, Search, Star, View, ChatDotRound } from '@element-plus/icons-vue'
  import { useStudyStore } from '@/store/modules/study'
  import { useUserStore } from '@/store/modules/user'
  import { useLikeStore } from '@/store/modules/like'
  import { useFavoriteStore } from '@/store/modules/favorite'
  import { useViewStore } from '@/store/modules/view'
  import type { FormInstance, FormRules } from 'element-plus'
  import type { StudyItem, AddStudyParams } from '@/api/study/type'
  import { reqGetCategories, type CategoryItem } from '@/api/study/category'
  import dayjs from 'dayjs'
  import CommentModule from '@/views/comment/index.vue'

  const router = useRouter()
  const studyStore = useStudyStore()
  const userStore = useUserStore()
  const likeStore = useLikeStore()
  const favoriteStore = useFavoriteStore()
  const viewStore = useViewStore()

  const loading = ref(false)
  const searchQuery = ref('')
  const dialogVisible = ref(false)
  const isEdit = ref(false)
  const currentId = ref<number | null>(null)
  const formRef = ref<FormInstance>()

  const likeStatus = reactive<Record<number, boolean>>({})
  const favoriteStatus = reactive<Record<number, boolean>>({})

  const commentDrawerVisible = ref(false)
  const currentStudyId = ref<number | null>(null)
  const currentStudyTitle = ref('')

  // ---- 分类相关 ----
  const parentCategories = ref<CategoryItem[]>([]) // 一级分类列表
  const allCategories = ref<CategoryItem[]>([]) // 所有二级分类（用于筛选和级联选择器）
  const activeParentId = ref<number | null>(null) // 当前选中的一级分类ID，null表示“全部”
  const selectedCategoryId = ref<number | undefined>(undefined) // 当前二级分类ID，undefined表示“全部”

  const currentSubCategories = computed(() => {
    if (activeParentId.value === null) return []
    return allCategories.value.filter(c => c.parentId === activeParentId.value)
  })

  const categoryCascaderOptions = computed(() => {
    return parentCategories.value.map(parent => ({
      ...parent,
      children: allCategories.value.filter(c => c.parentId === parent.id)
    }))
  })

  const form = reactive<AddStudyParams & { categoryId?: number }>({
    title: '',
    description: '',
    advantage: '',
    disadvantage: '',
    categoryId: undefined
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

  const canEdit = (item: StudyItem) => isAdmin.value || item.authorId === currentUserId.value

  const formatTime = (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm')
  const truncateText = (text: string, maxLen: number) => {
    if (!text) return ''
    return text.length > maxLen ? text.slice(0, maxLen) + '...' : text
  }

  const handleSearch = () => {}

  // 获取分类数据（一级和二级）
  const fetchCategories = async () => {
    try {
      const parentRes = await reqGetCategories() // 不传参，获取一级
      parentCategories.value = parentRes.data
      // 获取所有二级分类
      const childPromises = parentCategories.value.map(p => reqGetCategories(p.id))
      const childResults = await Promise.all(childPromises)
      allCategories.value = []
      childResults.forEach(res => {
        if (res.data) allCategories.value.push(...res.data)
      })
    } catch {
      // 忽略加载失败
    }
  }

  // 加载列表（携带当前筛选参数）
  const fetchList = async () => {
    loading.value = true
    try {
      let categoryId: number | undefined = undefined
      let parentCategoryId: number | undefined = undefined

      if (activeParentId.value === null) {
        // 一级“全部”：不传任何分类参数
      } else if (selectedCategoryId.value === undefined) {
        // 二级“全部”：传 parentCategoryId
        parentCategoryId = activeParentId.value
      } else {
        // 具体二级分类：传 categoryId
        categoryId = selectedCategoryId.value
      }

      await studyStore.getStudyList(studyStore.pageNo, studyStore.pageSize, categoryId, parentCategoryId)
      await fetchInteractionStatus()
    } finally {
      loading.value = false
    }
  }

  // 点击一级分类按钮
  const handleParentClick = (parentId: number | null) => {
    activeParentId.value = parentId
    selectedCategoryId.value = undefined // 默认该一级下的“全部”
    studyStore.pageNo = 1
    fetchList()
  }

  // 点击二级分类（radio-group change事件）
  const handleCategoryChange = () => {
    studyStore.pageNo = 1
    fetchList()
  }

  const fetchInteractionStatus = async () => {
    const items = studyStore.studyList
    if (items.length === 0) return
    const ids = items.map(item => item.id)
    const [likeResults, favoriteResults] = await Promise.all([
      Promise.all(ids.map(id => likeStore.checkLike('study', id))),
      Promise.all(ids.map(id => favoriteStore.checkFavorite('study', id)))
    ])
    ids.forEach((id, index) => {
      likeStatus[id] = likeResults[index] || false
      favoriteStatus[id] = favoriteResults[index] || false
    })
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
    form.categoryId = undefined
    dialogVisible.value = true
  }

  const openEditDialog = (item: StudyItem) => {
    isEdit.value = true
    currentId.value = item.id
    form.title = item.title
    form.description = item.description
    form.advantage = item.advantage
    form.disadvantage = item.disadvantage
    form.categoryId = item.categoryId
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

  const handleLike = async (item: StudyItem) => {
    const id = item.id
    try {
      const liked = await likeStore.toggleLike('study', id)
      likeStatus[id] = liked
      item.likeCount += liked ? 1 : -1
    } catch (err: any) {
      ElMessage.error(err.message || '操作失败')
    }
  }

  const handleFavorite = async (item: StudyItem) => {
    const id = item.id
    try {
      const isFavorited = await favoriteStore.toggleFavorite('study', id)
      favoriteStatus[id] = isFavorited
      item.favoriteCount += isFavorited ? 1 : -1
    } catch (err: any) {
      ElMessage.error(err.message || '操作失败')
    }
  }

  const goToDetail = async (id: number) => {
    const newCount = await viewStore.incrementView('study', id)
    if (newCount !== null) {
      const item = studyStore.studyList.find(s => s.id === id)
      if (item) item.viewCount = newCount
    }
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

  const showViewCount = async (item: StudyItem) => {
    ElMessage.info(`📊 该条目已被浏览 ${item.viewCount} 次`)
    const newCount = await viewStore.incrementView('study', item.id)
    if (newCount !== null) {
      item.viewCount = newCount
    }
  }

  onMounted(async () => {
    await fetchCategories()
    fetchList() // 默认加载全部数据
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
    margin-bottom: 20px;
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
      &:hover {
        background: #2563eb;
      }
    }
  }

  .category-bar {
    margin-bottom: 20px;
    background: white;
    padding: 12px 16px;
    border-radius: 8px;
    .parent-categories {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      .category-btn {
        padding: 6px 16px;
        border: 1px solid #d1d5db;
        background: white;
        border-radius: 20px;
        font-size: 13px;
        color: #374151;
        cursor: pointer;
        transition: all 0.2s;
        &:hover {
          border-color: #3b82f6;
          color: #3b82f6;
        }
        &.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
      }
    }
    .sub-categories {
      margin-top: 12px;
      .el-radio-group {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
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
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
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
        align-items: center;
        gap: 12px;
        font-size: 12px;
        color: #64748b;
        .category-tag {
          background: #e0f2fe;
          color: #0284c7;
          padding: 0 8px;
          border-radius: 12px;
          font-size: 10px;
        }
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
          .liked {
            color: #f59e0b;
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
W
