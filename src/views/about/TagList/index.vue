<template>
  <div class="tag-page">
    <header class="tag-header">
      <div class="header-left">
        <h2 class="title">心理画像</h2>
        <p class="subtitle">用标签拼凑真实的自我 🧩</p>
      </div>

      <div class="header-right">
        <el-input
          v-model="searchQuery"
          placeholder="搜索标签..."
          class="search-input"
          prefix-icon="Search"
          size="small"
          clearable
        />
        <!-- 管理员操作按钮组 -->
        <template v-if="isAdmin">
          <el-button type="primary" size="small" @click="openAddDialog">新增</el-button>
          <el-button size="small" @click="handleExport">导出 Excel</el-button>
          <el-upload
            :show-file-list="false"
            :before-upload="handleBeforeUpload"
            accept=".xlsx,.xls"
            style="display: inline-block; margin-left: 8px"
          >
            <el-button size="small">导入 Excel</el-button>
          </el-upload>
          <el-button size="small" @click="handleDownloadTemplate">下载模板</el-button>
        </template>
      </div>
    </header>

    <main class="tag-container">
      <div class="tag-grid">
        <div v-for="item in filteredTags" :key="item.id" class="tag-sticker">
          <div class="sticker-content">
            <span class="tag-text">{{ item.content }}</span>
            <!-- 管理员操作图标 -->
            <div v-if="isAdmin" class="sticker-admin">
              <el-icon class="admin-icon edit" @click="openEditDialog(item)"><Edit /></el-icon>
              <el-icon class="admin-icon delete" @click="handleDelete(item.id)"><Delete /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="tag-footer">
      <p>“标签只是参考，你才是唯一的答案。”</p>
    </footer>

    <!-- 新增/编辑弹窗（原有） -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="400px">
      <el-input v-model="editContent" placeholder="输入标签内容..." @keyup.enter="handleSave" />
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">确定</el-button>
      </template>
    </el-dialog>

    <!-- 导入结果弹窗 -->
    <el-dialog v-model="importResultVisible" title="导入结果" width="500px">
      <div v-if="importResult">
        <p>总行数：{{ importResult.total }}</p>
        <p>成功：{{ importResult.successCount }} 条</p>
        <p>失败：{{ importResult.failCount }} 条</p>
        <div v-if="importResult.failDetails && importResult.failDetails.length">
          <el-table :data="importResult.failDetails" size="small">
            <el-table-column prop="id" label="原ID" width="80" />
            <el-table-column prop="content" label="内容" show-overflow-tooltip />
            <el-table-column prop="reason" label="失败原因" />
          </el-table>
        </div>
      </div>
      <template #footer>
        <el-button @click="importResultVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { Edit, Delete } from '@element-plus/icons-vue'
  import { useTagStore } from '@/store/modules/tag'
  import { useUserStore } from '@/store/modules/user'
  import type { TagItem } from '@/api/tag/type'

  const tagStore = useTagStore()
  const userStore = useUserStore()

  const isAdmin = computed(() => userStore.userInfo?.role === 'admin')

  // 搜索
  const searchQuery = ref('')
  const filteredTags = computed(() => {
    if (!searchQuery.value) return tagStore.tagList
    return tagStore.tagList.filter(item => item.content.toLowerCase().includes(searchQuery.value.toLowerCase()))
  })

  // 增改弹窗
  const dialogVisible = ref(false)
  const dialogTitle = ref('')
  const editContent = ref('')
  const editingId = ref<number | null>(null)

  const openAddDialog = () => {
    dialogTitle.value = '新增标签'
    editContent.value = ''
    editingId.value = null
    dialogVisible.value = true
  }

  const openEditDialog = (item: TagItem) => {
    dialogTitle.value = '修改标签'
    editContent.value = item.content
    editingId.value = item.id
    dialogVisible.value = true
  }

  const handleSave = async () => {
    if (!editContent.value.trim()) {
      ElMessage.warning('内容不能为空')
      return
    }
    if (editingId.value) {
      await tagStore.updateTag(editingId.value, editContent.value)
    } else {
      await tagStore.addTag(editContent.value)
    }
    dialogVisible.value = false
  }

  const handleDelete = (id: number) => {
    ElMessageBox.confirm('确定要删除这个标签吗？', '警告', { type: 'warning' })
      .then(() => tagStore.deleteTag(id))
      .catch(() => {})
  }

  // ========== Excel 操作 ==========
  const importResultVisible = ref(false)
  const importResult = ref<any>(null)

  // 导出
  const handleExport = () => {
    tagStore.exportExcel()
  }

  // 导入（绑定 el-upload 的 before-upload，阻止默认上传，手动调用 store）
  const handleBeforeUpload = (file: File) => {
    tagStore.importExcel(file).then(result => {
      if (result) {
        importResult.value = result
        importResultVisible.value = true
      }
    })
    return false // 阻止 el-upload 默认上传
  }

  // 下载模板
  const handleDownloadTemplate = () => {
    tagStore.downloadTemplate()
  }

  onMounted(() => {
    tagStore.getTags()
  })
