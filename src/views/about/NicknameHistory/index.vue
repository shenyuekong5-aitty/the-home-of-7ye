<template>
  <el-card class="manga-card">
    <template #header>
      <div class="manga-header">
        <div class="manga-title">影之名册 <small>NICKNAMES</small></div>
        <el-input
          v-model="keyword"
          placeholder="搜索档案..."
          class="manga-search"
          @input="handleSearch"
          clearable
        >
          <template #prefix
            ><el-icon><Search /></el-icon
          ></template>
        </el-input>
      </div>
    </template>

    <div class="manga-container">
      <div class="name-tag add-entry" @click="openDialog(false)">
        <el-icon><Plus /></el-icon> <span>追加新名</span>
      </div>

      <div
        v-for="(name, index) in nicknameList"
        :key="index"
        class="tag-wrapper"
      >
        <div class="name-tag" @click="openDialog(true, name)">
          <span class="text">{{ name }}</span>
          <el-icon class="delete-btn" @click.stop="confirmDelete(name)"
            ><Close
          /></el-icon>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '【 修正名号 】' : '【 录入新名 】'"
      width="320px"
      custom-class="manga-dialog"
      :show-close="false"
    >
      <el-input
        v-model="tempName"
        placeholder="输入名号..."
        class="manga-input"
        @keyup.enter="submitSave"
      />
      <template #footer>
        <div class="manga-footer">
          <button class="action-btn" @click="dialogVisible = false">
            取消
          </button>
          <button class="action-btn primary" @click="submitSave">
            确认执行
          </button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search, Plus, Close } from '@element-plus/icons-vue'
import { useUserStore } from '@/store/modules/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const userStore = useUserStore()
const nicknameList = ref<string[]>([])
const keyword = ref('')

// 弹窗状态
const dialogVisible = ref(false)
const isEdit = ref(false)
const tempName = ref('')
const oldNameRef = ref('')

// --- 逻辑处理 ---

const fetchList = async () => {
  const res = await userStore.getHistoryNicknames(keyword.value)
  nicknameList.value = res
}

const handleSearch = () => fetchList() // 也可以加个防抖

const openDialog = (editMode: boolean, name = '') => {
  isEdit.value = editMode
  tempName.value = name
  oldNameRef.value = name
  dialogVisible.value = true
}

const submitSave = async () => {
  if (!tempName.value.trim()) return ElMessage.warning('名号不可为空！')

  let res
  if (isEdit.value) {
    res = await userStore.updateNickname(oldNameRef.value, tempName.value)
  } else {
    res = await userStore.addNickname(tempName.value)
  }

  if (res === 'ok') {
    ElMessage.success('名册已更新')
    dialogVisible.value = false
    fetchList()
  } else {
    ElMessage.error(res)
  }
}

const confirmDelete = async (name: string) => {
  try {
    await ElMessageBox.confirm(`即将抹除「${name}」，此操作不可逆！`, '警告', {
      confirmButtonText: '抹除',
      cancelButtonText: '保留',
      customClass: 'manga-msgbox'
    })
    const res = await userStore.removeNickname(name)
    if (res === 'ok') fetchList()
  } catch {
    ElMessage.error('操作失败！')
  }
}

onMounted(() => fetchList())
</script>

<style scoped lang="scss">
// 1. 基础卡片重塑
.manga-card {
  border: 3px solid #000 !important;
  border-radius: 0 !important;
  box-shadow: 6px 6px 0 #000 !important;
  background: #fff;

  :deep(.el-card__header) {
    border-bottom: 3px solid #000;
    padding: 12px;
    background-image: radial-gradient(#ddd 1px, transparent 1px);
    background-size: 10px 10px; // 网点背景
  }
}

.manga-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .manga-title {
    font-weight: 900;
    font-size: 18px;
    color: #000;
    small {
      font-size: 10px;
      display: block;
      line-height: 1;
    }
  }
}

// 2. 漫画搜索框
.manga-search {
  width: 140px;
  :deep(.el-input__wrapper) {
    border: 2px solid #000;
    border-radius: 0;
    box-shadow: none !important;
    &.is-focus {
      border-color: #ff4d4f;
    }
  }
}

// 3. 标签容器
.manga-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 10px 0;
}

.name-tag {
  position: relative;
  padding: 6px 16px;
  background: #fff;
  border: 2px solid #000;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.1s;

  &:hover {
    background: #000;
    color: #fff;
    transform: translate(-2px, -2px);
    box-shadow: 4px 4px 0 #ff4d4f; // 红色偏阴影

    .delete-btn {
      display: block;
    }
  }

  &.add-entry {
    border-style: dashed;
    color: #999;
    display: flex;
    align-items: center;
    gap: 5px;
  }
}

.delete-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ff4d4f;
  color: #fff;
  border: 2px solid #000;
  border-radius: 50%;
  font-size: 10px;
  display: none;
}

// 4. 漫画按钮与输入框
.action-btn {
  border: 2px solid #000;
  background: #fff;
  padding: 6px 15px;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 3px 3px 0 #000;
  margin-left: 10px;

  &:active {
    transform: translate(2px, 2px);
    box-shadow: 0 0 0 #000;
  }

  &.primary {
    background: #000;
    color: #fff;
  }
}

// 5. 弹窗样式重写 (Global override or via custom-class)
:deep(.manga-dialog) {
  border: 4px solid #000;
  border-radius: 0;
  box-shadow: 10px 10px 0 rgba(0, 0, 0, 0.2);
  .el-dialog__header {
    display: none;
  } // 隐藏自带头
  .el-dialog__body {
    padding: 30px 20px 10px;
  }
}

.manga-input :deep(.el-input__wrapper) {
  border: 2px solid #000;
  border-radius: 0;
  box-shadow: none !important;
}
</style>
