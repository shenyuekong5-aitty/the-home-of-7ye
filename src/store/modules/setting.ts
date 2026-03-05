import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSettingStore = defineStore('setting', () => {
  // state
  const isCollapse = ref(false)

  // watch: 监听 isCollapse 的变化
  watch(isCollapse, (newVal) => {
    console.log('侧边栏状态改变了：', newVal)
    // 你可以在这里做一些副作用处理，比如修改 document.body 的类名
    if (newVal) {
      console.log('侧边栏已折叠')
    } else {
      console.log('侧边栏已展开')
    }
  })

  return {
    isCollapse
  }
})
