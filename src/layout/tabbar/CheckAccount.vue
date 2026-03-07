<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { useSettingStore } from '@/store/modules/setting'

const userStore = useUserStore()
const settingStore = useSettingStore()

const visible = ref(false)
const scanning = ref(false)
const score = ref(0)

// 模拟检测条目
const checkItems = ref([
  { id: 'pwd', label: '密码安全', result: '检测中', status: 'pending' },
  { id: 'role', label: '权限架构', result: '检测中', status: 'pending' },
  { id: 'route', label: '菜单合规', result: '检测中', status: 'pending' },
  { id: 'info', label: '资料完整度', result: '检测中', status: 'pending' }
])

const open = () => {
  visible.value = true
  startCheck()
}

const startCheck = () => {
  scanning.value = true
  score.value = 0

  // 重置状态
  checkItems.value.forEach((item) => {
    item.status = 'pending'
    item.result = '检测中'
  })

  // 模拟异步扫描动画
  setTimeout(() => {
    const info = userStore.userInfo
    let currentScore = 100

    // 1. 检测权限 (基于 roles)
    const roleItem = checkItems.value.find((i) => i.id === 'role')!
    if (info?.roles?.includes('admin')) {
      roleItem.result = '超级管理员 (高权限)'
      roleItem.status = 'success'
    } else {
      roleItem.result = '普通用户'
      roleItem.status = 'success'
    }

    // 2. 检测菜单 (基于 routes 长度)
    const routeItem = checkItems.value.find((i) => i.id === 'route')!
    if (info.permissions && info.permissions.length > 10) {
      routeItem.result = '功能完整'
      routeItem.status = 'success'
    } else {
      routeItem.result = '功能受限'
      routeItem.status = 'warning'
      currentScore -= 10
    }

    // 3. 资料完整度 (基于 avatar 和 username)
    const infoItem = checkItems.value.find((i) => i.id === 'info')!
    if (info.username && info.avatar) {
      infoItem.result = '已完善'
      infoItem.status = 'success'
    } else {
      infoItem.result = '缺少头像'
      infoItem.status = 'warning'
      currentScore -= 5
    }

    // 4. 模拟密码检测 (因为拿不到明文，模拟判断)
    const pwdItem = checkItems.value.find((i) => i.id === 'pwd')!
    pwdItem.result = '建议定期更换'
    pwdItem.status = 'warning'
    currentScore -= 5

    score.value = currentScore
    scanning.value = false
  }, 1500)
}

defineExpose({ open })
</script>

<template>
  <el-drawer v-model="visible" title="安全中心" size="380px">
    <div class="check-main">
      <div
        class="score-circle"
        :style="{
          borderColor: score < 90 ? '#E6A23C' : settingStore.themeColor
        }"
      >
        <span class="num">{{ scanning ? '...' : score }}</span>
        <span class="unit" v-if="!scanning">分</span>
      </div>

      <p class="tip-text">
        {{ scanning ? '系统正在扫描安全漏洞...' : '账号整体状态良好' }}
      </p>

      <div class="check-content">
        <div v-for="item in checkItems" :key="item.id" class="item-row">
          <div class="left">
            <el-icon :class="['status-icon', item.status]">
              <component
                :is="
                  item.status === 'pending'
                    ? 'Loading'
                    : item.status === 'success'
                      ? 'CircleCheck'
                      : 'Warning'
                "
              />
            </el-icon>
            <span class="label">{{ item.label }}</span>
          </div>
          <div class="right-result">{{ item.result }}</div>
        </div>
      </div>

      <div class="footer" v-if="!scanning">
        <el-button type="primary" plain @click="startCheck">重新扫描</el-button>
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
    transition: all 0.5s;
    margin-bottom: 15px;
    .num {
      font-size: 32px;
      font-weight: bold;
    }
    .unit {
      margin-top: 10px;
      font-size: 14px;
    }
  }

  .item-row {
    width: 300px;
    display: flex;
    justify-content: space-between;
    padding: 15px 0;
    border-bottom: 1px solid #f0f0f0;
    .left {
      display: flex;
      align-items: center;
      .status-icon {
        margin-right: 10px;
        &.pending {
          animation: rotating 2s linear infinite;
        }
        &.success {
          color: #67c23a;
        }
        &.warning {
          color: #e6a23c;
        }
      }
    }
    .right-result {
      color: #999;
      font-size: 13px;
    }
  }
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
