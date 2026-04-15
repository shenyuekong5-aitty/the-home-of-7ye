import { defineStore } from 'pinia'
import { reqGetCommentList } from '@/api/comment/index.ts'
import type { CommentItem, CommentListResponse } from '@/api/comment/type.ts'

export const useCommentStore = defineStore('comment', {
  state: () => ({
    commentList: [] as CommentItem[],
    total: 0,
    pageNo: 1,
    pageSize: 10
  }),
  actions: {
    /**
     * 获取评论列表（树形结构）
     * @param pageNo 页码，默认1
     * @param pageSize 每页条数，默认10
     */
    async getComments(pageNo: number = 1, pageSize: number = 10) {
      const res: CommentListResponse = await reqGetCommentList(pageNo, pageSize)
      if (res.code === 200) {
        this.commentList = res.data.items
        this.total = res.data.total
        this.pageNo = res.data.pageNo
        this.pageSize = res.data.pageSize
        return 'ok'
      } else {
        throw new Error('获取评论列表失败')
      }
    },

    /**
     * 清空评论列表（可选）
     */
    clearComments() {
      this.commentList = []
      this.total = 0
      this.pageNo = 1
    }
  }
})
