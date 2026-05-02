<template>
  <div class="role-container">
    <h2>角色管理</h2>
    <el-button type="primary" @click="openAddDialog">添加角色</el-button>

    <el-table :data="roleStore.roleList" style="margin-top: 20px">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="description" label="描述" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEditDialog(row)">修改</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑角色' : '添加角色'" width="400px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, onMounted } from 'vue' // 导入 onMounted
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useRoleStore } from '@/store/modules/role'
  import { reqAddRole, reqUpdateRole, reqDeleteRole } from '@/api/role'
  import type { RoleItem } from '@/api/role/type'

  const roleStore = useRoleStore()
  const dialogVisible = ref(false)
  const isEdit = ref(false)
  const currentId = ref<number | null>(null)
  const form = reactive({ name: '', description: '' })

  // ✅ 新增：页面挂载时获取角色列表
  onMounted(() => {
    roleStore.fetchRoles()
  })

  // 如果布局使用了 keep-alive 导致 onMounted 不触发，可改用 onActivated
  // import { onActivated } from 'vue'
  // onActivated(() => { roleStore.fetchRoles() })

  const openAddDialog = () => {
    isEdit.value = false
    currentId.value = null
    form.name = ''
    form.description = ''
    dialogVisible.value = true
  }

  const openEditDialog = (row: RoleItem) => {
    isEdit.value = true
    currentId.value = row.id
    form.name = row.name
    form.description = row.description || ''
    dialogVisible.value = true
  }

  const submit = async () => {
    try {
      if (isEdit.value && currentId.value) {
        await reqUpdateRole(currentId.value, form.name, form.description)
        ElMessage.success('修改成功')
      } else {
        await reqAddRole(form.name, form.description)
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
      await roleStore.fetchRoles()
    } catch {
      ElMessage.error('操作失败')
    }
  }

  const handleDelete = (row: RoleItem) => {
    ElMessageBox.confirm(`确定删除角色“${row.name}”吗？如果该角色正在使用，删除将失败。`, '警告', { type: 'warning' })
      .then(async () => {
        try {
          await reqDeleteRole(row.id)
          ElMessage.success('删除成功')
          await roleStore.fetchRoles()
        } catch (err: any) {
          ElMessage.error(err.response?.data?.message || '删除失败，可能角色正在使用中')
        }
      })
      .catch(() => {})
  }
</script>
