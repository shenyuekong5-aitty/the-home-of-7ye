<template>
  <div class="permission-container">
    <h2 style="margin-bottom: 20px">权限管理</h2>

    <el-form label-width="80px">
      <el-form-item label="选择角色">
        <el-select v-model="selectedRoleId" placeholder="请选择角色" @change="handleRoleChange">
          <el-option v-for="role in roleStore.roleList" :key="role.id" :label="role.name" :value="role.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="分配权限">
        <el-checkbox-group v-model="currentPermissions">
          <el-checkbox v-for="perm in rolePermissionStore.allPermissions" :key="perm" :label="perm" :value="perm">
            {{ perm }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="save" :loading="rolePermissionStore.saving">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoleStore } from '@/store/modules/role'
  import { useRolePermissionStore } from '@/store/modules/rolePermission'

  const roleStore = useRoleStore()
  const rolePermissionStore = useRolePermissionStore()

  const selectedRoleId = ref<number | null>(null)
  const currentPermissions = ref<string[]>([])

  const handleRoleChange = async () => {
    if (!selectedRoleId.value) {
      currentPermissions.value = []
      return
    }
    const perms = await rolePermissionStore.fetchRolePermissions(selectedRoleId.value)
    currentPermissions.value = perms || []
  }

  const save = () => {
    if (!selectedRoleId.value) return
    rolePermissionStore.updateRolePermissions(selectedRoleId.value, currentPermissions.value)
  }

  onMounted(() => {
    roleStore.fetchRoles()
    rolePermissionStore.fetchAllPermissions()
  })
</script>

<style scoped>
  .permission-container {
    padding: 20px;
    max-width: 800px;
  }
</style>
