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
          {{ userStore.userInfo.username }}
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
              <el-dropdown-item>账号检测</el-dropdown-item>
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
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ArrowRight, ArrowDown, Message } from '@element-plus/icons-vue'
import { useSettingStore } from '@/store/modules/setting'
import { useRouteStore } from '@/store/modules/route'
import { useUserStore } from '@/store/modules/user'
import UpdatePassword from './UpdatePassword.vue'

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

// 1. 引入 ref (你已经引入了)
// 2. 创建一个名为 updatePasswordRef 的引用，名字要和模板里的 ref 对应
const updatePasswordRef = ref()

// 3. 定义点击“修改密码”时的处理函数
const changePassword = () => {
  // 调用子组件中通过 defineExpose 暴露出来的 open 方法
  updatePasswordRef.value?.open()
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
  height: $base-tabbar-height;
  box-sizing: border-box;

  .left {
    display: flex;
    align-items: center;
    padding-left: 10px;

    .icon {
      width: 18px;
      height: 18px;
      margin-right: 10px;
      cursor: pointer;
      transition: transform 0.3s;
      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .right {
    display: flex;
    align-items: center;
    padding-right: 20px;

    .setting {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-right: 20px;

      .el-button {
        width: 30px;
        height: 30px;
        margin-right: -14px;
        border-radius: 50%;
        .el-icon {
          font-size: 15px;
        }
      }
      :deep(.color-picker) {
        width: 28px;
        height: 28px;
        margin-left: 14px;
        .el-color-picker__trigger {
          width: 28px;
          height: 28px;
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
      margin-left: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      .temp-avatar {
        width: 30px;
        height: 30px;
        text-align: center;
        line-height: 30px;
        background-color: rgb(238, 211, 160);
        border-radius: 50%;
      }

      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        object-fit: cover;
      }

      span {
        font-size: 13px;
        color: #606266;
      }

      // 这里是解决黑色边框的核心逻辑
      .el-dropdown-link {
        display: flex;
        align-items: center;
        outline: none; // 彻底去掉聚焦轮廓
        border: none; // 确保没有边框
        &:focus {
          outline: none; // 强制覆盖浏览器默认行为
        }
      }

      &:hover {
        span {
          color: #409eff;
        }
      }
    }
  }
}

// 弹窗样式
.contact-content {
  padding: 10px 0;
  h3 {
    margin-bottom: 20px;
    font-weight: bold;
    font-size: 18px;
    border-left: 4px solid;
    padding-left: 10px;
  }
  .email-list {
    .email-item {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
      font-size: 14px;
      color: #666;
      .el-icon {
        font-size: 18px;
      }
      strong {
        color: #333;
        margin-left: 5px;
      }
    }
  }
}
</style>
