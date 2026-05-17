<template>
  <div class="page-layout">
    <div class="comment-container">
      <div class="publish-section">
        <el-input v-model="newContent" type="textarea" :rows="3" placeholder="既然来了，留个脚印吧..." resize="none" />
        <div class="btn-group">
          <el-button type="primary" @click="handleAdd(null)">发表评论</el-button>
        </div>
      </div>

      <div class="list-header">全部评论 ({{ commentStore.total }})</div>

      <div class="comment-list" v-loading="loading">
        <CommentItem
          v-for="comment in commentStore.commentList"
          :key="comment.id"
          :comment="comment"
          :current-user-id="currentUserId"
          :is-admin="isAdmin"
          @reply="handleReply"
          @delete="handleDelete"
          @view-user="handleViewUser"
        />
        <el-empty v-if="!loading && commentStore.commentList.length === 0" description="暂无留言" />
      </div>

      <div class="pagination-footer">
        <el-pagination
          v-if="commentStore.total > 0"
          background
          v-model:current-page="commentStore.pageNo"
          :page-size="commentStore.pageSize"
          :total="commentStore.total"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <!-- <el-dialog v-model="dialogVisible" :title="editingId ? '编辑存档' : '回复消息'" width="480px"> -->
    <el-dialog v-model="dialogVisible" title="回复消息" width="480px">
      <el-input v-model="dialogContent" type="textarea" :rows="4" placeholder="输入内容..." />
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitDialog">确认提交</el-button>
      </template>
    </el-dialog>

    <UserInfoDrawer v-if="selectedUserId !== null" v-model="userDrawerVisible" :user-id="selectedUserId" />
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useCommentStore } from '@/store/modules/comment'
  import { useUserStore } from '@/store/modules/user'
  import CommentItem from '@/components/CommentItem.vue'
  import UserInfoDrawer from './UserInfoDrawer.vue'
  import { getWsUrl } from '@/utils/websocket'

  const props = defineProps<{
    targetType?: string
    targetId?: number
    allComments?: boolean
  }>()

  const commentStore = useCommentStore()
  const userStore = useUserStore()

  const loading = ref(false)
  const newContent = ref('')
  const dialogVisible = ref(false)
  const dialogContent = ref('')
  const replyParentId = ref<number | null>(null)
  const editingId = ref<number | null>(null)

  const userDrawerVisible = ref(false)
  const selectedUserId = ref<number | null>(null)

  const currentUserId = computed(() => userStore.userInfo.userid ?? 0)
  const isAdmin = computed(() => userStore.userInfo.role === 'admin') ?? false

  // WebSocket 连接实例
  let ws: WebSocket | null = null

  // 获取 token（根据实际 store 字段调整）
  const getToken = (): string | null => {
    return userStore.userInfo?.token || null
  }

  // 建立 WebSocket 连接
  const connectWebSocket = () => {
    const token = getToken()
    if (!token) {
      console.warn('未登录，无法连接 WebSocket')
      return
    }
    // 如果已有连接则先关闭
    if (ws) ws.close()

    ws = new WebSocket(getWsUrl('/ws', token))

    ws.onopen = () => {
      console.log('WebSocket 已连接')
    }

    ws.onmessage = (event: MessageEvent) => {
      try {
        const msg = JSON.parse(event.data)
        // 留言板场景：后端可能传 null，前端 props 是 undefined，所以需要宽松匹配
        if (msg.type === 'new_comment' && msg.targetType == props.targetType && msg.targetId == props.targetId) {
          commentStore.addRealtimeComment(msg.data)
        }
      } catch (err) {
        console.error('WebSocket 消息解析失败', err)
      }
    }

    ws.onerror = err => {
      console.error('WebSocket 连接错误', err)
    }

    ws.onclose = () => {
      console.log('WebSocket 已断开')
    }
  }

  // 断开连接
  const disconnectWebSocket = () => {
    if (ws) {
      ws.close()
      ws = null
    }
  }

  const fetchComments = async () => {
    loading.value = true
    try {
      if (props.targetType && props.targetId) {
        await commentStore.fetchComments(
          commentStore.pageNo,
          commentStore.pageSize,
          props.targetType,
          props.targetId,
          props.allComments ?? false
        )
      } else {
        await commentStore.fetchComments(commentStore.pageNo, commentStore.pageSize)
      }
    } finally {
      loading.value = false
    }
  }

  const handlePageChange = (page: number) => {
    commentStore.pageNo = page
    fetchComments()
  }

  const handleAdd = async (parentId: number | null) => {
    if (!newContent.value.trim()) return ElMessage.warning('内容不能为空')
    try {
      await commentStore.addComment({
        content: newContent.value,
        parentId: parentId ?? undefined,
        targetType: props.targetType,
        targetId: props.targetId
      })
      newContent.value = ''
      ElMessage.success('发表成功')
    } catch (err: any) {
      ElMessage.error(err.message || '未知错误')
    }
  }

  const handleReply = (id: number) => {
    replyParentId.value = id
    editingId.value = null
    dialogContent.value = ''
    dialogVisible.value = true
  }

  // const handleEdit = (comment: any) => {
  //   editingId.value = comment.id
  //   dialogContent.value = comment.content
  //   dialogVisible.value = true
  // }

  const handleDelete = (id: number) => {
    ElMessageBox.confirm('确定删除吗？', '提示', { type: 'warning' })
      .then(async () => {
        await commentStore.deleteComment(id)
        ElMessage.success('已删除')
      })
      .catch(() => {})
  }

  const handleViewUser = (userId: number) => {
    selectedUserId.value = userId
    userDrawerVisible.value = true
  }

  const submitDialog = async () => {
    if (!dialogContent.value.trim()) return ElMessage.warning('内容不能为空')
    try {
      if (editingId.value) {
        await commentStore.updateComment(editingId.value, { content: dialogContent.value })
      } else {
        await commentStore.addComment({
          content: dialogContent.value,
          parentId: replyParentId.value!,
          targetType: props.targetType,
          targetId: props.targetId
        })
      }
      dialogVisible.value = false
      ElMessage.success('操作成功')
    } catch {
      ElMessage.error('提交失败')
    }
  }

  // 当目标变化时重新获取评论并重连 WebSocket
  watch(
    () => [props.targetType, props.targetId],
    () => {
      if (props.targetType && props.targetId) {
        commentStore.pageNo = 1
        fetchComments()
        // 断开旧连接，建立新连接（因为目标变了）
        disconnectWebSocket()
        connectWebSocket()
      }
    },
    { immediate: true }
  )

  onMounted(() => {
    fetchComments()
    connectWebSocket()
  })

  onBeforeUnmount(() => {
    disconnectWebSocket()
  })
</script>

<style scoped lang="scss">
  .page-layout {
    padding: 20px;
  }

  .comment-container {
    max-width: 800px;
  }

  .publish-section {
    margin-bottom: 20px;
  }

  .btn-group {
    margin-top: 10px;
  }

  .list-header {
    margin-bottom: 15px;
    font-weight: bold;
  }

  .pagination-footer {
    margin-top: 20px;
  }
</style>
