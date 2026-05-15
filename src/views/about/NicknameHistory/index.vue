<template>
  <el-card class="manga-card">
    <template #header>
      <div class="manga-header">
        <div class="manga-title">
          影之名册
          <small>NICKNAMES</small>
        </div>
        <el-input v-model="keyword" placeholder="搜索档案..." class="manga-search" @input="handleSearch" clearable>
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>
    </template>

    <div class="manga-container">
      <div v-permission="'admin'" class="name-tag add-entry" @click="openDialog(false)">
        <el-icon><Plus /></el-icon>
        <span>追加新名</span>
      </div>

      <div v-for="(name, index) in nicknameList" :key="index" class="tag-wrapper">
        <div class="name-tag" @click="openDialog(true, name)">
          <span class="text">{{ name }}</span>
          <el-icon v-permission="'admin'" class="delete-btn" @click.stop="confirmDelete(name)"><Close /></el-icon>
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
      <el-input v-model="tempName" placeholder="输入名号..." class="manga-input" @keyup.enter="submitSave" />
      <template #footer>
        <div class="manga-footer">
          <button class="action-btn" @click="dialogVisible = false">取消</button>
          <button class="action-btn primary" @click="submitSave">确认执行</button>
        </div>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  import { Search, Plus, Close } from '@element-plus/icons-vue'
  import { useNicknameStore } from '@/store/modules/nickname'
  import { useUserStore } from '@/store/modules/user' //  引入用户 Store
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { debounce } from '@/utils/debounce'

  const nicknameStore = useNicknameStore()
  const userStore = useUserStore() //  获取用户实例

  const nicknameList = ref<string[]>([])
  const keyword = ref('')

  // 计算是否为管理员
  const isAdmin = computed(() => userStore.userInfo.role === 'admin')

  const dialogVisible = ref(false)
  const isEdit = ref(false)
  const tempName = ref('')
  const oldNameRef = ref('')

  const fetchList = async () => {
    const res = await nicknameStore.getHistoryNicknames(keyword.value)
    nicknameList.value = res
  }

  const handleSearch = debounce(() => fetchList(), 300)

  const openDialog = (editMode: boolean, name = '') => {
    //  非管理员禁止打开编辑/新增弹窗
    if (!isAdmin.value) {
      ElMessage.warning('只有管理员可以修改名册')
      return
    }
    isEdit.value = editMode
    tempName.value = name
    oldNameRef.value = name
    dialogVisible.value = true
  }

  const submitSave = async () => {
    if (!tempName.value.trim()) return ElMessage.warning('名号不可为空！')

    try {
      if (isEdit.value) {
        await nicknameStore.updateNickname(oldNameRef.value, tempName.value)
      } else {
        await nicknameStore.addNickname(tempName.value)
      }
      // 无异常即成功
      ElMessage.success('名册已更新')
      dialogVisible.value = false
      fetchList()
    } catch (error: any) {
      // 异常时提取 Store 方法抛出的 message
      const msg = error.message || '操作失败'
      ElMessage.error(msg)
    }
  }
  const confirmDelete = async (name: string) => {
    //  非管理员禁止删除
    if (!isAdmin.value) {
      ElMessage.warning('只有管理员可以删除名册')
      return
    }
    try {
      await ElMessageBox.confirm(`即将抹除「${name}」，此操作不可逆！`, '警告', {
        confirmButtonText: '抹除',
        cancelButtonText: '保留',
        customClass: 'manga-msgbox'
      })
      const res = await nicknameStore.removeNickname(name)
      if (res === 'ok') fetchList()
    } catch {
      // 用户取消删除
    }
  }

  onMounted(() => fetchList())
</script>

<style scoped lang="scss">
  // 1. 基础卡片重塑
  .manga-card {
    background: #fff;
    border: 3px solid #000 !important;
    border-radius: 0 !important;
    box-shadow: 6px 6px 0 #000 !important;

    :deep(.el-card__header) {
      padding: 12px;
      background-image: radial-gradient(#ddd 1px, transparent 1px);
      background-size: 10px 10px; // 网点背景
      border-bottom: 3px solid #000;
    }
  }

  .manga-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .manga-title {
      font-size: 18px;
      font-weight: 900;
      color: #000;

      small {
        display: block;
        font-size: 10px;
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
    font-weight: 700;
    cursor: pointer;
    background: #fff;
    border: 2px solid #000;
    transition: all 0.1s;

    &:hover {
      color: #fff;
      background: #000;
      box-shadow: 4px 4px 0 #ff4d4f; // 红色偏阴影
      transform: translate(-2px, -2px);

      .delete-btn {
        display: block;
      }
    }

    &.add-entry {
      display: flex;
      gap: 5px;
      align-items: center;
      color: #999;
      border-style: dashed;
    }
  }

  .delete-btn {
    position: absolute;
    top: -8px;
    right: -8px;
    display: none;
    font-size: 10px;
    color: #fff;
    background: #ff4d4f;
    border: 2px solid #000;
    border-radius: 50%;
  }

  // 4. 漫画按钮与输入框
  .action-btn {
    padding: 6px 15px;
    margin-left: 10px;
    font-weight: 900;
    cursor: pointer;
    background: #fff;
    border: 2px solid #000;
    box-shadow: 3px 3px 0 #000;

    &:active {
      box-shadow: 0 0 0 #000;
      transform: translate(2px, 2px);
    }

    &.primary {
      color: #fff;
      background: #000;
    }
  }

  // 5. 弹窗样式重写 (Global override or via custom-class)
  :deep(.manga-dialog) {
    border: 4px solid #000;
    border-radius: 0;
    box-shadow: 10px 10px 0 rgb(0 0 0 / 20%);

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
