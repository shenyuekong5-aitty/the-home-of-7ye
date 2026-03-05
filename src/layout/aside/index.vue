<template>
  <div class="aside">
    <site-header-logo></site-header-logo>
    <menuComponent></menuComponent>
  </div>
</template>

<script setup lang="ts">
// 这里写 TypeScript 代码
import siteHeaderLogo from './siteHeaderLogo/index.vue'
import menuComponent from './menu/index.vue'
</script>

<style scoped>
.aside {
  border-right: 1px solid black;
}
</style>
