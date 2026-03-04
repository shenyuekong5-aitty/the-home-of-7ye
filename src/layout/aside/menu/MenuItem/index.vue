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
const goRoute = (vc) => {
  // vc 是路由对象。这里直接 push 它的 path
  // 确保你的数据里 item.path 是 "/home" 这种绝对路径
  router.push(vc.path)
  console.log(vc.path)
}
</script>

<style scoped></style>
