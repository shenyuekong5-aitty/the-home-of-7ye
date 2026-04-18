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
          @edit="handleEdit"
          @delete="handleDelete"
          @like="handleLike"
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

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑存档' : '回复消息'" width="480px">
      <el-input v-model="dialogContent" type="textarea" :rows="4" placeholder="输入内容..." />
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitDialog">确认提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useCommentStore } from '@/store/modules/comment'
  import { useUserStore } from '@/store/modules/user'
  import { useNoticeStore } from '@/store/modules/notice'
  import CommentItem from './CommentItem.vue'

  const commentStore = useCommentStore()
  const userStore = useUserStore()
  const noticeStore = useNoticeStore()

  const loading = ref(false)
  const newContent = ref('')
  const dialogVisible = ref(false)
  const dialogContent = ref('')
  const replyParentId = ref<number | null>(null)
  const editingId = ref<number | null>(null)

  const currentUserId = computed(() => userStore.userInfo.userid ?? 0)
  const isAdmin = computed(() => userStore.userInfo.roles?.includes('admin') ?? false)

  // --- 核心方法实现 ---

  const fetchComments = async () => {
    loading.value = true
    try {
      await commentStore.getComments(commentStore.pageNo, commentStore.pageSize)
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
      await commentStore.addComment({ content: newContent.value, parentId: parentId ?? undefined })
      newContent.value = ''
      ElMessage.success('发表成功')
    } catch {
      ElMessage.error(err.message)
    }
  }

  const handleReply = (id: number) => {
    replyParentId.value = id
    editingId.value = null
    dialogContent.value = ''
    dialogVisible.value = true
  }

  const handleEdit = (comment: any) => {
    editingId.value = comment.id
    dialogContent.value = comment.content
    dialogVisible.value = true
  }

  const handleDelete = (id: number) => {
    ElMessageBox.confirm('确定删除吗？', '提示', { type: 'warning' })
      .then(async () => {
        await commentStore.deleteComment(id)
        ElMessage.success('已删除')
      })
      .catch(() => {})
  }

  const handleLike = async (id: number) => {
    try {
      await commentStore.likeComment(id)
    } catch {
      ElMessage.error('点赞失败')
    }
  }

  const submitDialog = async () => {
    if (!dialogContent.value.trim()) return ElMessage.warning('内容不能为空')
    try {
      if (editingId.value) {
        await commentStore.updateComment(editingId.value, { content: dialogContent.value })
      } else {
        await commentStore.addComment({ content: dialogContent.value, parentId: replyParentId.value! })
      }
      dialogVisible.value = false
      ElMessage.success('操作成功')
    } catch {
      ElMessage.error('提交失败')
    }
  }

  onMounted(() => {
    fetchComments()
    noticeStore.getNoticeList()
  })
</script>

<style scoped lang="scss">
  .page-layout {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 30px;
    padding: 30px;
    margin: 0; // 靠左
    @media (max-width: 992px) {
      flex-direction: column;
      padding: 15px;
    }
  }

  .comment-container {
    flex: 1;
    max-width: 850px;
    min-width: 0;
    .btn-group {
      margin: 10px 0;
    }
  }
</style>
