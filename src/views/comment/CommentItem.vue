<template>
  <div class="comment-item">
    <div class="comment-main">
      <el-avatar :size="36" :src="comment.avatar">
        {{ comment.username?.charAt(0).toUpperCase() }}
      </el-avatar>
      <div class="comment-content">
        <div class="comment-header">
          <span class="username">{{ comment.username }}</span>
          <span class="time">{{ formatTime(comment.createTime) }}</span>
        </div>
        <p class="text">{{ comment.content }}</p>
        <div class="actions">
          <el-button link size="small" @click="emit('like', comment.id)">
            <el-icon><Star /></el-icon>
            {{ comment.likeCount || '' }}
          </el-button>
          <el-button link size="small" @click="emit('reply', comment.id)">回复</el-button>
          <el-button
            v-if="canEdit"
            link
            size="small"
            @click="emit('edit', { id: comment.id, content: comment.content })"
          >
            编辑
          </el-button>
          <el-button v-if="canEdit" link size="small" @click="emit('delete', comment.id)">删除</el-button>
        </div>
      </div>
    </div>
    <!-- 子回复（楼中楼） -->
    <div v-if="comment.children?.length" class="sub-comments">
      <CommentItem
        v-for="child in comment.children"
        :key="child.id"
        :comment="child"
        :current-user-id="currentUserId"
        :is-admin="isAdmin"
        @reply="emit('reply', $event)"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
        @like="emit('like', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  /* eslint-disable no-unused-vars */
  import { computed } from 'vue'
  import { Star } from '@element-plus/icons-vue'
  import dayjs from 'dayjs'
  import type { CommentItem } from '@/api/comment/type'

  const props = defineProps<{
    comment: CommentItem
    currentUserId: number | null | undefined
    isAdmin: boolean
  }>()

  const emit = defineEmits<{
    (_event: 'reply', _id: number): void
    (_event: 'edit', _payload: { id: number; content: string }): void
    (_event: 'delete', _id: number): void
    (_event: 'like', _id: number): void
  }>()

  const canEdit = computed(() => {
    return props.isAdmin || props.comment.userId === props.currentUserId
  })

  const formatTime = (time: string) => {
    return dayjs(time).format('MM-DD HH:mm')
  }
</script>

<style scoped>
  .comment-item {
    margin-bottom: 16px;
  }
  .comment-main {
    display: flex;
    gap: 12px;
  }
  .comment-content {
    flex: 1;
  }
  .comment-header {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin-bottom: 6px;
  }
  .username {
    font-weight: bold;
    color: #333;
  }
  .time {
    font-size: 12px;
    color: #999;
  }
  .text {
    margin: 0 0 8px;
    color: #555;
  }
  .actions {
    display: flex;
    gap: 12px;
  }
  .sub-comments {
    margin-left: 48px;
    margin-top: 12px;
    padding-left: 12px;
    border-left: 2px dashed #eee;
  }
</style>
