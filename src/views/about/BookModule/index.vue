<template>
  <div class="book-container">
    <div class="book-header">
      <div class="book-title">阅读过的书籍 || 推荐阅读的书籍</div>
      <div class="book-operate">
        <el-button v-if="isAdmin" type="primary" icon="el-icon-plus" class="comic-btn add-btn" @click="openAddDialog">
          新增书籍
        </el-button>
        <el-button type="info" icon="el-icon-view" class="comic-btn view-recommend-btn" @click="openApprovedDialog">
          查看已收录推荐
        </el-button>
        <el-button
          v-if="isFriend"
          type="success"
          icon="el-icon-star"
          class="comic-btn recommend-btn"
          @click="openRecommendDialog"
        >
          推荐书籍
        </el-button>
      </div>
    </div>

    <div class="book-list">
      <div v-for="book in bookList" :key="book.id" class="book-col">
        <el-card class="book-card">
          <div class="book-cover">
            <img
              :src="book.cover"
              :alt="book.bookName"
              @load="e => handleImageLoad(e, book)"
              :style="{ width: book.imgWidth + 'px', height: book.imgHeight + 'px' }"
            />
          </div>
          <div class="book-info">
            <div class="book-name">{{ book.bookName }}</div>
            <div class="book-author">作者：{{ book.author }}</div>
            <div class="book-brief">{{ book.brief }}</div>
          </div>
          <div class="book-action">
            <el-button
              v-if="isAdmin"
              size="small"
              type="warning"
              icon="el-icon-edit"
              class="comic-btn mini-btn"
              @click="openEditDialog(book)"
            >
              编辑
            </el-button>
            <el-button
              v-if="isAdmin"
              size="small"
              type="danger"
              icon="el-icon-delete"
              class="comic-btn mini-btn"
              @click="deleteBook(book.id)"
            >
              删除
            </el-button>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 新增/编辑书籍弹窗（管理员） -->
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
        <el-form-item label="封面" prop="cover" class="cover-form-item">
          <div class="cover-upload-wrapper">
            <div class="cover-preview-container">
              <el-upload
                v-if="bookForm.cover"
                class="cover-preview-upload"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleAdminCoverChange"
                accept="image/*"
              >
                <div class="cover-preview clickable">
                  <img :src="bookForm.cover" alt="封面预览" />
                </div>
              </el-upload>
              <el-icon v-if="bookForm.cover" class="remove-cover" @click="removeAdminCover">
                <CircleClose />
              </el-icon>
              <el-upload
                v-else
                class="cover-upload-btn"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :on-change="handleAdminCoverChange"
                accept="image/*"
              >
                <el-button size="small" type="primary" plain>选择本地图片</el-button>
              </el-upload>
            </div>
            <p class="upload-tip">点击预览图或按钮上传，支持本地图片</p>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button class="comic-btn cancel-btn" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" class="comic-btn confirm-btn" @click="submitBookForm">确认</el-button>
      </template>
    </el-dialog>

    <!-- 推荐新书弹窗 -->
    <el-dialog v-model="recommendDialogVisible" title="推荐新书" width="500px" class="comic-dialog">
      <el-form :model="recommendForm" label-width="80px" class="book-form">
        <el-form-item label="书籍名称" required>
          <el-input v-model="recommendForm.bookName" placeholder="请输入书名" class="comic-input" />
        </el-form-item>
        <el-form-item label="作者" required>
          <el-input v-model="recommendForm.author" placeholder="请输入作者" class="comic-input" />
        </el-form-item>
        <el-form-item label="书籍简介" required>
          <el-input
            v-model="recommendForm.brief"
            type="textarea"
            :rows="3"
            placeholder="请输入简介"
            class="comic-input"
          />
        </el-form-item>
        <el-form-item label="封面">
          <el-input v-model="recommendForm.cover" placeholder="输入图片URL或点击上传" class="comic-input" />
          <div class="cover-preview" v-if="recommendForm.cover">
            <img :src="recommendForm.cover" alt="封面预览" />
          </div>
          <el-upload
            class="cover-upload"
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleCoverChange"
            accept="image/*"
          >
            <el-button size="small" type="primary" plain>选择本地图片</el-button>
          </el-upload>
          <p class="upload-tip">支持输入网络图片地址或选择本地图片（将转为Base64预览）</p>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button class="comic-btn cancel-btn" @click="recommendDialogVisible = false">取消</el-button>
        <el-button type="primary" class="comic-btn confirm-btn" @click="submitRecommend">提交推荐</el-button>
      </template>
    </el-dialog>

    <!-- 已推荐书籍查看弹窗 -->
    <el-dialog v-model="approvedDialogVisible" title="已收录的推荐书籍" width="800px" class="comic-dialog">
      <el-table :data="recommendationList" style="width: 100%" v-loading="loading">
        <el-table-column prop="content.bookName" label="书名" width="150" />
        <el-table-column prop="content.author" label="作者" width="120" />
        <el-table-column label="封面" width="80">
          <template #default="{ row }">
            <img :src="row.content.cover" style="width: 40px; height: 50px; object-fit: cover" />
          </template>
        </el-table-column>
        <el-table-column prop="proposerName" label="推荐人" width="100" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'approved' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'">
              {{ row.status === 'approved' ? '已通过' : row.status === 'pending' ? '待审核' : '已拒绝' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="提交时间" width="160" />
        <template #empty>
          <div style="text-align: center; padding: 20px">暂无已收录的推荐书籍</div>
        </template>
      </el-table>
      <template #footer>
        <el-button class="comic-btn cancel-btn" @click="approvedDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { CircleClose } from '@element-plus/icons-vue'
  import { ref, onMounted, reactive, computed } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { calculateImageSize } from '@/utils/calculateImageSize'
  import { useBookStore } from '@/store/modules/book'
  import { useUserStore } from '@/store/modules/user'
  import { useRecommendationStore } from '@/store/modules/recommendation'

  export interface BookItem {
    id: number
    bookName: string
    author: string
    brief: string
    cover: string
    imgWidth?: number
    imgHeight?: number
  }

  const bookStore = useBookStore()
  const userStore = useUserStore()
  const recommendationStore = useRecommendationStore()

  const isAdmin = computed(() => userStore.userInfo.roles?.includes('admin'))
  const isFriend = computed(() => userStore.userInfo.roles?.includes('friend'))

  const handleImageLoad = (e: Event, book: BookItem) => {
    const img = e.target as HTMLImageElement
    if (!img) return
    const { width, height } = calculateImageSize(img.naturalWidth, img.naturalHeight, 120, 160)
    book.imgWidth = width
    book.imgHeight = height
  }

  const bookList = ref<BookItem[]>([])
  const recommendationList = ref<any[]>([])
  const loading = ref(false)

  const dialogVisible = ref(false)
  const approvedDialogVisible = ref(false)
  const isEdit = ref(false)
  const bookFormRef = ref<FormInstance>()
  const bookRules: FormRules = {
    bookName: [{ required: true, message: '请输入书籍名称', trigger: 'blur' }],
    author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
    brief: [{ required: true, message: '请输入书籍简介', trigger: 'blur' }]
  }
  const bookForm = reactive<BookItem>({
    id: 0,
    bookName: '',
    author: '',
    brief: '',
    cover: './assets/images/books/default.png'
  })

  const recommendDialogVisible = ref(false)
  const recommendForm = reactive({
    bookName: '',
    author: '',
    brief: '',
    cover: ''
  })

  const getBookList = async () => {
    try {
      await bookStore.getBooks()
      bookList.value = bookStore.bookList
    } catch {
      ElMessage.error('加载书籍列表失败')
    }
  }

  const openAddDialog = () => {
    isEdit.value = false
    bookForm.id = 0
    bookForm.bookName = ''
    bookForm.author = ''
    bookForm.brief = ''
    bookForm.cover = './assets/images/books/default.png'
    dialogVisible.value = true
  }

  const openEditDialog = (book: BookItem) => {
    isEdit.value = true
    bookForm.id = book.id
    bookForm.bookName = book.bookName
    bookForm.author = book.author
    bookForm.brief = book.brief
    bookForm.cover = book.cover
    dialogVisible.value = true
  }

  const submitBookForm = async () => {
    if (!bookFormRef.value) return
    await bookFormRef.value.validate(async valid => {
      if (!valid) return
      try {
        if (isEdit.value) {
          await bookStore.updateBook(bookForm)
          ElMessage.success('书籍编辑成功')
        } else {
          await bookStore.addBook(bookForm)
          ElMessage.success('书籍新增成功')
        }
        dialogVisible.value = false
        getBookList()
      } catch (err: any) {
        ElMessage.error(err?.message || '操作失败')
      }
    })
  }

  const deleteBook = (id: number) => {
    ElMessageBox.confirm('确定要删除这本书籍吗？', '删除确认', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'comic-message-box'
    })
      .then(async () => {
        await bookStore.deleteBook(id)
        ElMessage.success('书籍删除成功')
        getBookList()
      })
      .catch(() => {})
  }

  const openRecommendDialog = () => {
    recommendForm.bookName = ''
    recommendForm.author = ''
    recommendForm.brief = ''
    recommendForm.cover = ''
    recommendDialogVisible.value = true
  }

  const handleCoverChange = (file: any) => {
    const reader = new FileReader()
    reader.onload = e => {
      recommendForm.cover = e.target?.result as string
    }
    reader.readAsDataURL(file.raw)
  }

  const handleAdminCoverChange = (file: any) => {
    const reader = new FileReader()
    reader.onload = e => {
      bookForm.cover = e.target?.result as string
    }
    reader.readAsDataURL(file.raw)
  }

  const submitRecommend = async () => {
    if (!recommendForm.bookName || !recommendForm.author || !recommendForm.brief) {
      ElMessage.warning('请填写完整的书籍信息')
      return
    }
    try {
      await bookStore.recommendBook(recommendForm)
      ElMessage.success('推荐成功！待管理员审核后即可展示')
      recommendDialogVisible.value = false
    } catch (err: any) {
      ElMessage.error(err?.message || '推荐失败')
    }
  }

  const removeAdminCover = () => {
    bookForm.cover = ''
  }

  const openApprovedDialog = async () => {
    loading.value = true
    try {
      const allList = await recommendationStore.fetchList() // 获取所有推荐
      // 只保留书籍类型的推荐
      recommendationList.value = allList.filter(item => item.type === 'book')
      approvedDialogVisible.value = true
    } catch (err: any) {
      ElMessage.error(err.message || '加载推荐列表失败')
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    getBookList()
  })
</script>

<style scoped>
  .book-container {
    padding: 20px;
    background-color: #f8f8f8;
    min-height: 100vh;
  }
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
    justify-content: flex-end;
    flex: 1;
  }
  .comic-btn {
    border: 2px solid #000 !important;
    border-radius: 0 !important;
    box-shadow: 3px 3px 0 #000 !important;
    transition: all 0.2s ease !important;
    background-color: #fff !important;
    color: #000 !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    line-height: 1 !important;
  }
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
  .view-recommend-btn {
    background-color: #e67e22 !important;
    color: #fff !important;
  }
  .view-recommend-btn:hover {
    background-color: #d35400 !important;
  }
  .mini-btn {
    padding: 4px 12px !important;
    min-width: 60px !important;
  }
  .cancel-btn {
    background-color: #909399 !important;
    color: #fff !important;
  }
  .confirm-btn {
    background-color: #409eff !important;
    color: #fff !important;
  }
  .book-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
  }
  .book-card {
    border: 2px solid #000;
    border-radius: 4px;
    box-shadow: 4px 4px 0 #000;
    transition: all 0.3s ease;
    background-color: #fff;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 100%;
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
    flex-shrink: 0;
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
    flex-grow: 1;
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .book-brief {
    font-size: 11px;
    color: #333;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex-grow: 1;
  }
  .book-action {
    padding: 0 15px 15px;
    display: flex;
    gap: 12px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
  }
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
  .comic-message-box {
    --el-message-box-border-color: #000 !important;
    --el-message-box-border-width: 2px !important;
    --el-message-box-border-radius: 0 !important;
  }

  /* 封面相关样式 */
  .cover-upload-wrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }
  .cover-preview-container {
    position: relative;
    display: inline-block;
  }
  .cover-preview {
    cursor: pointer;
    border: 2px dashed #ccc;
    padding: 4px;
    border-radius: 4px;
    transition: border-color 0.2s;
  }
  .cover-preview:hover {
    border-color: var(--el-color-primary);
  }
  .cover-preview img {
    max-width: 150px;
    max-height: 150px;
    display: block;
  }
  .remove-cover {
    position: absolute;
    top: -8px;
    right: -8px;
    background: #ff4d4f;
    color: #fff;
    border-radius: 50%;
    font-size: 18px;
    cursor: pointer;
    border: 2px solid #000;
    z-index: 3;
  }
  .remove-cover:hover {
    background: #ff7875;
  }
  .cover-upload-btn {
    display: inline-block;
  }
  .upload-tip {
    font-size: 12px;
    color: #999;
    margin-left: 5px;
  }
</style>
