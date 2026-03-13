<template>
  <div class="tabbar">
    <div class="left">
      <component
        :is="settingStore.isCollapse ? 'Fold' : 'Expand'"
        class="icon"
        @click="toggle"
      ></component>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item
          :to="{ path: '/' }"
          v-for="item in routeStore.matched"
          :key="item"
          >{{ item }}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
    <div class="right">
      <div class="setting">
        <el-button
          circle
          icon="refresh"
          size="small"
          @click="settingStore.refresh"
        ></el-button>
        <el-color-picker
          class="color-picker"
          v-model="settingStore.themeColor"
          :predefine="settingStore.predefineColors"
          @change="settingStore.setThemeColor"
        />
        <el-button
          circle
          icon="FullScreen"
          size="small"
          @click="handleFullScreen"
        ></el-button>
      </div>
      <div class="userinfo">
        <img
          v-if="userStore?.userInfo?.avatar"
          :src="userStore.userInfo.avatar"
          alt=""
        />
        <span
          v-else-if="userStore?.userInfo?.username"
          class="temp-avatar"
          :style="{ backgroundColor: settingStore.themeColor, color: '#fff' }"
        >
          {{ userStore.userInfo.username.charAt(0) }}
        </span>
        <span
          v-else
          class="temp-avatar"
          :style="{ backgroundColor: settingStore.themeColor, color: '#fff' }"
        >
          无
        </span>
        <span v-if="userStore?.userInfo?.username">{{
          userStore.userInfo.username
        }}</span>
        <span v-else>无</span>
        <el-dropdown>
          <span class="el-dropdown-link">
            更多
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleCheck">账号检测</el-dropdown-item>
              <el-dropdown-item @click="changePassword"
                >修改密码</el-dropdown-item
              >
              <el-dropdown-item @click="userStore.logout"
                >退出登录</el-dropdown-item
              >
              <el-dropdown-item divided @click="contactAdmin"
                >联系站长</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="联系站长"
      width="400px"
      align-center
    >
      <div class="contact-content">
        <h3
          :style="{
            color: settingStore.themeColor,
            borderLeftColor: settingStore.themeColor
          }"
        >
          联系我
        </h3>
        <div class="email-list">
          <div class="email-item">
            <el-icon :style="{ color: settingStore.themeColor }"
              ><Message
            /></el-icon>
            <span>QQ: <strong>3316900024@qq.com</strong></span>
          </div>
          <div class="email-item">
            <el-icon :style="{ color: settingStore.themeColor }"
              ><Message
            /></el-icon>
            <span>Gmail: <strong>shenyuekong5@gmail.com</strong></span>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
          <el-button
            type="primary"
            :style="{
              backgroundColor: settingStore.themeColor,
              borderColor: settingStore.themeColor
            }"
            @click="dialogVisible = false"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
    <UpdatePassword ref="updatePasswordRef"></UpdatePassword>
    <CheckAccount ref="checkAccountRef"></CheckAccount>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ArrowRight, ArrowDown, Message } from '@element-plus/icons-vue'
import { useSettingStore } from '@/store/modules/setting'
import { useRouteStore } from '@/store/modules/route'
import { useUserStore } from '@/store/modules/user'
import UpdatePassword from './UpdatePassword.vue'
import CheckAccount from './CheckAccount.vue'

const settingStore = useSettingStore()
const routeStore = useRouteStore()
const userStore = useUserStore()

const dialogVisible = ref(false)

const toggle = () => {
  settingStore.toggleCollapse()
}

const contactAdmin = () => {
  dialogVisible.value = true
}

const handleFullScreen = () => {
  const full = document.fullscreenElement
  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const updatePasswordRef = ref()
const checkAccountRef = ref()

const changePassword = () => {
  updatePasswordRef.value?.open()
}

const handleCheck = () => {
  checkAccountRef.value?.open()
}

onMounted(() => {
  settingStore.setThemeColor(settingStore.themeColor)
})
</script>

<style scoped lang="scss">
.tabbar {
  margin: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: $base-tabbar-height; // 假设是60px
  box-sizing: border-box;

  .left {
    display: flex;
    align-items: center;
    padding-left: 10px;
    gap: 14px;
    flex: 1;                     // 占据剩余空间
    min-width: 0;                 // 允许收缩

    .icon {
      width: 32px;
      height: 32px;
      cursor: pointer;
      transition: transform 0.6s ease;
      flex-shrink: 0;
      &:hover {
        transform: scale(1.1);
      }
    }

    // 面包屑容器：禁止换行、溢出省略
    :deep(.el-breadcrumb) {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;                    // 让面包屑填充剩余宽度
      min-width: 0;
    }

    :deep(.el-breadcrumb__inner) {
      font-size: 24px;
      color: #606266;
    }
    :deep(.el-breadcrumb__item) {
      &:last-child {
        .el-breadcrumb__inner {
          color: #303133;
          font-weight: 500;
        }
      }
    }
    :deep(.el-breadcrumb__separator) {
      font-size: 15px;
    }
  }

  .right {
    display: flex;
    align-items: center;
    padding-right: 10px;
    gap: 18px;
    flex-shrink: 0;                // 防止被压缩
    overflow: hidden;
    white-space: nowrap;
    max-width: 1000px;             // 足够大，正常显示
    transition: max-width 0.4s ease; // 稍微延长过渡时间

    .setting {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;

      .el-button {
        width: 38px;
        height: 38px;
        padding: 0;
        border-radius: 50%;
        .el-icon {
          font-size: 18px;
        }
      }

      :deep(.color-picker) {
        width: 38px;
        height: 38px;
        .el-color-picker__trigger {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          padding: 0;
          overflow: hidden;
          border: 1px solid #dcdfe6;
        }
        .el-color-picker__color {
          border: none;
          border-radius: 50%;
          .el-color-picker__color-inner {
            border-radius: 50%;
          }
        }
        .el-color-picker__icon {
          display: none;
        }
      }
    }

    .userinfo {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      flex-shrink: 0;

      .temp-avatar {
        width: 40px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        font-size: 18px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
        flex-shrink: 0;
      }

      span {
        font-size: 20px;
        color: #606266;
        white-space: nowrap;
      }

      .el-dropdown-link {
        display: flex;
        align-items: center;
        outline: none;
        border: none;
        font-size: 18px;
        color: #606266;
        gap: 5px;
        &:focus {
          outline: none;
        }
      }

      &:hover {
        span {
          color: #409eff;
        }
        .el-dropdown-link {
          color: #409eff;
        }
      }
    }
  }
}

// 联系站长弹窗样式（不变）
.contact-content {
  padding: 10px 0;
  h3 {
    margin: 0 0 20px 0;
    font-weight: bold;
    font-size: 22px;
    border-left: 4px solid;
    padding-left: 12px;
    line-height: 1.4;
  }
  .email-list {
    .email-item {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
      font-size: 15px;
      color: #666;
      line-height: 1.6;
      .el-icon {
        font-size: 20px;
        flex-shrink: 0;
      }
      strong {
        color: #333;
        margin-left: 5px;
        font-weight: 500;
      }
    }
  }
}

// 媒体查询：小屏幕下右侧平滑隐藏
@media screen and (max-width: 868px) {
  .tabbar .right {
    max-width: 0;
  }
}
</style>