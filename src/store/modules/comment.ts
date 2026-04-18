import { defineStore } from 'pinia'
import {
  reqGetCommentList,
  reqAddComment,
  reqUpdateComment,
  reqDeleteComment,
  reqLikeComment
} from '@/api/comment/index.ts'
import type {
  CommentItem,
  CommentListResponse,
  AddCommentParams,
  UpdateCommentParams,
  CommentOperationResponse,
  CommentActionResponse
} from '@/api/comment/type.ts'
import { ElMessage } from 'element-plus'

export const useCommentStore = defineStore('comment', {
  state: () => ({
    commentList: [] as CommentItem[],
    total: 0,
    pageNo: 1,
    pageSize: 10
  }),
  actions: {
    async getComments(pageNo: number = 1, pageSize: number = 10) {
      const res: CommentListResponse = await reqGetCommentList(pageNo, pageSize)
      if (res.code === 200) {
        this.commentList = res.data.items
        this.total = res.data.total
        this.pageNo = res.data.pageNo
        this.pageSize = res.data.pageSize
        return 'ok'
      } else {
        ElMessage.error(res.message || '获取评论列表失败')
        throw new Error(res.message || '获取评论列表失败')
      }
    },

    async addComment(params: AddCommentParams) {
      const res: CommentOperationResponse = await reqAddComment(params)
      if (res.code === 200) {
        await this.getComments(1, this.pageSize)
        ElMessage.success('发表成功')
        return 'ok'
      } else {
        ElMessage.error(res.message || '发表失败')
        throw new Error(res.message || '发表失败')
      }
    },

    async updateComment(id: number, params: UpdateCommentParams) {
      const res: CommentOperationResponse = await reqUpdateComment(id, params)
      if (res.code === 200) {
        await this.getComments(this.pageNo, this.pageSize)
        ElMessage.success('修改成功')
        return 'ok'
      } else {
        ElMessage.error(res.message || '修改失败')
        throw new Error(res.message || '修改失败')
      }
    },

    async deleteComment(id: number) {
      const res: CommentActionResponse = await reqDeleteComment(id)
      if (res.code === 200) {
        await this.getComments(this.pageNo, this.pageSize)
        ElMessage.success('删除成功')
        return 'ok'
      } else {
        ElMessage.error(res.message || '删除失败')
        throw new Error(res.message || '删除失败')
      }
    },

    async likeComment(id: number) {
      const res: CommentActionResponse = await reqLikeComment(id)
      if (res.code === 200) {
        const updateLike = (list: CommentItem[]) => {
          for (const item of list) {
            if (item.id === id) {
              item.likeCount++
              return true
            }
            if (item.children?.length) {
              if (updateLike(item.children)) return true
            }
          }
          return false
        }
        updateLike(this.commentList)
        ElMessage.success('点赞成功')
        return 'ok'
      } else {
        ElMessage.error(res.message || '点赞失败')
        throw new Error(res.message || '点赞失败')
      }
    },

    clearComments() {
      this.commentList = []
      this.total = 0
      this.pageNo = 1
    }
  }
})
