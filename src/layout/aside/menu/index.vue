<template>
  <div>
    <el-scrollbar class="sidebar-wrapper">
      <el-menu
        :default-active="activeMenu"
        collapse-transition
        class="sidebar-scrollbar"
        :collapse="settingStore.isCollapse"
      >
        <MenuItem :menuList="routesWithFullPath" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import MenuItem from '@/layout/aside/menu/MenuItem/index.vue'
  import { usePermissionStore } from '@/store/modules/permission'
  import { useSettingStore } from '@/store/modules/setting'

  const route = useRoute()
  const activeMenu = computed(() => route.path)

  const permissionStore = usePermissionStore()
  const settingStore = useSettingStore()
  const rawRoutes = permissionStore.routes

  // 递归添加 fullPath
  const addFullPath = (routes: any[], parentPath = ''): any[] => {
    return routes.map(route => {
      // 处理 path：如果以 '/' 开头则直接使用，否则拼接父路径
      const path = route.path.startsWith('/') ? route.path : `${parentPath}/${route.path}`
      const fullPath = path.replace(/\/+/g, '/') // 去除重复斜杠
      const newRoute = { ...route, fullPath }
      if (route.children) {
        newRoute.children = addFullPath(route.children, fullPath)
      }
      return newRoute
    })
  }
  const routesWithFullPath = addFullPath(rawRoutes)
</script>

<style scoped lang="scss">
  /* 菜单折叠状态下，放大图标 */
  :deep(.el-menu--collapse) {
    margin-left: 15px;
    .el-menu-item,
    .el-sub-menu__title {
      /* 可以适当增加菜单项高度，让图标更舒展 */
      height: 64px !important; /* 原默认可能 56px，可调 */
      line-height: 64px !important;
      text-align: center; /* 确保图标水平居中 */
    }

    /* 图标本身放大 */
    .el-icon {
      font-size: 28px !important; /* 原图标通常 18-20px，可自行调整 */
      width: 32px !important; /* 固定宽高防止变形 */
      height: 32px !important;
      margin: 0 !important; /* 移除多余外边距 */
    }

    /* 折叠后标题文字隐藏，不需要额外处理，但如果有特殊样式可隐藏 */
    span {
      display: none !important; /* 确保文字不显示（可选） */
    }
  }
  .el-menu {
    --el-menu-item-height: 60px;
    --el-menu-item-font-size: 18px;
    --el-sub-menu-title-font-size: 18px;
    --el-menu-base-level-padding: 24px; /* 一级菜单左侧内边距 */
    --el-menu-level-padding: 48px; /* 子菜单内边距，增加缩进量 */
  }

  /* 二级菜单展开时的缩进 */
  :deep(.el-sub-menu .el-menu) {
    padding-left: 24px !important;
  }

  // 核心：锁定外层容器高度为100vh，溢出隐藏
  .sidebar-wrapper {
    height: calc(100vh - $base-tabbar-height - 20px); // 固定视口高度，不受内部内容影响
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

  /* 仅收缩时移除右侧线条 */
  .el-menu--collapse {
    border-right: none !important;
  }
</style>
