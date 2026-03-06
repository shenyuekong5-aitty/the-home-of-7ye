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
        <el-button circle icon="refresh" size="small"></el-button>
        <el-button circle icon="FullScreen" size="small"></el-button>
        <el-button circle icon="setting" size="small"></el-button>
      </div>
      <div class="userinfo">
        <img :src="userStore.userInfo.avatar" alt="" />
        <span>{{ userStore.userInfo.username }}</span>
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
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item>退出登录</el-dropdown-item>
              <el-dropdown-item divided>联系站长</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 这里写 TypeScript 代码
// 引入路由
// 引入elemnt-plus 图标
import { ArrowRight } from '@element-plus/icons-vue'
// 引入 setting 仓库
import { useSettingStore } from '@/store/modules/setting'
// 引入 route 仓库
import { useRouteStore } from '@/store/modules/route'
// 引入用户仓库
import { useUserStore } from '@/store/modules/user'
// 设置配置
const settingStore = useSettingStore()
// 路由配置
const routeStore = useRouteStore()
// 用户仓库
const userStore = useUserStore()

const toggle = () => {
  settingStore.isCollapse = !settingStore.isCollapse
}
</script>

<style scoped lang="scss">
.tabbar {
  margin: 0 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: $base-tabbar-height;

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
    }

    .userinfo {
      margin-left: 10px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;

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

      &:hover {
        span {
          color: #409eff;
        }
      }
    }
  }
}

.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
