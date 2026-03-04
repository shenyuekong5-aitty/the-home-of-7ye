<template>
  <div class="container">
    <div class="left"><asideComponent></asideComponent></div>
    <div class="right">
      <tabbarComponent></tabbarComponent>
      <mainComponent></mainComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
// 这里写 TypeScript 代码
import tabbarComponent from './tabbar/index.vue'
import asideComponent from './aside/index.vue'
import mainComponent from './main/index.vue'
</script>

<style scoped lang="scss">
.container {
  display: flex;
  width: 100%;
  height: 100vh;
  .left {
    width: $base-menu-width;
  }
  .right {
    width: calc(100% - $base-menu-width);
    background-color: skyblue;
  }
}
</style>
