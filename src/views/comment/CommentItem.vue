<template>
  <div class="comment-item">
    <div class="comment-main">
      <el-avatar
        :size="40"
        :src="comment.avatar"
        class="user-avatar clickable"
        @click="emit('viewUser', comment.userId)"
      >
        {{ comment.username?.charAt(0).toUpperCase() }}
      </el-avatar>

      <div class="comment-content-wrapper">
        <div class="comment-meta">
          <span class="username clickable" @click="emit('viewUser', comment.userId)">
            {{ comment.nickname || comment.username }}
          </span>
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
          @view-user="emit('viewUser', $event)"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { ArrowDown } from '@element-plus/icons-vue'
  import dayjs from 'dayjs'
  import { useLikeStore } from '@/store/modules/like'
  import { ElMessage } from 'element-plus'

  const props = defineProps<{
    comment: any
    currentUserId?: number
    isAdmin: boolean
  }>()

  const emit = defineEmits(['reply', 'edit', 'delete', 'viewUser'])
  const likeStore = useLikeStore()
  const isExpanded = ref(false)
  const liked = ref(props.comment.liked || false)

  const canEdit = computed(() => {
    const commentUserId = Number(props.comment.userId)
    return props.isAdmin || commentUserId === props.currentUserId
  })

  const formatTime = (time: string) => dayjs(time).format('MM-DD HH:mm')

  const handleLike = async () => {
    if (liked.value === null) return

    const previousLiked = liked.value
    const targetLiked = !previousLiked // 期望变成的状态
    const previousCount = props.comment.likeCount

    // 1. 乐观更新 UI
    liked.value = targetLiked
    props.comment.likeCount += targetLiked ? 1 : -1

    try {
      const newLiked = await likeStore.toggleLike('comment', props.comment.id)
      // 2. 若后端返回状态与乐观不一致（极少发生），修正
      if (newLiked !== targetLiked) {
        liked.value = newLiked
        props.comment.likeCount = previousCount + (newLiked ? 1 : -1)
      }
      ElMessage.success(newLiked ? '点赞成功' : '已取消点赞')
    } catch (err: any) {
      // 3. 失败时完整回滚
      liked.value = previousLiked
      props.comment.likeCount = previousCount
      ElMessage.error(err.message || '操作失败')
    }
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
    padding-bottom: 12px;
    border-bottom: 1px solid #f2f2f2;
  }

  .comment-meta {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 6px;

    .username {
      font-size: 14px;
      font-weight: 600;
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
      display: flex;
      gap: 4px;
      align-items: center;
      font-size: 13px;
      color: #9499a0;
      cursor: pointer;

      &:hover {
        color: #00aeec;
      }

      &.active {
        color: #ffa500;
      }

      &.toggle-btn {
        font-weight: 500;
        color: #00aeec;
      }

      &.like.liked {
        color: #ffa500;
      }
    }
  }

  .sub-comments {
    padding: 0 12px;
    margin-top: 10px;
    margin-left: 50px;
    background: #f9f9f9;
    border-radius: 8px;

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

  /* 可点击样式 */
  .clickable {
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  .username.clickable:hover {
    color: #00aeec;
    text-decoration: underline;
  }
</style>
