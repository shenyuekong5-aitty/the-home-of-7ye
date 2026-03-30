<template>
  <div class="book-container">
    <!-- 页面标题 + 权限操作区 -->
    <div class="book-header">
      <div class="book-title">我阅读过的书籍</div>
      <div class="book-operate">
        <!-- 管理员：新增书籍按钮 -->
        <el-button
          v-if="userRole === 'admin'"
          type="primary"
          icon="el-icon-plus"
          class="comic-btn add-btn"
          @click="openAddDialog"
        >
          新增书籍
        </el-button>
        <!-- 朋友：推荐书籍按钮 -->
        <el-button
          v-if="userRole === 'friend'"
          type="success"
          icon="el-icon-star"
          class="comic-btn recommend-btn"
          @click="recommendBook"
        >
          推荐书籍
        </el-button>
      </div>
    </div>

    <!-- 书籍卡片列表 -->
    <div class="book-list">
      <div v-for="book in bookList" :key="book.id" class="book-col">
        <el-card class="book-card">
          <!-- 书籍封面 -->
          <div class="book-cover">
            <img
              :src="book.cover"
              :alt="book.bookName"
              @load="e => handleImageLoad(e, book)"
              :style="{
                width: book.imgWidth + 'px',
                height: book.imgHeight + 'px'
              }"
            />
          </div>
          <!-- 书籍信息 -->
          <div class="book-info">
            <div class="book-name">{{ book.bookName }}</div>
            <div class="book-author">作者：{{ book.author }}</div>
            <div class="book-brief">{{ book.brief }}</div>
          </div>
          <!-- 操作按钮区（按权限显示） -->
          <div class="book-action">
            <!-- 管理员：编辑/删除 -->
            <el-button
              v-if="userRole === 'admin'"
              size="small"
              type="warning"
              icon="el-icon-edit"
              class="comic-btn mini-btn"
              @click="openEditDialog(book)"
            >
              编辑
            </el-button>
            <el-button
              v-if="userRole === 'admin'"
              size="small"
              type="danger"
              icon="el-icon-delete"
              class="comic-btn mini-btn"
              @click="deleteBook(book.id)"
            >
              删除
            </el-button>
            <!-- 朋友：推荐（单本书） -->
            <el-button
              v-if="userRole === 'friend'"
              size="small"
              type="success"
              icon="el-icon-star-off"
              class="comic-btn mini-btn"
              @click="recommendSingleBook(book)"
            >
              推荐这本
            </el-button>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 新增/编辑书籍弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑书籍' : '新增书籍'" width="500px" class="comic-dialog">
      <el-form ref="bookFormRef" :model="bookForm" :rules="bookRules" label-width="80px" class="book-form">
        <el-form-item label="书籍名称" prop="bookName">
          <el-input v-model="bookForm.bookName" class="comic-input" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="bookForm.author" class="comic-input" />
        </el-form-item>
        <el-form-item label="书籍简介" prop="brief">
          <el-input v-model="bookForm.brief" type="textarea" :rows="3" class="comic-input" />
        </el-form-item>
        <el-form-item label="封面地址" prop="cover">
          <el-input v-model="bookForm.cover" placeholder="输入封面图片路径" class="comic-input" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button class="comic-btn cancel-btn" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" class="comic-btn confirm-btn" @click="submitBookForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { calculateImageSize } from '@/utils/calculateImageSize'
  import { useBookStore } from '@/store/modules/book'

  // ----------------- 类型定义 -----------------
  export interface  BookItem {
    id: number
    bookName: string
    author: string
    brief: string
    cover: string
    imgWidth?: number|undefined // 动态计算后的宽度
    imgHeight?: number|undefined // 动态计算后的高度
  }

  // 仓库
  const bookStore = useBookStore()

  // ----------------- 图片加载处理 -----------------
  const handleImageLoad = (e: Event, book: BookItem) => {
    const img = e.target as HTMLImageElement
    if (!img) return
    // 目标最大尺寸：宽120，高160
    const { width, height } = calculateImageSize(img.naturalWidth, img.naturalHeight, 120, 160)
    book.imgWidth = width
    book.imgHeight = height
  }

  // ----------------- 响应式数据 -----------------
  // 模拟用户角色（实际可从接口/登录态获取）
  const userRole = ref<string>('admin')

  // 书籍列表数据
  let bookList = ref<BookItem[]>([])

  // 新增/编辑弹窗相关
  const dialogVisible = ref<boolean>(false)
  const isEdit = ref<boolean>(false)
  const bookFormRef = ref<FormInstance>()

  // 表单验证规则
  const bookRules = reactive<FormRules>({
    bookName: [{ required: true, message: '请输入书籍名称', trigger: 'blur' }],
    author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
    brief: [{ required: true, message: '请输入书籍简介', trigger: 'blur' }]
  })

  // 表单数据（用于新增/编辑）
  const bookForm = reactive<BookItem>({
    id: 0,
    bookName: '',
    author: '',
    brief: '',
    cover: './assets/images/books/default.png'
  })

  // ----------------- API 模拟 -----------------
  const getBookList = async () => {
    try {
      // 实际项目替换为真实接口请求
      await bookStore.getBooks()
      bookList.value=bookStore.bookList
    } catch (err: unknown) {
      // 接口失败时使用本地Mock数据兜底
      const mockBooks: BookItem[] = [
        {
          id: 1,
          bookName: '平凡的世界',
          author: '路遥',
          brief: '全景式地展现中国当代城乡社会生活的长篇小说',
          cover: './assets/images/books/book1.png'
        },
        {
          id: 2,
          bookName: '小巷人家',
          author: '大米',
          brief: '以苏州小巷为背景，讲述普通人家的烟火人生',
          cover: './assets/images/books/book2.png'
        },
        {
          id: 3,
          bookName: '三体',
          author: '刘慈欣',
          brief: '中国科幻文学的里程碑之作',
          cover: './assets/images/books/book3.png'
        },
        {
          id: 4,
          bookName: '云边有个小卖铺',
          author: '张嘉佳',
          brief: '关于思念、成长和告别的温暖故事',
          cover: './assets/images/books/book4.png'
        },
        {
          id: 5,
          bookName: '嫌疑人X的献身',
          author: '东野圭吾',
          brief: '极致的推理与极致的爱情',
          cover: './assets/images/books/book5.png'
        }
      ]
      bookList.value = mockBooks
      const errorMsg = err instanceof Error ? err.message : '网络请求失败'
      ElMessage.warning(`接口请求失败，已加载本地Mock数据: ${errorMsg}`)
    }
  }

  // ----------------- 业务方法 -----------------
  const openAddDialog = () => {
    isEdit.value = false
    // 重置表单
    bookForm.id = 0
    bookForm.bookName = ''
    bookForm.author = ''
    bookForm.brief = ''
    bookForm.cover = './assets/images/books/default.png'
    dialogVisible.value = true
  }

  const openEditDialog = (book: BookItem) => {
    isEdit.value = true
    // 赋值表单
    bookForm.id = book.id
    bookForm.bookName = book.bookName
    bookForm.author = book.author
    bookForm.brief = book.brief
    bookForm.cover = book.cover
    dialogVisible.value = true
  }

  const submitBookForm = async () => {
    if (!bookFormRef.value) return
    try {
      await bookFormRef.value.validate()
      if (isEdit.value) {
        // 编辑逻辑：更新列表中对应书籍
        const index = bookList.value.findIndex(item => item.id === bookForm.id)
        if (index > -1) {
          // 保留原有的 imgWidth/imgHeight，避免覆盖
          const existing = bookList.value[index]
          bookList.value[index] = {
            ...bookForm,
            imgWidth: existing?.imgWidth,
            imgHeight: existing?.imgHeight
          }
        }
        ElMessage.success('书籍编辑成功')
      } else {
        // 新增逻辑：生成唯一ID（实际接口由后端生成）
        const maxId = Math.max(0, ...bookList.value.map(item => item.id))
        const newId = maxId + 1
        const newBook: BookItem = { ...bookForm, id: newId }
        bookList.value.push(newBook)
        ElMessage.success('书籍新增成功')
      }
      dialogVisible.value = false
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : '表单填写有误，请检查'
      ElMessage.error(errorMsg)
    }
  }

  const deleteBook = (id: number) => {
    ElMessageBox.confirm('确定要删除这本书籍吗？', '删除确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'comic-message-box'
    })
      .then(() => {
        // 删除逻辑：从列表中移除
        bookList.value = bookList.value.filter(item => item.id !== id)
        ElMessage.success('书籍删除成功')
      })
      .catch((err: unknown) => {
        const errorMsg = err instanceof Error ? err.message : '已取消删除'
        ElMessage.info(errorMsg)
      })
  }

  // 朋友权限：批量推荐书籍
  const recommendBook = () => {
    ElMessage.success('已为你推荐3本优质书籍！')
    // 实际可添加推荐逻辑：比如筛选热门书籍展示
  }

  // 朋友权限：推荐单本书籍
  const recommendSingleBook = (book: BookItem) => {
    ElMessage.success(`已推荐《${book.bookName}》给好友！`)
  }

  // 初始化
  onMounted(() => {
    getBookList()
  })
