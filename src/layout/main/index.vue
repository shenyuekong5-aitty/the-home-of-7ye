<template>
  <div class="main"><router-view></router-view></div>
</template>

<script setup lang="ts">
// 这里写 TypeScript 代码
</script>

<style scoped lang="scss">
.main {
  margin-left: 10px;
  height: calc(100vh - $base-tabbar-height);
  background-color: transparent;
}
</style>
