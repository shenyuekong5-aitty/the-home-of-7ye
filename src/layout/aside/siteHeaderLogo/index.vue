<template>
  <div
    class="siteHeaderLogo"
    :class="{ 'siteHeaderLogo-change': settingStore.isCollapse }"
  >
    <div class="logo-wrapper">
      <div class="logo-inner">
        <img :src="settings.logo" class="logo" />
      </div>
    </div>
    <span class="title" :class="{ 'title-change': settingStore.isCollapse }">{{
      settings.title
    }}</span>
  </div>
</template>

<script setup lang="ts">
import settings from '@/setting'
// 引入setting仓库
import { useSettingStore } from '@/store/modules/setting'
const settingStore = useSettingStore()
</script>

<style scoped lang="scss">
// 注意：如果 $base-menu-min-width 没生效，请确保你在 vite 配置或全局引入了变量文件
.siteHeaderLogo {
  transition: all 0.3s;
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 64px;
  cursor: pointer;
  overflow: hidden; // 建议改为 hidden，防止折叠时文字溢出

  .logo-wrapper {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    .logo-inner {
      width: 40px; // 修复了之前 45px 与容器 40px 的不一致
      height: 40px;
      // 使用动态浅色背景，让 Logo 容器也随主题变色
      background: var(--el-color-primary-light-9);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      // 动态边框
      border: 1px solid var(--el-color-primary-light-3);
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .logo {
      width: 65%;
      height: 65%;
      object-fit: contain;
    }
  }

  .title {
    font-size: 26px;
    font-weight: 700; // 加粗一点更有品牌感
    margin-left: 12px;
    white-space: nowrap;
    line-height: 1.5;
    display: inline-block;
    transition: all 0.3s;

    // 【核心修改】：接受主题色控制
    color: var(--el-color-primary);

    letter-spacing: 0.8px;
  }
}

// 折叠后的状态
.siteHeaderLogo-change {
  padding: 0 12px; // 折叠时稍微缩小间距
}

.title-change {
  // 使用透明度动画切换会比直接 none 更平滑，如果不要求动画则保留 none
  opacity: 0;
  display: none !important;
}
</style>
