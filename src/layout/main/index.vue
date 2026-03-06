<template>
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <div v-if="flag" class="main-wrapper">
        <component :is="Component" />
      </div>
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { watch, nextTick, ref, onMounted } from 'vue'
import { useSettingStore } from '@/store/modules/setting'

const settingStore = useSettingStore()
const flag = ref(true)

watch(
  () => settingStore.isRefresh,
  () => {
    flag.value = false
    nextTick(() => {
      flag.value = true
    })
  }
)
onMounted(() => {
  console.log('onMounted')
})
</script>

<style scoped lang="scss">
/* 3. 样式微调 */
.main-wrapper {
  margin-left: 10px;
  /* 确保高度计算正确 */
  height: calc(100vh - #{$base-tabbar-height});
  background-color: transparent;
  /* 如果内部组件有溢出，建议加上这个 */
  overflow: auto;
}

/* 4. 优化动画：因为加了包装层，建议去掉 scale，只做淡入淡出更简约 */
.fade-enter-from {
  opacity: 0;
}

.fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-enter-to {
  opacity: 1;
}
</style>
