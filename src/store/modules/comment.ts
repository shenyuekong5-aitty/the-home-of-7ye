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
        throw new Error(res.message || '获取评论列表失败')
      }
    },

    async addComment(params: AddCommentParams) {
      const res: CommentOperationResponse = await reqAddComment(params)
      if (res.code === 200) {
        await this.getComments(1, this.pageSize)
        return 'ok'
      } else {
        throw new Error(res.message || '发表失败')
      }
    },

    // ✅ 新增：修改评论
    async updateComment(id: number, params: UpdateCommentParams) {
      const res: CommentOperationResponse = await reqUpdateComment(id, params)
      if (res.code === 200) {
        await this.getComments(this.pageNo, this.pageSize)
        return 'ok'
      } else {
        throw new Error(res.message || '修改失败')
      }
    },

    // ✅ 新增：删除评论
    async deleteComment(id: number) {
      const res: CommentActionResponse = await reqDeleteComment(id)
      if (res.code === 200) {
        await this.getComments(this.pageNo, this.pageSize)
        return 'ok'
      } else {
        throw new Error(res.message || '删除失败')
      }
    },

    // ✅ 新增：点赞
    async likeComment(id: number) {
      const res: CommentActionResponse = await reqLikeComment(id)
      if (res.code === 200) {
        // 局部更新点赞数（无需全量刷新列表）
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
        return 'ok'
      } else {
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
