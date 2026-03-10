<template>
  <div class="container">
    <div class="top">
      <p class="welcome">{{ userStore.userInfo.username }} {{ getPeriod() }}</p>
    </div>
    <div class="bottom">
      <div class="left">
        <div class="modules">
          <el-card class="card-item"> tt </el-card>
          <el-card class="card-item"> tt </el-card>
          <el-card class="card-item"> tt </el-card>
        </div>
      </div>

      <div class="right" ref="rightRef">
        <el-carousel height="100%" autoplay arrow="always">
          <el-carousel-item v-for="(img, index) in imgList" :key="index">
            <div class="glass-wrapper">
              <div
                class="blur-bg"
                :style="{ backgroundImage: `url(${img})` }"
              ></div>
              <img :src="img" class="main-img" alt="" />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { getPeriod } from '@/utils/time'
import { useUserStore } from '@/store/modules/user'

// 引入本地图片资源
import imgC1 from '../../../assets/images/C1.png'
import imgC2 from '../../../assets/images/C2.png'
import imgC3 from '../../../assets/images/C3.png'
import imgC4 from '../../../assets/images/C4.png'

const imgList = [imgC1, imgC2, imgC3, imgC4]

const userStore = useUserStore()

onMounted(async () => {
  await userStore.reqUserInfo()
  // 尺寸打印逻辑保留
})
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: calc(100vh - $base-tabbar-height - 40px);
  padding-top: 5px;
  box-sizing: border-box;

  .top {
    height: 30px;
    display: flex;
    align-items: center;
    margin-left: 10px;

    .welcome {
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;

      background: linear-gradient(
        45deg,
        var(--el-color-primary),
        var(--el-color-primary-light-3)
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;

      animation: shine 3s ease infinite;
      background-size: 200% auto;
      -webkit-font-smoothing: antialiased;
      letter-spacing: 2px;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
    }
  }

  .bottom {
    width: 100%;
    height: calc(100vh - $base-tabbar-height - 75px);
    display: flex;
    gap: 10px;
    padding: 10px;
    box-sizing: border-box;

    .left {
      flex: 2;
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      .modules {
        padding: 0 5px;
        height: 340px;
        background-color: pink;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 5px;
        .card-item {
          width: 90%;
          height: 90%;
          border-radius: 8px;
        }
      }
    }

    .right {
      flex: 1;
      height: 100%;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      .glass-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        // 调整点 1: 漫画风格底色建议用浅灰色或白色，而不是纯黑
        background-color: #fafafa;

        .blur-bg {
          position: absolute;
          top: -10%;
          left: -10%;
          width: 120%;
          height: 120%;
          background-size: cover;
          background-position: center;
          // 调整点 2: 漫画风格背景不要太暗，brightness 改为 0.9，增加对比度
          filter: blur(25px) brightness(0.9) contrast(1.2);
          z-index: 1;
          opacity: 0.6; // 让背景淡一点，不干扰主体
          transform: scale(1.1);
        }

        .main-img {
          position: relative;
          z-index: 2;
          max-width: 95%; // 稍微缩小一点，露出更多背景感
          max-height: 95%;
          object-fit: contain;
          // 调整点 3: 漫画主体加个细细的黑色边框和更柔和的阴影
          border: 1px solid #ddd;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          background-color: #fff; // 确保漫画透明处是白色
        }
      }
    }
  }
}

// 深度作用选择器，确保 el-carousel 撑满
:deep(.el-carousel) {
  height: 100%;
}
:deep(.el-carousel__container) {
  height: 100% !important;
}

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
