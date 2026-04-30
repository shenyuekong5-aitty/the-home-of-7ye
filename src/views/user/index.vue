<template>
  <div class="user-role-container">
    <h2>用户角色管理</h2>
    <el-table :data="userStore.userList" v-loading="userStore.loading" border stripe>
      <el-table-column prop="id" label="ID" width="70" align="center" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column label="当前角色" width="120" align="center">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : row.role === 'friend' ? 'success' : 'info'" size="small">
            {{ row.role || '未分配' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="分配角色" width="220" align="center">
        <template #default="{ row }">
          <el-select
            v-model="row.roleId"
            placeholder="选择角色"
            size="small"
            @change="(val: number) => handleRoleChange(row.id, val)"
          >
            <el-option v-for="role in roleStore.roleList" :key="role.id" :label="role.name" :value="role.id" />
          </el-select>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useUserManageStore } from '@/store/modules/userManage'
  import { useRoleStore } from '@/store/modules/role'

  const userStore = useUserManageStore()
  const roleStore = useRoleStore()

  // 修改用户角色
  const handleRoleChange = async (userId: number, newRoleId: number) => {
    try {
      await userStore.updateUserRole(userId, newRoleId)
      ElMessage.success('角色更新成功')
    } catch (err) {
      ElMessage.error('更新失败')
    }
  }

  onMounted(() => {
    // 加载用户列表和角色列表
    userStore.fetchUsers()
    roleStore.fetchRoles()
  })
</script>

<style scoped>
  .user-role-container {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  h2 {
    margin-bottom: 20px;
  }
</style>
