<template>
  <div>
    <el-scrollbar class="sidebar-wrapper">
      <el-menu
        default-active="1"
        collapse-transition
        class="sidebar-scrollbar"
        :collapse="settingStore.isCollapse"
      >
        <MenuItem :menuList="routes" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import MenuItem from '@/layout/aside/menu/MenuItem/index.vue'
// 引入权限仓库
import { usePermissionStore } from '@/store/modules/permission'
// 引入设置仓库
import { useSettingStore } from '@/store/modules/setting'

// 权限仓库
const permissionStore = usePermissionStore()
// 设置仓库
const settingStore = useSettingStore()
// 路由列表
const routes = permissionStore.routes
</script>

<style scoped lang="scss">
/* 菜单折叠状态下，放大图标 */
:deep(.el-menu--collapse) {
  margin-left:15px;
  .el-menu-item,
  .el-sub-menu__title {
    /* 可以适当增加菜单项高度，让图标更舒展 */
    height: 64px !important;          /* 原默认可能 56px，可调 */
    line-height: 64px !important;
    text-align: center;               /* 确保图标水平居中 */
  }

  /* 图标本身放大 */
  .el-icon {
    font-size: 28px !important;       /* 原图标通常 18-20px，可自行调整 */
    width: 32px !important;           /* 固定宽高防止变形 */
    height: 32px !important;
    margin: 0 !important;              /* 移除多余外边距 */
  }

  /* 折叠后标题文字隐藏，不需要额外处理，但如果有特殊样式可隐藏 */
  span {
    display: none !important;          /* 确保文字不显示（可选） */
  }
}
.el-menu {
  --el-menu-item-height: 60px;           /* 菜单项高度 */
  --el-menu-item-font-size: 18px;         /* 菜单项字体大小 */
  --el-sub-menu-title-font-size: 18px;    /* 子菜单标题字体大小 */
  --el-menu-base-level-padding: 24px;     /* 一级菜单左侧内边距 */
  --el-menu-level-padding: 24px;          /* 子菜单内边距 */
}
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

/* 仅收缩时移除右侧线条 */
.el-menu--collapse {
  border-right: none !important;
}
</style>
