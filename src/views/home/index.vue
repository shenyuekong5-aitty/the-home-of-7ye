<template>
  <div class="container">
    <div class="top">
      <p class="welcome">{{ userStore.userInfo.username }} {{ getPeriod() }}</p>
    </div>
    <div class="bottom">
      <div class="left"></div>
      <div class="right"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { getPeriod } from '@/utils/time'
import { useUserStore } from '@/store/modules/user'
// 1. 引入并实例化 settingStore

const userStore = useUserStore()

onMounted(async () => {
  await userStore.reqUserInfo()
})
</script>

<style scoped lang="scss">
.container {
  // 注意：如果是背景图页，通常不需要 text-indent，否则图片或布局会偏移
  // text-indent: 2em;
  width: 100%; // 建议用 100% 适配父容器，100vw 在有滚动条时会溢出
  height: calc(100vh - $base-tabbar-height - 40px);
  padding-top: 5px;
  box-sizing: border-box;

  .top {
    height: 60px;
    display: flex;
    align-items: center;
    margin-left: 10px;

    .welcome {
      margin: 0;
      font-size: 26px; // 字号加大，更有张力
      font-weight: 800; // 极粗体，配合背景图更有艺术感
      font-family:
        'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;

      // --- 核心联动：接受主题颜色控制 ---
      // 使用主题色作为主色，主题色的 70% 亮度色作为副色，形成动态渐变
      background: linear-gradient(
        45deg,
        var(--el-color-primary),
        var(--el-color-primary-light-3)
      );

      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;

      // 增加微弱的呼吸感动画（可选）
      animation: shine 3s ease infinite;
      background-size: 200% auto;

      // 边缘平滑
      -webkit-font-smoothing: antialiased;
      letter-spacing: 2px;

      // 这里的阴影不能用 text-shadow（因为填充是透明的），
      // 如果需要投影，可以用 filter
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
    }
  }
  .bottom {
    width: 100%;
    height: calc(100vh - $base-tabbar-height - 65px);
    background-color: red;
    display: flex;
    .left {
      flex: 2;
      background-color: black;
    }
    .right {
      flex: 1;
      background-color: purple;
    }
  }
}

// 文字流光动画
@keyframes shine {
  0% {
    background-position: 0% center;
  }
  50% {
    background-position: 100% center;
  }
  100% {
    background-position: 0% center;
  }
}
</style>
