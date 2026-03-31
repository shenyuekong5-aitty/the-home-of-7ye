<template>
  <template v-for="item in props.menuList" :key="item.path">
    <!-- 没有子路由或只有一个子路由（按你原来的逻辑合并） -->
    <template v-if="!item?.children || item?.children?.length === 1">
      <el-menu-item v-if="!item?.meta?.hidden" :index="item.fullPath || item.path" @click="goRoute(item)">
        <el-icon>
          <component :is="item?.meta?.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item?.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有多个子路由 -->
    <el-sub-menu v-else-if="item?.children && item?.children?.length > 1" :index="item.fullPath || item.path">
      <template #title>
        <el-icon>
          <component :is="item?.meta?.icon"></component>
        </el-icon>
        <span>{{ item?.meta?.title }}</span>
      </template>
      <MenuItem :menuList="item?.children" />
    </el-sub-menu>
  </template>
</template>

<script setup>
  import { useRouter } from 'vue-router'
  const router = useRouter()
  defineOptions({ name: 'MenuItem' })
  const props = defineProps({
    menuList: { type: Array, default: () => [] }
  })
  const goRoute = async vc => {
    // 优先使用 name，其次使用 fullPath，最后使用 path
    if (vc.name) {
      await router.push({ name: vc.name })
    } else if (vc.fullPath) {
      await router.push(vc.fullPath)
    } else {
      await router.push(vc.path)
    }
  }
</script>

<style scoped>
  /* 一级菜单项样式 */
  :deep(.el-menu > .el-menu-item) {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    padding-left: 24px !important;
  }

  /* 一级子菜单标题样式 */
  :deep(.el-menu > .el-sub-menu > .el-sub-menu__title) {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    padding-left: 24px !important;
  }

  /* 二级及更深层级的菜单项样式 - 增加缩进 */
  :deep(.el-sub-menu .el-menu-item) {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    padding-left: 48px !important;
  }

  /* 二级及更深层级的子菜单标题样式 - 增加缩进 */
  :deep(.el-sub-menu .el-sub-menu__title) {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    padding-left: 48px !important;
  }

  /* 三级及更深层级的菜单项样式 - 进一步增加缩进 */
  :deep(.el-sub-menu .el-sub-menu .el-menu-item) {
    padding-left: 72px !important;
  }

  /* 三级及更深层级的子菜单标题样式 - 进一步增加缩进 */
  :deep(.el-sub-menu .el-sub-menu .el-sub-menu__title) {
    padding-left: 72px !important;
  }

  /* 图标大小调整 */
  :deep(.el-menu-item .el-icon),
  :deep(.el-sub-menu__title .el-icon) {
    font-size: 22px;
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }

  /* 标题文字大小，如果前面没生效可以额外控制 */
  :deep(.el-menu-item span),
  :deep(.el-sub-menu__title span) {
    font-size: 18px;
  }
</style>
