<template>
  <div class="tabbar">
    <div class="left">
      <component :is="settingStore.isCollapse ? 'Fold' : 'Expand'" class="icon" @click="toggle"></component>
      <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item :to="{ path: '/' }" v-for="item in routeStore.matched" :key="item">
          {{ item }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="right">
      <div class="setting">
        <el-button circle icon="refresh" size="small" @click="settingStore.refresh"></el-button>
        <el-color-picker
          class="color-picker"
          v-model="settingStore.themeColor"
          :predefine="settingStore.predefineColors"
          @change="settingStore.setThemeColor"
        />
        <el-button circle icon="FullScreen" size="small" @click="handleFullScreen"></el-button>
      </div>
      <div class="userinfo">
        <!-- 已注销用户：强制显示默认头像 -->
        <img v-if="userStore?.userInfo?.isDeleted" src="/default-avatar.svg" class="temp-avatar" alt="已注销" />

        <!-- 正常有头像的用户 -->
        <img v-else-if="userStore?.userInfo?.avatar" :src="userStore.userInfo.avatar" alt="" />

        <!-- 没有设置头像的正常用户：显示首字母色块 -->
        <span v-else class="temp-avatar" :style="{ backgroundColor: settingStore.themeColor, color: '#fff' }">
          {{ userStore?.userInfo?.username?.charAt(0) || '无' }}
        </span>

        <!-- 用户名显示 -->
        <span v-if="userStore?.userInfo?.isDeleted">已注销用户</span>
        <span v-else-if="userStore?.userInfo?.username">{{ userStore.userInfo.username }}</span>
        <span v-else>无</span>

        <!-- 下拉菜单（已注销用户不显示更多选项） -->
        <el-dropdown v-if="!userStore?.userInfo?.isDeleted">
          <span class="el-dropdown-link">
            更多
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleCheck">账号检测</el-dropdown-item>
              <el-dropdown-item @click="editProfileRef?.open()">修改资料</el-dropdown-item>
              <el-dropdown-item @click="changePassword">修改密码</el-dropdown-item>
              <el-dropdown-item @click="userStore.logout">退出登录</el-dropdown-item>
              <el-dropdown-item divided @click="handleDeactivate">注销账号</el-dropdown-item>
              <el-dropdown-item @click="contactAdmin">联系站长</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <el-dialog v-model="dialogVisible" title="联系站长" width="400px" align-center>
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
            <el-icon :style="{ color: settingStore.themeColor }"><Message /></el-icon>
            <span>
              QQ:
              <strong>3316900024@qq.com</strong>
            </span>
          </div>
          <div class="email-item">
            <el-icon :style="{ color: settingStore.themeColor }"><Message /></el-icon>
            <span>
              Gmail:
              <strong>shenyuekong5@gmail.com</strong>
            </span>
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
    <EditProfile ref="editProfileRef" />
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
  import EditProfile from './EditProfile.vue'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  const settingStore = useSettingStore()
  const routeStore = useRouteStore()
  const userStore = useUserStore()

  const dialogVisible = ref(false)
  const editProfileRef = ref<InstanceType<typeof EditProfile>>()

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
  const handleDeactivate = () => {
    ElMessageBox.confirm('注销后，您的账号将被冻结，一个月内未重新激活将被永久删除。确定要继续吗？', '确认注销', {
      confirmButtonText: '确定注销',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        try {
          await userStore.deactivate()
          ElMessage.success('账号已注销')
          router.push('/login')
        } catch (e: any) {
          ElMessage.error(e.message || '注销失败')
        }
      })
      .catch(() => {})
  }
  onMounted(() => {
    settingStore.setThemeColor(settingStore.themeColor)
  })
</script>

<style scoped lang="scss">
  .tabbar {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: $base-tabbar-height; // 假设是60px
    margin: 0 10px;

    .left {
      display: flex;
      flex: 1; // 占据剩余空间
      gap: 14px;
      align-items: center;
      min-width: 0; // 允许收缩
      padding-left: 10px;

      .icon {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        cursor: pointer;
        transition: transform 0.6s ease;

        &:hover {
          transform: scale(1.1);
        }
      }

      // 面包屑容器：禁止换行、溢出省略
      :deep(.el-breadcrumb) {
        flex: 1; // 让面包屑填充剩余宽度
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      :deep(.el-breadcrumb__inner) {
        font-size: 24px;
        color: #606266;
      }

      :deep(.el-breadcrumb__item) {
        &:last-child {
          .el-breadcrumb__inner {
            font-weight: 500;
            color: #303133;
          }
        }
      }

      :deep(.el-breadcrumb__separator) {
        font-size: 15px;
      }
    }

    .right {
      display: flex;
      flex-shrink: 0; // 防止被压缩
      gap: 18px;
      align-items: center;
      max-width: 1000px; // 足够大，正常显示
      padding-right: 10px;
      overflow: hidden;
      white-space: nowrap;
      transition: max-width 0.4s ease; // 稍微延长过渡时间

      .setting {
        display: flex;
        flex-shrink: 0;
        gap: 10px;
        align-items: center;

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
            padding: 0;
            overflow: hidden;
            border: 1px solid #dcdfe6;
            border-radius: 50%;
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
        flex-shrink: 0;
        gap: 12px;
        align-items: center;
        cursor: pointer;

        .temp-avatar {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          font-size: 18px;
          line-height: 40px;
          text-align: center;
          border-radius: 50%;
        }

        img {
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 50%;
        }

        span {
          font-size: 20px;
          color: #606266;
          white-space: nowrap;
        }

        .el-dropdown-link {
          display: flex;
          gap: 5px;
          align-items: center;
          font-size: 18px;
          color: #606266;
          outline: none;
          border: none;

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
      padding-left: 12px;
      margin: 0 0 20px;
      font-size: 22px;
      font-weight: bold;
      line-height: 1.4;
      border-left: 4px solid;
    }

    .email-list {
      .email-item {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-bottom: 14px;
        font-size: 15px;
        line-height: 1.6;
        color: #666;

        .el-icon {
          flex-shrink: 0;
          font-size: 20px;
        }

        strong {
          margin-left: 5px;
          font-weight: 500;
          color: #333;
        }
      }
    }
  }

  // 媒体查询：小屏幕下右侧平滑隐藏
  @media screen and (width <= 868px) {
    .tabbar .right {
      max-width: 0;
    }
  }
</style>
