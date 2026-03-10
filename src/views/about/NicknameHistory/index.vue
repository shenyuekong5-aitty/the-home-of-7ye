<template>
  <el-card class="nickname-card">
    <template #header>
      <div class="card-header">
        <span class="header-title">影之名册 · Nicknames</span>
      </div>
    </template>

    <div class="nickname-container">
      <div v-for="(name, index) in nicknameList" :key="index" class="name-tag">
        {{ name }}
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const nicknameList = ref([
  '空神月',
  '33',
  '同途',
  '7ye',
  '筱',
  '落九天',
  '九日言',
  '追神风',
  '夜郎紫',
  '穿越风',
  '玉门关',
  '不知火',
  'breeze',
  'Gemini',
  'beam',
  'Aitty',
  'AittyFlora',
  '烨烨子',
  '永轮同承·咒体·怨',
  '魏落樱',
  '问天·天与咒缚',
  '千烨',
  'yamanaiame',
  '夜千烨',
  '叶锦添',
  '踏前雪',
  '长眠',
  '长辞',
  '旧逢',
  '旧眠',
  '镜花',
  '夜梦雨',
  '夜修罗',
  '别时雨',
  '仙姬我妻',
  '秋风词',
  '萤火虫不见了',
  'tyi'
])
</script>

<style scoped lang="scss">
.nickname-card {
  height: 100%;
  border: 2px solid #000; // 漫画风粗边框
  box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.1); // 硬阴影

  :deep(.el-card__header) {
    border-bottom: 2px solid #000;
    padding: 10px 15px;
    background-color: #f9f9f9;
  }

  .header-title {
    font-weight: 900;
    font-size: 16px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
}

.nickname-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 5px;
  max-height: 280px; // 配合你的 modules 高度
  overflow-y: auto;

  // 自定义滚动条风格
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #000;
    border-radius: 2px;
  }

  .name-tag {
    padding: 4px 12px;
    font-size: 13px;
    color: #333;
    background: #fff;
    border: 1.5px solid #333;
    border-radius: 20px; // 胶囊形状
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
    font-family: 'Hiragino Sans GB', sans-serif;

    &:hover {
      background-color: #000; // 悬停反转色
      color: #fff;
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    // 模拟漫画中偶尔出现的强调标签
    &:nth-child(3n) {
      border-style: dashed; // 每三个出现一个虚线框
    }
  }
}
</style>
