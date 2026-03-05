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
$cyan-green: #67c23a; // 找回最初的生命力绿

.siteHeaderLogo {
  transition: 0.3s;
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 64px;
  cursor: pointer;
  // 关键：确保溢出内容可见
  overflow: visible;

  // 1. Logo 图片样式优化：去掉了生硬的方块，改用“悬浮感”设计
  .logo-wrapper {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .logo-inner {
      width: 32px;
      height: 32px;
      background: #fff;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba($primary-blue, 0.25);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .logo {
      width: 70%;
      height: 70%;
      object-fit: contain;
    }
  }

  // 2. 标题优化：找回最初的颜色，解决 y 遮挡
  .title {
    font-size: 20px;
    font-weight: 700;
    margin-left: 10px;
    white-space: nowrap;

    /* 解决 y 遮挡的核心：增加行高，并强制作为 inline-block 渲染 */
    line-height: 1.6;
    display: inline-block;
    padding-bottom: 2px; /* 给 y 的尾巴留出物理空间 */

    /* 找回最初好看的蓝绿渐变色 */
    background: linear-gradient(135deg, $deep-blue 0%, $cyan-green 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    /* 修正部分浏览器渲染 bug */
    -webkit-box-decoration-break: clone;
    box-decoration-break: clone;

    letter-spacing: 0.5px;
  }
}
.siteHeaderLogo-change {
  width: $base-menu-min-width;
}
.title-change {
  display: none !important;
}
</style>
