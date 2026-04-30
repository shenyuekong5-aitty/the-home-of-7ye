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
      <div v-if="activeParentId !== null" class="sub-categories">
        <el-radio-group v-model="selectedCategoryId" @change="handleCategoryChange">
          <el-radio-button :value="undefined">全部</el-radio-button>
          <el-radio-button v-for="child in currentSubCategories" :key="child.id" :value="child.id">
            {{ child.name }}
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>

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
            <span v-for="cat in item.categories" :key="cat.id" class="category-tag">{{ cat.name }}</span>
          </div>
        </div>
        <p class="card-desc">{{ truncateText(item.description, 120) }}</p>

        <!-- 根据模板类型展示不同字段 -->
        <template v-if="item.templateType === 'tech'">
          <div class="card-advantages">
            <span class="label">✅ 优点：</span>
            {{ truncateText(item.advantage, 60) }}
          </div>
          <div class="card-disadvantages">
            <span class="label">⚠️ 缺点：</span>
            {{ truncateText(item.disadvantage, 60) }}
          </div>
        </template>
        <template v-else-if="item.templateType === 'thought'">
          <div class="card-advantages">
            <span class="label">💡 核心思想：</span>
            {{ truncateText(item.advantage, 60) }}
          </div>
          <div class="card-disadvantages">
            <span class="label">📖 个人启发：</span>
            {{ truncateText(item.disadvantage, 60) }}
          </div>
        </template>
        <!-- 未来可扩展更多模板 -->

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

    <!-- 新增/编辑弹窗（支持模板切换） -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑学习条目' : '新建学习条目'"
      width="700px"
      class="study-dialog"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="分类" prop="categoryIds">
          <el-cascader
            v-model="form.categoryIds"
            :options="categoryCascaderOptions"
            :props="{
              multiple: true,
              checkStrictly: false,
              emitPath: false,
              value: 'id',
              label: 'name'
            }"
            placeholder="请选择分类（可多选）"
            clearable
          />
        </el-form-item>
        <el-form-item label="内容类型" prop="templateType">
          <el-select v-model="form.templateType" placeholder="请选择内容类型">
            <el-option label="技术分析" value="tech" />
            <el-option label="思辨感悟" value="thought" />
            <!-- 未来可添加更多类型 -->
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="详细描述" />
        </el-form-item>
        <!-- 动态字段：根据模板类型切换标签和占位符 -->
        <el-form-item :label="form.templateType === 'thought' ? '核心思想' : '优点'" prop="advantage">
          <el-input
            v-model="form.advantage"
            type="textarea"
            :rows="2"
            :placeholder="form.templateType === 'thought' ? '阐述核心思想...' : '列举优点'"
          />
        </el-form-item>
        <el-form-item :label="form.templateType === 'thought' ? '个人启发' : '缺点'" prop="disadvantage">
          <el-input
            v-model="form.disadvantage"
            type="textarea"
            :rows="2"
            :placeholder="form.templateType === 'thought' ? '你的感悟与启发...' : '列举缺点'"
          />
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
  import { ElMessage } from 'element-plus'
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
  const parentCategories = ref<CategoryItem[]>([])
  const allCategories = ref<CategoryItem[]>([])
  const activeParentId = ref<number | null>(null)
  const selectedCategoryId = ref<number | undefined>(undefined)

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

  // 拓展 AddStudyParams 以包含 templateType 和 categoryIds
  const form = reactive<AddStudyParams & { categoryIds?: number[]; templateType?: string }>({
    title: '',
    description: '',
    advantage: '',
    disadvantage: '',
    categoryIds: [],
    templateType: 'tech' // 默认技术分析
  })

  const rules: FormRules = {
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
    description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
    advantage: [{ required: true, message: '请填写相关字段', trigger: 'blur' }],
    disadvantage: [{ required: true, message: '请填写相关字段', trigger: 'blur' }]
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

  const fetchCategories = async () => {
    try {
      const parentRes = await reqGetCategories()
      parentCategories.value = parentRes.data
      const childPromises = parentCategories.value.map(p => reqGetCategories(p.id))
      const childResults = await Promise.all(childPromises)
      allCategories.value = []
      childResults.forEach(res => {
        if (res.data) allCategories.value.push(...res.data)
      })
    } catch {
      // ignore
    }
  }

  const fetchList = async () => {
    loading.value = true
    try {
      let categoryIds: number[] | undefined = undefined
      let parentCategoryId: number | undefined = undefined

      if (activeParentId.value === null) {
        // all
      } else if (selectedCategoryId.value === undefined) {
        parentCategoryId = activeParentId.value
      } else {
        categoryIds = [selectedCategoryId.value]
      }

      await studyStore.getStudyList(studyStore.pageNo, studyStore.pageSize, categoryIds, parentCategoryId)
      await fetchInteractionStatus()
    } finally {
      loading.value = false
    }
  }

  const handleParentClick = (parentId: number | null) => {
    activeParentId.value = parentId
    selectedCategoryId.value = undefined
    studyStore.pageNo = 1
    fetchList()
  }

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
    form.categoryIds = []
    form.templateType = 'tech' // 默认技术分析
    dialogVisible.value = true
  }

  const openEditDialog = (item: StudyItem & { templateType?: string }) => {
    isEdit.value = true
    currentId.value = item.id
    form.title = item.title
    form.description = item.description
    form.advantage = item.advantage
    form.disadvantage = item.disadvantage
    form.categoryIds = item.categories?.map(c => c.id) || []
    form.templateType = item.templateType || 'tech'
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
    /* 保持不变 */
  }
  const handleLike = async (item: StudyItem) => {
    /* 保持不变 */
  }
  const handleFavorite = async (item: StudyItem) => {
    /* 保持不变 */
  }
  const goToDetail = async (id: number) => {
    /* 保持不变 */
  }
  const openCommentDrawer = (id: number) => {
    /* 保持不变 */
  }
  const showViewCount = async (item: StudyItem) => {
    /* 保持不变 */
  }

  onMounted(async () => {
    await fetchCategories()
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
