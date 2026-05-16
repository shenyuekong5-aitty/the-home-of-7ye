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
          <el-checkbox
            v-for="perm in rolePermissionStore.allPermissions"
            :key="perm"
            :label="perm"
            :value="perm"
            :disabled="immutablePerms.includes(perm)"
          >
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

  import { constantRoute } from '@/router/routes'

  // 从静态路由中提取所有标记了 immutable 的 name
  function getImmutablePermissions(): string[] {
    const perms: string[] = []
    function extract(routeList: any[]) {
      routeList.forEach(route => {
        if (route.meta?.immutable && route.name) {
          perms.push(route.name as string)
        }
        if (route.children) {
          extract(route.children)
        }
      })
    }
    extract(constantRoute)
    return perms
  }

  const immutablePerms = getImmutablePermissions()

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
    const permsToSave = [...new Set([...currentPermissions.value, ...immutablePerms])]
    rolePermissionStore.updateRolePermissions(selectedRoleId.value, permsToSave)
  }

  onMounted(() => {
    roleStore.fetchRoles()
    rolePermissionStore.fetchAllPermissions()
  })
</script>

<style scoped>
  .permission-container {
    max-width: 800px;
    padding: 20px;
  }
</style>
