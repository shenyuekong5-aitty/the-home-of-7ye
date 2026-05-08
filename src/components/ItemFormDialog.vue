<!-- components/common/ItemFormDialog.vue -->
<template>
  <el-dialog :model-value="visible" :title="title" width="500px" @close="$emit('update:visible', false)">
    <el-form :model="form" label-width="80px">
      <el-form-item v-for="field in fields" :key="field.key" :label="field.label" :required="field.required">
        <el-input v-if="field.type === 'input'" v-model="form[field.key]" :placeholder="field.placeholder" />
        <el-input
          v-else-if="field.type === 'textarea'"
          v-model="form[field.key]"
          type="textarea"
          :rows="3"
          :placeholder="field.placeholder"
        />
      </el-form-item>

      <!-- 封面上传（可配置是否显示） -->
      <el-form-item v-if="showCover" label="封面">
        <div class="cover-area">
          <div v-if="form.coverImg" class="cover-preview">
            <img :src="form.coverImg" alt="封面预览" />
            <el-icon class="remove-cover" @click="form.coverImg = ''"><CircleClose /></el-icon>
          </div>
          <el-upload
            v-else
            class="cover-upload"
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleCoverChange"
            accept="image/*"
          >
            <el-button size="small" type="primary" plain>选择本地图片</el-button>
          </el-upload>
          <p class="upload-tip">支持 jpg/png，将转为 Base64 存储</p>
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确认</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue'
  import { CircleClose } from '@element-plus/icons-vue'

  interface FieldConfig {
    key: string
    label: string
    type: 'input' | 'textarea'
    placeholder?: string
    required?: boolean
  }

  const props = defineProps<{
    visible: boolean
    title: string
    fields: FieldConfig[]
    initialData?: Record<string, any> | null
    showCover?: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
    (e: 'confirm', data: Record<string, any>): void
  }>()

  const form = reactive<Record<string, any>>({ coverImg: '' })

  // 初始化表单数据（包含封面）
  watch(
    () => props.initialData,
    val => {
      if (val) {
        Object.keys(val).forEach(key => (form[key] = val[key]))
      } else {
        props.fields.forEach(f => (form[f.key] = ''))
        form.coverImg = ''
      }
    },
    { immediate: true }
  )

  const handleCoverChange = (file: any) => {
    const reader = new FileReader()
    reader.onload = e => {
      form.coverImg = e.target?.result as string
    }
    reader.readAsDataURL(file.raw)
  }

  const handleSubmit = () => {
    emit('confirm', { ...form })
  }
</script>
