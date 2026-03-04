<template>
  <div>
    <el-scrollbar class="sidebar-wrapper">
      <el-menu default-active="1" collapse-transition class="sidebar-scrollbar">
        <MenuItem :menuList="routes" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { usePermissionStore } from '@/store/modules/permission'
import MenuItem from '@/layout/aside/menu/MenuItem/index.vue'
const permissionStore = usePermissionStore()
const routes = permissionStore.routes
</script>

<style scoped lang="scss">
// 核心：锁定外层容器高度为100vh，溢出隐藏
.sidebar-wrapper {
  height: calc(
    100vh - $base-tabbar-height - 20px
  ); // 固定视口高度，不受内部内容影响
  overflow: hidden; // 关键：防止菜单展开撑破容器
  box-sizing: border-box; // 避免内边距影响高度
}

// el-scrollbar 占满容器高度，处理内部滚动
.sidebar-scrollbar {
  height: 100%;
  --el-scrollbar-width: 6px; // 优化滚动条样式
}

// el-menu 高度100%，内容超出时由 scrollbar 滚动
.sidebar-menu {
  height: 100%;
  border-right: none; // 去掉默认边框，可选
}
</style>
