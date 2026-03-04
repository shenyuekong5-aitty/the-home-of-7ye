<template>
  <div class="error-container">
    <div class="error-content">
      <div class="error-code">
        <span>4</span>
        <div class="cloud">
          <div class="circle"></div>
        </div>
        <span>4</span>
      </div>

      <div class="error-text">
        <h2>哎呀，页面去旅行了...</h2>
        <p>可能它也想去看看远方的海，或者迷失在蔚蓝的云端了。</p>
      </div>

      <div class="error-actions">
        <el-button type="primary" round class="back-btn" @click="goHome">
          回到主页
        </el-button>
        <el-button round class="prev-btn" @click="goBack">
          返回上一页
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f0f7ff; /* 极其浅的淡蓝色，类似晴空 */
  overflow: hidden;
}

.error-content {
  text-align: center;
  padding: 20px;
}

/* 404 数字样式 */
.error-code {
  font-size: 150px;
  font-weight: 800;
  color: #a5d8ff; /* 少年感的浅蓝 */
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  margin-bottom: 20px;
}

/* 中间的 O 变成一朵简笔画小云朵 */
.cloud {
  width: 100px;
  height: 40px;
  background: #fff;
  border-radius: 50px;
  position: relative;
  margin: 0 10px;
  animation: float 3s ease-in-out infinite;
}

.cloud::after,
.cloud::before {
  content: '';
  position: absolute;
  background: #fff;
  border-radius: 50%;
}

.cloud::after {
  width: 50px;
  height: 50px;
  top: -25px;
  left: 15px;
}

.cloud::before {
  width: 40px;
  height: 40px;
  top: -15px;
  right: 15px;
}

/* 悬浮动画 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

.error-text h2 {
  font-size: 28px;
  color: #4a90e2;
  margin-bottom: 15px;
  font-weight: 500;
}

.error-text p {
  font-size: 16px;
  color: #8fb6d9;
  margin-bottom: 40px;
}

.error-actions .back-btn {
  padding: 12px 30px;
  font-size: 16px;
  background-color: #74b9ff;
  border-color: #74b9ff;
  transition: all 0.3s;
}

.error-actions .back-btn:hover {
  background-color: #0984e3;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(116, 185, 255, 0.4);
}

.error-actions .prev-btn {
  padding: 12px 30px;
  font-size: 16px;
  color: #74b9ff;
  border-color: #74b9ff;
}

.error-actions .prev-btn:hover {
  background-color: #f0f7ff;
  color: #0984e3;
}
</style>
