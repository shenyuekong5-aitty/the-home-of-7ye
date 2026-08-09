<template>
  <el-drawer
    v-model="drawerVisible"
    title="小烨的 AI 助手"
    :size="drawerSize"
    direction="rtl"
    :before-close="handleClose"
    :close-on-click-modal="true"
  >
    <div class="chat-container">
      <div class="message-list" ref="messageListRef">
        <div v-for="(msg, idx) in messages" :key="idx" :class="['message', msg.role === 'user' ? 'user' : 'assistant']">
          <div class="avatar">
            <el-avatar :size="36" :src="msg.role === 'user' ? userAvatar : botAvatar">
              {{ msg.role === 'user' ? userAvatarChar : 'AI' }}
            </el-avatar>
          </div>
          <div class="bubble">
            <div class="content" v-html="formatMessage(msg.content)"></div>
            <div class="time">{{ msg.time }}</div>
          </div>
        </div>
        <div v-if="loading" class="message assistant">
          <div class="avatar">
            <el-avatar :size="36" :src="botAvatar">AI</el-avatar>
          </div>
          <div class="bubble">
            <div class="content typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        <div ref="bottomRef" style="height: 1px"></div>
      </div>

      <div class="input-area">
        <el-input
          v-model="inputText"
          type="textarea"
          :rows="2"
          placeholder="输入你的问题... (Enter 发送)"
          @keydown.enter.prevent="sendMessage"
          @keydown.ctrl.enter.prevent="sendMessage"
          resize="none"
          :disabled="loading"
        />
        <el-button type="primary" :loading="loading" :disabled="!inputText.trim() || loading" @click="sendMessage">
          发送
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
  import { ref, watch, nextTick, computed } from 'vue'
  import { ElMessage } from 'element-plus'
  import { chatWithAI } from '@/api/ai'
  import { useUserStore } from '@/store/modules/user'

  const props = defineProps<{ visible: boolean }>()
  const emit = defineEmits<{ (e: 'update:visible', value: boolean): void }>()

  const userStore = useUserStore()

  const drawerVisible = ref(props.visible)
  const messages = ref<Array<{ role: 'user' | 'assistant'; content: string; time: string }>>([
    {
      role: 'assistant',
      content: '你好！我是小烨的 AI 助手，有什么可以帮你的吗？',
      time: new Date().toLocaleTimeString()
    }
  ])
  const inputText = ref('')
  const loading = ref(false)
  const sessionId = ref<string | null>(null)
  const messageListRef = ref<HTMLElement | null>(null)
  const bottomRef = ref<HTMLElement | null>(null)

  const userAvatar = computed(() => userStore.userInfo.avatar || '')
  const userAvatarChar = computed(() => userStore.userInfo.username?.charAt(0)?.toUpperCase() || '我')
  const botAvatar = '/assets/images/profile/ai.jpg'

  const drawerSize = computed(() => (window.innerWidth < 768 ? '100%' : '420px'))

  watch(
    () => props.visible,
    val => {
      drawerVisible.value = val
    }
  )
  watch(drawerVisible, val => {
    emit('update:visible', val)
  })

  const handleClose = (done: () => void) => {
    done()
  }

  const scrollToBottom = () => {
    nextTick(() => {
      bottomRef.value?.scrollIntoView({ behavior: 'smooth' })
    })
  }

  const formatMessage = (text: string) => text.replace(/\n/g, '<br>')

  const sendMessage = async () => {
    const text = inputText.value.trim()
    if (!text || loading.value) return

    messages.value.push({
      role: 'user',
      content: text,
      time: new Date().toLocaleTimeString()
    })
    inputText.value = ''
    scrollToBottom()

    loading.value = true
    try {
      const res = await chatWithAI({
        question: text,
        sessionId: sessionId.value
      })
      if (res.data?.sessionId) {
        sessionId.value = res.data.sessionId
      }
      messages.value.push({
        role: 'assistant',
        content: res.data?.answer || 'AI 未返回有效回答',
        time: new Date().toLocaleTimeString()
      })
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || 'AI 服务暂时不可用，请稍后再试'
      ElMessage.error(msg)
    } finally {
      loading.value = false
      scrollToBottom()
    }
  }

  watch(
    messages,
    () => {
      scrollToBottom()
    },
    { deep: true }
  )
</script>

<style scoped lang="scss">
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: #f7f9fc;
  }

  .message-list {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 16px;
    padding: 16px 12px;
    overflow-y: auto;
  }

  .message {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    max-width: 90%;

    &.user {
      flex-direction: row-reverse;
      align-self: flex-end;

      .bubble {
        color: #fff;
        background: #409eff;
        border-radius: 12px 12px 4px;
      }
    }

    &.assistant {
      align-self: flex-start;

      .bubble {
        color: #303133;
        background: #fff;
        border-radius: 12px 12px 12px 4px;
        box-shadow: 0 2px 8px rgb(0 0 0 / 6%);
      }
    }

    .avatar {
      flex-shrink: 0;
    }

    .bubble {
      max-width: 100%;
      padding: 10px 14px;
      font-size: 14px;
      line-height: 1.6;
      word-break: normal;
      overflow-wrap: anywhere;

      .time {
        margin-top: 4px;
        font-size: 11px;
        text-align: right;
        opacity: 0.6;
      }
    }
  }

  .typing {
    display: flex;
    gap: 4px;
    align-items: center;
    padding: 4px 0;

    span {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #909399;
      border-radius: 50%;
      animation: typing-bounce 1.4s infinite;

      &:nth-child(2) {
        animation-delay: 0.2s;
      }

      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }

  @keyframes typing-bounce {
    0%,
    60%,
    100% {
      opacity: 0.4;
      transform: translateY(0);
    }

    30% {
      opacity: 1;
      transform: translateY(-10px);
    }
  }

  .input-area {
    display: flex;
    gap: 10px;
    align-items: flex-end;
    padding: 12px 16px;
    background: #fff;
    border-top: 1px solid #e4e7ed;

    .el-textarea {
      flex: 1;
    }

    .el-button {
      flex-shrink: 0;
      height: 40px;
      padding: 0 20px;
    }
  }
</style>