</script>

<style scoped>
  /* 柔和的莫兰迪/奶油色背景 */
  .tag-header .header-right {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .tag-page {
    min-height: 100vh;
    padding: 40px 20px;
    font-family: 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
    background-color: #f7f3f0;
    background-image:
      linear-gradient(90deg, rgb(255 255 255 / 50%) 50%, transparent 50%),
      linear-gradient(rgb(255 255 255 / 50%) 50%, transparent 50%);
    background-size: 30px 30px; /* 类似网格本的底纹 */
  }

  /* 头部样式 */
  .tag-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 900px;
    padding: 0 10px;
    margin: 0 auto 40px;
  }

  .title {
    margin: 0;
    font-size: 24px;
    font-weight: bold;
    color: #8c7851;
  }

  .subtitle {
    margin-top: 5px;
    font-size: 13px;
    color: #a89a7d;
  }

  .header-right {
    display: flex;
    gap: 15px;
  }

  .search-input {
    width: 180px;
  }

  /* 标签贴纸网格 */
  .tag-container {
    max-width: 900px;
    margin: 0 auto;
  }

  .tag-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 25px;
  }

  /* 贴纸单体设计 */
  .tag-sticker {
    position: relative;
    padding: 15px;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 4px;
    box-shadow: 2px 4px 10px rgb(0 0 0 / 5%);
    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);

    /* 模拟贴纸微微翘起的效果 */
  }

  .tag-sticker:hover {
    border-color: #d4a373;
    box-shadow: 5px 8px 15px rgb(140 120 81 / 15%);
    transform: rotate(-2deg) translateY(-5px);
  }

  .sticker-content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80px;
  }

  .tag-text {
    font-size: 16px;
    font-weight: 600;
    color: #5b4d3d;
    text-align: center;
  }

  /* 贴纸内部的管理按钮 */
  .sticker-admin {
    position: absolute;
    top: -5px;
    right: -5px;
    display: flex;
    gap: 5px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .tag-sticker:hover .sticker-admin {
    opacity: 1;
  }

  .admin-icon {
    padding: 4px;
    font-size: 12px;
    cursor: pointer;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 2px 5px rgb(0 0 0 / 10%);
  }

  .admin-icon.edit:hover {
    color: #409eff;
  }

  .admin-icon.delete:hover {
    color: #f56c6c;
  }

  /* 底部 */
  .tag-footer {
    margin-top: 60px;
    font-size: 14px;
    font-style: italic;
    color: #c2b9a7;
    text-align: center;
  }

  .sticker-content {
    position: relative;
  }

  .sticker-admin {
    position: absolute;
    top: -5px;
    right: -5px;
    display: flex;
    gap: 5px;
    opacity: 0;
    transition: opacity 0.2s;
  }

  .tag-sticker:hover .sticker-admin {
    opacity: 1;
  }

  .admin-icon {
    padding: 4px;
    font-size: 12px;
    cursor: pointer;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 50%;
    box-shadow: 0 2px 5px rgb(0 0 0 / 10%);
  }

  .admin-icon.edit:hover {
    color: #409eff;
  }

  .admin-icon.delete:hover {
    color: #f56c6c;
  }
</style>
