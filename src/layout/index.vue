<template>
  <div class="container">
    <div class="left" :class="{ 'left-change': settingStore.isCollapse }">
      <asideComponent></asideComponent>
    </div>
    <div class="right" :class="{ 'right-change': settingStore.isCollapse }">
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
// 引入setting仓库
import { useSettingStore } from '@/store/modules/setting'
const settingStore = useSettingStore()
</script>

<style scoped lang="scss">
.container {
  display: flex;
  width: 100%;
  height: 100vh;

  .left {
    width: $base-menu-width;
    // 关键修复：在基础类中就定义 transition，确保双向过渡都流畅
    transition: width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  .right {
    width: calc(100% - $base-menu-width);
    // 同样为 right 添加过渡效果
    transition: width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  }

  .left-change {
    width: $base-menu-min-width;
  }

  .right-change {
    width: calc(100% - $base-menu-min-width);
  }
}
</style>
