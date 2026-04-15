<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useUserStore } from '@/store/modules/user'
  import { useSettingStore } from '@/store/modules/setting'
  import { ElMessage } from 'element-plus'

  const userStore = useUserStore()
  const settingStore = useSettingStore()

  const visible = ref(false)
  const scanning = ref(false)

  // 用于动画期间的随机分数显示
  const randomScore = ref(0)
  let timer: any = null

  // 直接使用 store 中的数据
  const score = computed(() => userStore.securityCheckData?.score ?? 0)
  const checkItems = computed(() => userStore.securityCheckData?.items ?? [])
  const overallMessage = computed(() => userStore.securityCheckData?.message ?? '')

  const open = () => {
    visible.value = true
    startCheck()
  }

  const startCheck = async () => {
    if (scanning.value) return // 防止重复点击
    scanning.value = true

    // 1. 开启数字随机跳动动画
    timer = setInterval(() => {
      randomScore.value = Math.floor(Math.random() * 60) + 40 // 在 40-99 之间随机跳动
    }, 50)

    // 记录开始时间
    const startTime = Date.now()

    try {
      // 调用 store 中的真实检测方法
      await userStore.getSecurityCheck()

      // 2. 保证动画至少执行 1.2 秒（防止接口返回太快导致闪烁）
      const costTime = Date.now() - startTime
      if (costTime < 1200) {
        await new Promise(resolve => setTimeout(resolve, 1200 - costTime))
      }
    } catch (error: any) {
      ElMessage.error(error.message || '安全检测失败')
    } finally {
      // 3. 关闭动画，恢复真实数据
      clearInterval(timer)
      scanning.value = false
    }
  }

  defineExpose({ open })
</script>

<template>
  <el-drawer v-model="visible" title="安全中心" size="380px">
    <div class="check-main">
      <div
        class="score-circle"
        :class="{ 'is-scanning': scanning }"
        :style="{
          borderColor: scanning ? settingStore.themeColor : score < 90 ? '#E6A23C' : settingStore.themeColor,
          boxShadow: scanning ? `0 0 15px ${settingStore.themeColor}80` : 'none'
        }"
      >
        <span class="num">{{ scanning ? randomScore : score }}</span>
        <span class="unit">分</span>
      </div>

      <p class="tip-text">
        {{ scanning ? '系统正在全面扫描安全漏洞...' : overallMessage }}
      </p>

      <div class="check-content">
        <div v-for="item in checkItems" :key="item.id" class="item-row">
          <div class="left">
            <el-icon :class="['status-icon', scanning ? 'is-loading' : item.status]">
              <component :is="scanning ? 'Loading' : item.status === 'success' ? 'CircleCheck' : 'Warning'" />
            </el-icon>
            <span class="label">{{ item.label }}</span>
          </div>
          <div class="right-result" :style="{ color: scanning ? settingStore.themeColor : '#999' }">
            {{ scanning ? '检测中...' : item.result }}
          </div>
        </div>
      </div>

      <div class="footer">
        <el-button type="primary" plain :loading="scanning" @click="startCheck">
          {{ scanning ? '正在扫描' : '重新扫描' }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<style scoped lang="scss">
  .check-main {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;

    .score-circle {
      width: 120px;
      height: 120px;
      border: 8px solid;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s;
      margin-bottom: 15px;

      /* 扫描时的呼吸灯缩放动画 */
      &.is-scanning {
        animation: breath 1.2s infinite ease-in-out;
      }

      .num {
        font-size: 38px;
        font-weight: bold;
        font-family: 'Courier New', Courier, monospace; /* 让数字跳动时等宽，避免晃动 */
      }
      .unit {
        margin-top: 10px;
        margin-left: 2px;
        font-size: 14px;
      }
    }

    .tip-text {
      margin-bottom: 20px;
      color: #606266;
      font-weight: 500;
    }

    .item-row {
      width: 300px;
      display: flex;
      justify-content: space-between;
      padding: 15px 0;
      border-bottom: 1px dashed #ebeef5; /* 改成虚线更轻量 */
      transition: background-color 0.3s;

      &:hover {
        background-color: #f9fafc;
      }

      .left {
        display: flex;
        align-items: center;

        .status-icon {
          margin-right: 10px;
          font-size: 18px; /* 图标稍微大一点 */

          &.success {
            color: #67c23a;
          }
          &.warning {
            color: #e6a23c;
          }
          /* 使用 el-icon 自带的 is-loading 类即可，无需自己写旋转关键帧 */
        }
      }
      .right-result {
        font-size: 13px;
        transition: color 0.3s;
      }
    }

    .footer {
      margin-top: 30px;
      width: 100%;
      display: flex;
      justify-content: center;

      .el-button {
        width: 140px;
        border-radius: 20px; /* 圆角按钮看起来更现代 */
      }
    }
  }

  /* 呼吸灯动画关键帧 */
  @keyframes breath {
    0% {
      transform: scale(0.95);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(0.95);
    }
  }
</style>
