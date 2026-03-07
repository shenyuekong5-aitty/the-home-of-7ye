<template>
  <el-dialog
    v-model="visible"
    title="修改密码"
    width="450px"
    @close="resetForm"
  >
    <el-form
      :model="form"
      ref="formRef"
      :rules="rules"
      label-width="100px"
      label-position="right"
      style="padding: 20px 20px 0 0"
    >
      <el-form-item label="旧密码" prop="password">
        <el-input
          v-model="form.password"
          placeholder="请输入原登录密码"
          show-password
        />
      </el-form-item>

      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="form.newPassword"
          placeholder="6-18位，不能与旧密码相同"
          show-password
        />
      </el-form-item>

      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="form.confirmPassword"
          placeholder="请再次输入新密码"
          show-password
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="submit">
          确认修改
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const visible = ref(false)
const loading = ref(false)
const formRef = ref()

// 1. 表单数据
const form = reactive({
  password: '',
  newPassword: '',
  confirmPassword: '' // 增加一个确认密码字段
})

// 2. 自定义校验逻辑：新密码不能等于旧密码
const validateNewPwd = (_rule: any, value: any, callback: any) => {
  if (value === form.password) {
    callback(new Error('新密码不能与原密码相同！'))
  } else {
    callback()
  }
}

// 3. 自定义校验逻辑：两次输入必须一致
const validateConfirmPwd = (_rule: any, value: any, callback: any) => {
  if (value !== form.newPassword) {
    callback(new Error('两次输入的密码不一致！'))
  } else {
    callback()
  }
}

// 4. 校验规则 (参考你的登录页逻辑)
const rules = reactive({
  password: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 18, message: '密码长度为6-18个字符', trigger: 'blur' },
    { validator: validateNewPwd, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: validateConfirmPwd, trigger: 'blur' }
  ]
})

// 暴露打开方法
const open = () => {
  visible.value = true
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
}

// 提交逻辑
const submit = async () => {
  // 1. 先进行表单校验
  try {
    await formRef.value.validate()
  } catch (err) {
    console.error(err)
    ElMessage.warning('请检查输入项')
    return // 校验不通过直接拦截
  }

  // 2. 校验通过，执行逻辑
  loading.value = true
  try {
    await userStore.changePassword({
      username: userStore.userInfo.username,
      password: form.password,
      newPassword: form.newPassword
    })

    ElMessage.success('密码修改成功，请重新登录')
    visible.value = false

    // 3. 退出登录
    await userStore.logout()
  } catch (error: any) {
    // 这里的 error 来源：changePassword 里的 Promise.reject
    ElMessage.error(error.message || '修改失败')
  } finally {
    loading.value = false
  }
}

defineExpose({ open })
</script>
