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
$primary-blue: #409eff;
$deep-blue: #1890ff;

.siteHeaderLogo {
  transition: 0.3s;
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 64px;
  cursor: pointer;
  overflow: visible;

  // Logo 区域简约设计
  .logo-wrapper {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .logo-inner {
      width: 45px;
      height: 40px;
      background: linear-gradient(135deg, #e8f4ff 0%, #f0f7ff 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba($primary-blue, 0.15);
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.08);
    }

    .logo {
      width: 65%;
      height: 65%;
      object-fit: contain;
    }
  }

  // 标题样式
  .title {
    font-size: 18px;
    font-weight: 600;
    margin-left: 12px;
    white-space: nowrap;
    line-height: 1.5;
    display: inline-block;
    color: $deep-blue;
    letter-spacing: 0.8px;
  }
}
.siteHeaderLogo-change {
  width: $base-menu-min-width;
}
.title-change {
  display: none !important;
}
</style>