</script>

<style scoped>
  .book-container {
    padding: 20px;
    background-color: #f8f8f8; /* 极简底色，贴合漫画风格 */
    min-height: 100vh;
  }

  /* 标题 + 操作区 */
  .book-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .book-title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }

  .book-operate {
    display: flex;
    gap: 10px;
    justify-content: center; /* 操作区按钮整体居中 */
    flex: 1; /* 占满剩余宽度，确保居中效果 */
  }

  /* 漫画风格按钮通用样式 */
  .comic-btn {
    border: 2px solid #000 !important;
    border-radius: 0 !important; /* 漫画风直角按钮 */
    box-shadow: 3px 3px 0 #000 !important;
    transition: all 0.2s ease !important;
    background-color: #fff !important;
    color: #000 !important;
    /* 核心：按钮内部文本/图标垂直+水平居中 */
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    line-height: 1 !important; /* 重置行高，避免错位 */
  }

  /* 按钮图标与文本间距（优化视觉） */
  .comic-btn .el-icon {
    margin-right: 4px !important;
  }

  .comic-btn:hover {
    transform: translate(-2px, -2px) !important;
    box-shadow: 5px 5px 0 #000 !important;
  }

  .add-btn {
    background-color: #409eff !important;
    color: #fff !important;
  }

  .recommend-btn {
    background-color: #67c23a !important;
    color: #fff !important;
  }

  /* 迷你按钮样式（核心修复：删除多余右外边距，避免按钮偏移） */
  .mini-btn {
    padding: 4px 12px !important; /* 调整左右内边距，留出文本空间 */
    min-width: 60px !important; /* 固定最小宽度，避免文本挤压 */
    /* 删掉原来的 margin-right: 5px; 这个是导致第二个按钮靠右的关键 */
  }

  .cancel-btn {
    background-color: #909399 !important;
    color: #fff !important;
  }

  .confirm-btn {
    background-color: #409eff !important;
    color: #fff !important;
  }

  /* 书籍卡片列表 - 使用CSS Grid布局 */
  .book-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
  }

  .book-col {
    /* 不再需要margin-bottom，因为gap已经处理了间距 */
  }

  .book-card {
    border: 2px solid #000; /* 漫画粗黑边框 */
    border-radius: 4px;
    box-shadow: 4px 4px 0 #000; /* 手绘阴影 */
    transition: all 0.3s ease;
    background-color: #fff;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%; /* 确保卡片填满网格单元高度 */
  }

  .book-card:hover {
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 #000;
  }

  .book-cover {
    width: 100%;
    height: 180px;
    overflow: hidden;
    border-bottom: 1px solid #eee;
    flex-shrink: 0; /* 防止封面被压缩 */
  }

  .book-cover img {
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .book-card:hover .book-cover img {
    transform: scale(1.05);
  }

  .book-info {
    padding: 15px;
    flex-grow: 1; /* 让信息区域占据剩余空间 */
    display: flex;
    flex-direction: column;
  }

  .book-name {
    font-size: 16px;
    font-weight: bold;
    color: #000;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .book-author {
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
  }

  .book-brief {
    font-size: 11px;
    color: #333;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex-grow: 1; /* 让简介区域占据剩余空间 */
  }

  /* 卡片操作区（核心修复：让编辑/删除按钮整体居中） */
  .book-action {
    padding: 0 15px 15px;
    display: flex;
    gap: 12px; /* 调整按钮间距，更均匀 */
    justify-content: center; /* 强制两个按钮在容器内水平居中 */
    align-items: center; /* 垂直居中 */
    flex-shrink: 0; /* 防止操作区被压缩 */
  }

  /* 弹窗样式适配漫画风 */
  .comic-dialog {
    --el-dialog-border-color: #000 !important;
    --el-dialog-border-width: 2px !important;
    --el-dialog-border-radius: 0 !important;
  }

  .book-form {
    padding: 10px 0;
  }

  .comic-input {
    border: 2px solid #000 !important;
    border-radius: 0 !important;
  }

  /* 确认框漫画风格 */
  .comic-message-box {
    --el-message-box-border-color: #000 !important;
    --el-message-box-border-width: 2px !important;
    --el-message-box-border-radius: 0 !important;
  }
</style>
