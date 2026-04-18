<template>
  <div class="comment-module">
    <!-- 发表顶级评论 -->
    <div class="post-comment">
      <el-input v-model="newContent" type="textarea" :rows="2" placeholder="写下你的留言..." resize="none" />
      <el-button type="primary" @click="handleAdd(null)">发送</el-button>
    </div>

    <!-- 评论列表（树形渲染） -->
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

    <!-- 分页 -->
    <el-pagination
      v-if="commentStore.total > 0"
      v-model:current-page="commentStore.pageNo"
      :page-size="commentStore.pageSize"
      :total="commentStore.total"
      layout="prev, pager, next"
      @current-change="handlePageChange"
    />

    <!-- 回复/编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑留言' : '回复留言'" width="400px" @closed="resetDialog">
      <el-input
        v-model="dialogContent"
        type="textarea"
        :rows="3"
        :placeholder="editingId ? '修改你的留言' : '写下回复...'"
      />
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitDialog">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted } from 'vue'
  import { useCommentStore } from '@/store/modules/comment'
  import { useUserStore } from '@/store/modules/user'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import CommentItem from './CommentItem.vue' // 递归子组件

  const commentStore = useCommentStore()
  const userStore = useUserStore()

  const loading = ref(false)
  const newContent = ref('')

  // 当前用户信息（用于权限判断）
  const currentUserId = computed(() => userStore.userInfo.userid)
  const isAdmin = computed(() => userStore.userInfo.roles?.includes('admin'))

  // 弹窗状态
  const dialogVisible = ref(false)
  const dialogContent = ref('')
  const replyParentId = ref<number | null>(null)
  const editingId = ref<number | null>(null)

  const fetchComments = async () => {
    loading.value = true
    try {
      await commentStore.getComments(commentStore.pageNo, commentStore.pageSize)
    } catch (err: any) {
      ElMessage.error(err.message || '加载留言失败')
    } finally {
      loading.value = false
    }
  }

  const handlePageChange = (page: number) => {
    commentStore.pageNo = page
    fetchComments()
  }

  // 发表顶级评论
  const handleAdd = async (parentId: number | null) => {
    if (!newContent.value.trim()) {
      ElMessage.warning('内容不能为空')
      return
    }
    try {
      await commentStore.addComment({ content: newContent.value, parentId: parentId ?? undefined })
      newContent.value = ''
      ElMessage.success(parentId ? '回复成功' : '留言成功')
    } catch (err: any) {
      ElMessage.error(err.message || '操作失败')
    }
  }

  // 点击回复
  const handleReply = (commentId: number) => {
    replyParentId.value = commentId
    editingId.value = null
    dialogContent.value = ''
    dialogVisible.value = true
  }

  // 点击编辑
  const handleEdit = (comment: { id: number; content: string }) => {
    editingId.value = comment.id
    replyParentId.value = null
    dialogContent.value = comment.content
    dialogVisible.value = true
  }

  // 提交弹窗（回复或编辑）
  const submitDialog = async () => {
    if (!dialogContent.value.trim()) {
      ElMessage.warning('内容不能为空')
      return
    }
    try {
      if (editingId.value) {
        await commentStore.updateComment(editingId.value, { content: dialogContent.value })
        ElMessage.success('修改成功')
      } else {
        await commentStore.addComment({ content: dialogContent.value, parentId: replyParentId.value! })
        ElMessage.success('回复成功')
      }
      dialogVisible.value = false
    } catch (err: any) {
      ElMessage.error(err.message || '操作失败')
    }
  }

  // 删除
  const handleDelete = async (id: number) => {
    ElMessageBox.confirm('确定要删除这条留言吗？', '提示', { type: 'warning' })
      .then(async () => {
        await commentStore.deleteComment(id)
        ElMessage.success('已删除')
      })
      .catch(() => {})
  }

  // 点赞
  const handleLike = async (id: number) => {
    try {
      await commentStore.likeComment(id)
    } catch (err: any) {
      ElMessage.error(err.message || '点赞失败')
    }
  }

  const resetDialog = () => {
    dialogContent.value = ''
    replyParentId.value = null
    editingId.value = null
  }

  onMounted(() => {
    fetchComments()
  })
</script>

<style scoped>
  .comment-module {
    padding: 20px;
  }
  .post-comment {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  .comment-list {
    margin-bottom: 20px;
  }
</style>
