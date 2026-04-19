<template>
  <el-drawer
    v-model="visible"
    :title="user?.username || '用户信息'"
    direction="rtl"
    size="450px"
    custom-class="user-drawer"
  >
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="user" class="user-info">
      <div class="avatar-wrapper" @click="previewAvatar">
        <el-image
          :src="user.avatar"
          :preview-src-list="[user.avatar]"
          :initial-index="0"
          fit="cover"
          class="avatar-img"
          :preview-teleported="true"
        >
          <template #error>
            <el-avatar :size="80">
              {{ user.username?.charAt(0).toUpperCase() }}
            </el-avatar>
          </template>
        </el-image>
      </div>
      <div class="info-item">
        <span class="label">用户名：</span>
        <span class="value">{{ user.username }}</span>
      </div>
      <div class="info-item" v-if="user.desc">
        <span class="label">简介：</span>
        <span class="value">{{ user.desc }}</span>
      </div>
      <div class="info-item">
        <span class="label">角色：</span>
        <span class="value">{{ formatRoles(user.roles) }}</span>
      </div>
      <div class="info-item">
        <span class="label">注册时间：</span>
        <span class="value">{{ formatDate(user.createTime) }}</span>
      </div>
    </div>
    <div v-else class="error">用户不存在</div>
  </el-drawer>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useUserStore } from '@/store/modules/user'
  import dayjs from 'dayjs'

  const props = defineProps<{
    modelValue: boolean
    userId: number
  }>()

  const emit = defineEmits(['update:modelValue'])

  const userStore = useUserStore()
  const visible = ref(props.modelValue)
  const loading = ref(false)
  const user = ref<any>(null)

  watch(
    () => props.modelValue,
    val => {
      visible.value = val
      if (val && props.userId) {
        fetchUser()
      }
    }
  )

  watch(visible, val => {
    emit('update:modelValue', val)
  })

  const fetchUser = async () => {
    loading.value = true
    try {
      user.value = await userStore.getUserById(props.userId)
    } catch {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  const formatRoles = (roles: string | string[]) => {
    if (!roles) return '普通用户'
    if (Array.isArray(roles)) return roles.join('、')
    try {
      const parsed = JSON.parse(roles)
      return Array.isArray(parsed) ? parsed.join('、') : roles
    } catch {
      return roles
    }
  }

  const formatDate = (time: string) => {
    if (!time) return '未知'
    return dayjs(time).format('YYYY-MM-DD HH:mm')
  }

  const previewAvatar = () => {
    // 由 el-image 自带预览功能，无需额外操作
  }
</script>

<style scoped>
  .user-info {
    padding: 20px;
  }
  .avatar-wrapper {
    text-align: center;
    margin-bottom: 20px;
    cursor: pointer;
  }
  .avatar-img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    object-fit: cover;
  }
  .info-item {
    display: flex;
    margin-bottom: 12px;
    font-size: 14px;
  }
  .label {
    width: 80px;
    color: #666;
  }
  .value {
    flex: 1;
    color: #333;
  }
  .loading,
  .error {
    text-align: center;
    padding: 40px;
    color: #999;
  }
</style>
