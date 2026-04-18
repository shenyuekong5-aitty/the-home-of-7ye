<template>
  <div class="comment-item">
    <div class="comment-main">
      <el-avatar :size="40" :src="comment.avatar" class="user-avatar">
        {{ comment.username?.charAt(0).toUpperCase() }}
      </el-avatar>

      <div class="comment-content-wrapper">
        <div class="comment-meta">
          <span class="username">{{ comment.username }}</span>
          <span class="time">{{ formatTime(comment.createTime) }}</span>
        </div>

        <div class="comment-text">{{ comment.content }}</div>

        <div class="comment-actions">
          <span class="action-item like" :class="{ liked: liked }" @click="handleLike">
            <el-icon><Pointer /></el-icon>
            {{ comment.likeCount || '赞' }}
          </span>
          <span class="action-item" @click="emit('reply', comment.id)">回复</span>

          <span v-if="comment.children?.length" class="action-item toggle-btn" @click="isExpanded = !isExpanded">
            {{ isExpanded ? '收起' : `展开 ${comment.children.length} 条回复` }}
            <el-icon :class="{ 'is-rotated': isExpanded }"><ArrowDown /></el-icon>
          </span>

          <template v-if="canEdit">
            <span class="action-item" @click="emit('edit', { id: comment.id, content: comment.content })">编辑</span>
            <span class="action-item delete" @click="emit('delete', comment.id)">删除</span>
          </template>
        </div>
      </div>
    </div>

    <transition name="el-zoom-in-top">
      <div v-if="comment.children?.length && isExpanded" class="sub-comments">
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
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import dayjs from 'dayjs'

  const props = defineProps<{
    comment: any
    currentUserId?: number
    isAdmin: boolean
  }>()

  const emit = defineEmits(['reply', 'edit', 'delete', 'like'])
  const isExpanded = ref(false)
  const liked = ref(props.comment.liked || false)

  const canEdit = computed(() => {
    const commentUserId = Number(props.comment.userId)
    return props.isAdmin || commentUserId === props.currentUserId
  })

  const formatTime = (time: string) => dayjs(time).format('MM-DD HH:mm')

  const handleLike = async () => {
    if (liked.value) return
    liked.value = true
    emit('like', props.comment.id)
  }
</script>

<style scoped lang="scss">
  .comment-item {
    margin-top: 20px;
  }
  .comment-main {
    display: flex;
    gap: 12px;
  }
  .comment-content-wrapper {
    flex: 1;
    border-bottom: 1px solid #f2f2f2;
    padding-bottom: 12px;
  }
  .comment-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
    .username {
      font-weight: 600;
      font-size: 14px;
      color: #333;
    }
    .time {
      font-size: 12px;
      color: #999;
    }
  }
  .comment-text {
    font-size: 15px;
    line-height: 1.6;
    color: #222;
    word-break: break-all;
  }
  .comment-actions {
    display: flex;
    gap: 16px;
    margin-top: 8px;
    .action-item {
      font-size: 13px;
      color: #9499a0;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      &:hover {
        color: #00aeec;
      }
      &.active {
        color: #ffa500;
      }
      &.toggle-btn {
        color: #00aeec;
        font-weight: 500;
      }
      &.like.liked {
        color: #ffa500;
      }
    }
  }
  .sub-comments {
    margin-left: 50px;
    background: #f9f9f9;
    border-radius: 8px;
    padding: 0 12px;
    margin-top: 10px;
    :last-child .comment-content-wrapper {
      border-bottom: none;
    }
  }
  .el-icon {
    transition: transform 0.3s;
    &.is-rotated {
      transform: rotate(180deg);
    }
  }
</style>
