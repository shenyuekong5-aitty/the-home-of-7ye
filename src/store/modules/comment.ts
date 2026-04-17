import { defineStore } from 'pinia'
import { reqGetCommentList, reqAddComment } from '@/api/comment/index.ts'
import type {
  CommentItem,
  CommentListResponse,
  AddCommentParams,
  CommentOperationResponse
} from '@/api/comment/type.ts'

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
      console.log(666)

      const res: CommentListResponse = await reqGetCommentList(pageNo, pageSize)
      if (res.code === 200) {
        this.commentList = res.data.items
        this.total = res.data.total
        this.pageNo = res.data.pageNo
        this.pageSize = res.data.pageSize
        return 'ok'
      } else {
        console.log(404)

        throw new Error('获取评论列表失败')
      }
    },
    /**
     * 发表评论
     * @param params { content: string, parentId?: number }
     */
    async addComment(params: AddCommentParams) {
      try {
        const res: CommentOperationResponse = await reqAddComment(params)
        if (res.code === 200) {
          // 方式一：直接刷新列表，确保分页和树形结构同步（最稳妥）
          await this.getComments(1, this.pageSize)

          /* // 方式二：如果是追求极致体验，可以手动 unshift 到列表（仅限顶级评论）
        if (!params.parentId) {
          this.commentList.unshift(res.data)
        } 
        */

          return 'ok'
        } else {
          return Promise.reject(new Error(res.message || '发表失败'))
        }
      } catch (error) {
        return Promise.reject(error)
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
