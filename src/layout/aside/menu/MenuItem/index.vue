<template>
  <template v-for="item in props.menuList" :key="item.path">
    <!-- 没有子路由 -->
    <template v-if="!item?.children">
      <el-menu-item
        v-if="!item?.meta?.hidden"
        :index="item.path"
        @click="goRoute(item)"
      >
        <el-icon>
          <component :is="item?.meta?.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item?.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 这一部分仅用于练习 -->
    <!-- 有一个子路由 -->
    <!-- <template v-if="item.children && item.children?.length === 1">
    <el-menu-item v-if="!item.children[0]?.meta?.hidden">
      <el-icon>
        <component :is="item.children[0]?.meta?.icon"></component>
      </el-icon>
      <template #title>
        <span>{{ item.children[0]?.meta.title }}</span>
      </template>
    </el-menu-item>
  </template> -->
    <template v-else-if="item?.children && item?.children?.length === 1">
      <el-menu-item
        v-if="!item?.meta?.hidden"
        :index="item.path"
        @click="goRoute(item)"
      >
        <el-icon>
          <component :is="item?.meta?.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item?.meta?.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有多个子路由 -->
    <el-sub-menu
      v-else-if="item?.children && item?.children?.length > 1"
      :index="item.path"
    >
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
defineOptions({
  name: 'MenuItem'
})
const props = defineProps({
  menuList: {
    type: Array,
    default: () => [] // 确保即使没传，也是空数组，v-for 不会报错
  }
})
const goRoute = async (vc) => {
  // 检查是否有 name，如果有，优先使用 name 跳转
  if (vc.name) {
    await router.push({ name: vc.name })
  } else {
    // 备选方案：如果没写 name，再用 path
    await router.push(vc.path)
  }
}
</script>

<style scoped>

span{
  font-size:20px;
}
</style>
