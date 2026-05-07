<template>
  <el-dialog v-model="visible" title="修改资料" width="420px" center @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="60px">
      <!-- 头像 -->
      <el-form-item label="头像">
        <div class="avatar-upload" @click="triggerFileInput">
          <input type="file" ref="fileInputRef" accept="image/*" style="display: none" @change="handleAvatarChange" />
          <img v-if="form.avatar" :src="form.avatar" class="avatar-preview" />
          <el-icon v-else class="avatar-placeholder"><Plus /></el-icon>
        </div>
        <span class="upload-tip">点击更换头像</span>
      </el-form-item>

      <!-- 昵称 -->
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" maxlength="20" placeholder="请输入新昵称" clearable />
      </el-form-item>

      <!-- 手机号 -->
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" maxlength="11" placeholder="请输入新手机号(原手机号无需修改此行)" clearable />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  import { ref, reactive, watch } from 'vue'
  import { ElMessage } from 'element-plus'
  import { Plus } from '@element-plus/icons-vue'
  import type { FormInstance, FormRules } from 'element-plus'
  import { useUserStore } from '@/store/modules/user'
  import { useCommentStore } from '@/store/modules/comment'

  const userStore = useUserStore()
  const commentStore = useCommentStore()
  const visible = ref(false)
  const loading = ref(false)
  const formRef = ref<FormInstance | null>(null)
  const fileInputRef = ref<HTMLInputElement | null>(null)

  const form = reactive({
    nickname: userStore.userInfo.nickname || '',
    avatar: userStore.userInfo.avatar || '',
    phone: userStore.userInfo.phone || ''
  })

  const rules: FormRules = {
    phone: [{ pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }]
  }

  // 打开弹窗时初始化表单
  watch(visible, val => {
    if (val) {
      form.nickname = userStore.userInfo.nickname || ''
      form.avatar = userStore.userInfo.avatar || ''
      form.phone = userStore.userInfo.phone || ''
    }
  })

  const triggerFileInput = () => {
    fileInputRef.value?.click()
  }

  const MAX_AVATAR_SIZE = 500 * 1024

  const handleAvatarChange = (event: Event) => {
    const input = event.target as HTMLInputElement
    const file = input.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      ElMessage.warning('请选择图片文件')
      input.value = ''
      return
    }
    if (file.size > MAX_AVATAR_SIZE) {
      ElMessage.warning(`头像大小不能超过 ${MAX_AVATAR_SIZE / 1024}KB`)
      input.value = ''
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      form.avatar = reader.result as string
    }
    reader.readAsDataURL(file)
    input.value = '' // 清空，保证再次选择同一文件也能触发 change
  }

  const handleSubmit = async () => {
    if (!formRef.value) return
    await formRef.value.validate(async (valid: boolean) => {
      if (!valid) return

      // 1. 检查是否有修改
      const isNicknameChanged = form.nickname !== (userStore.userInfo.nickname || '')
      const isAvatarChanged = form.avatar !== (userStore.userInfo.avatar || '')
      const isPhoneChanged = form.phone !== (userStore.userInfo.phone || '')

      if (!isNicknameChanged && !isAvatarChanged && !isPhoneChanged) {
        ElMessage.info('没有修改任何信息')
        return
      }

      // 2. 如果修改了手机号，则检查新手机号是否可用
      if (isPhoneChanged) {
        try {
          const exists = await userStore.checkPhone(form.phone)
          if (exists) {
            ElMessage.warning('该手机号已被其他用户使用')
            return
          }
        } catch (e: any) {
          ElMessage.error(e.message || '检查手机号失败')
          return
        }
      }

      // 3. 提交修改
      loading.value = true
      try {
        await userStore.updateProfile({
          nickname: form.nickname,
          avatar: form.avatar,
          phone: form.phone
        })
        ElMessage.success('资料更新成功')
        commentStore.getComments() // 刷新评论列表，更新头像和昵称
        visible.value = false
      } catch (e: any) {
        ElMessage.error(e.message || '更新失败')
      } finally {
        loading.value = false
      }
    })
  }

  const handleClose = () => {
    formRef.value?.resetFields()
  }

  defineExpose({
    open: () => {
      visible.value = true
    }
  })
</script>

<style scoped>
  .avatar-upload {
    width: 80px;
    height: 80px;
    border: 2px dashed #dcdfe6;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin: 0 auto;
    overflow: hidden;
  }
  .avatar-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
  .avatar-placeholder {
    font-size: 30px;
    color: #c0c4cc;
  }
  .upload-tip {
    display: block;
    text-align: center;
    font-size: 12px;
    color: #999;
    margin-top: 6px;
  }
</style>
