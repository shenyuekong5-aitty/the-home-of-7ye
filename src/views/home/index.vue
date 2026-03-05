<template>
  <div>home</div>
  <h1>{{ userStore.userInfo.username }}</h1>
</template>

<script setup lang="ts">
// 这里写 TypeScript 代码
import { onMounted } from 'vue'
// 引入类型文件
// 获取用户信息
import { useUserStore } from '@/store/modules/user'
const userStore = useUserStore()
onMounted(async () => {
  await userStore.reqUserInfo()
})
</script>

<style scoped></style>
