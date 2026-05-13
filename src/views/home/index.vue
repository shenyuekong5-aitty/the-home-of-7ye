<template>
  <div class="container">
    <div class="top">
      <p class="welcome" v-if="userStore.userInfo.nickname">{{ userStore.userInfo.nickname }} {{ getPeriod() }}</p>
      <p class="welcome" v-else>{{ userStore.userInfo.username }} {{ getPeriod() }}</p>
    </div>
    <div class="bottom">
      <div class="left">
        <div class="modules">
          <el-card class="card-item notice-card">
            <template #header>
              <div class="notice-header">
                <span class="header-title">
                  <el-icon><Notification /></el-icon>
                  系统公告
                </span>
                <el-link underline="never" type="primary" title="有问题？联系站长：QQ 3316900024" class="more-link">
                  公告
                </el-link>
              </div>
            </template>

            <div class="notice-list-container">
              <ul v-if="noticeStore.list.length > 0" class="notice-list">
                <li
                  v-for="notice in noticeStore.list"
                  :key="notice.id"
                  class="notice-item"
                  :class="{ 'is-top': notice.isImportant }"
                  @click="showDetail(notice)"
                >
                  <div class="notice-content-box">
                    <el-tag v-if="notice.isImportant" size="small" effect="dark" class="top-tag">置顶</el-tag>
                    <span class="notice-title">{{ notice.title }}</span>
                  </div>
                  <span class="notice-time">{{ dayjs(notice.publishTime).format('MM-DD') }}</span>
                  <!-- 管理员悬浮操作按钮 -->
                  <div v-if="isAdmin" class="notice-actions" @click.stop>
                    <el-button link size="small" @click.stop="openEditDialog(notice)">
                      <el-icon><Edit /></el-icon>
                    </el-button>
                    <el-button link size="small" @click.stop="handleDeleteNotice(notice.id)">
                      <el-icon><Delete /></el-icon>
                    </el-button>
                  </div>
                </li>
              </ul>
              <el-empty v-else :image-size="60" description="暂无公告" />
            </div>
          </el-card>
          <el-card class="card-item comment-card">
            <!-- 省略不变的留言卡片部分... -->
            <template #header>
              <div class="notice-header">
                <span class="header-title">
                  <el-icon><ChatDotSquare /></el-icon>
                  最近留言
                </span>
                <el-link underline="never" type="success" class="more-link">看板</el-link>
              </div>
            </template>
            <div class="notice-list-container">
              <ul v-if="commentStore.commentList.length > 0" class="common-list">
                <li v-for="comment in commentStore.commentList.slice(0, 5)" :key="comment.id" class="comment-item">
                  <el-avatar :size="28" :src="comment.avatar" class="manga-avatar">
                    {{ comment.username?.charAt(0).toUpperCase() }}
                  </el-avatar>
                  <div class="comment-body">
                    <div class="comment-meta">
                      <span class="user-name" v-if="comment.nickname">{{ comment.nickname }}</span>
                      <span class="user-name" v-else>{{ comment.username }}</span>
                      <span class="item-time">{{ dayjs(comment.createTime).format('MM-DD') }}</span>
                    </div>
                    <p class="comment-text" :title="comment.content">{{ comment.content }}</p>
                  </div>
                </li>
              </ul>
              <el-empty v-else :image-size="40" description="虚位以待" />
            </div>
          </el-card>
          <el-card class="card-item quick-actions-card" shadow="never">
            <template #header>
              <div class="notice-header">
                <span class="header-title">
                  <el-icon><Operation /></el-icon>
                  快捷入口
                </span>
                <el-link underline="never" type="primary" class="more-link">管理</el-link>
              </div>
            </template>

            <div class="quick-actions">
              <div class="action-btn" v-permission="'admin'" @click="handlePublishNotice">
                <div class="icon-wrapper blue">
                  <el-icon><Bell /></el-icon>
                </div>
                <span class="btn-text">发布公告</span>
                <el-icon class="arrow-icon"><ArrowRight /></el-icon>
              </div>

              <div class="action-btn" v-permission="'admin'" @click="handleApproveRecommendations">
                <div class="icon-wrapper orange">
                  <el-icon><DocumentChecked /></el-icon>
                </div>
                <span class="btn-text">审批推荐</span>
                <el-icon class="arrow-icon"><ArrowRight /></el-icon>
              </div>

              <div class="action-btn" @click="handleMyFavorites">
                <div class="icon-wrapper purple">
                  <el-icon><Star /></el-icon>
                </div>
                <span class="btn-text">我的收藏</span>
                <el-icon class="arrow-icon"><ArrowRight /></el-icon>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 自我介绍模块 (保持不变) -->
        <div class="intro-wrapper">
          <el-card class="intro-card">
            <template #header>
              <div class="intro-header">
                <span class="header-title">
                  <el-icon><User /></el-icon>
                  关于本站
                </span>
              </div>
            </template>
            <div class="intro-content">
              <div class="intro-text">
                <h3 class="intro-name">{{ currentMotto }}</h3>
                <div class="intro-tags">
                  <el-tag size="small" effect="plain" round>Vue3</el-tag>
                  <el-tag size="small" effect="plain" round>TypeScript</el-tag>
                  <el-tag size="small" effect="plain" round>Element Plus</el-tag>
                  <el-tag size="small" effect="plain" round>JAVA</el-tag>
                  <el-tag size="small" effect="plain" round>Spring boot4</el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </div>

        <div class="time">
          <!-- 倒计时区域，保持不变 -->
          <el-row :gutter="16" class="countdown-wrapper">
            <el-col :xs="24" :sm="12" :md="8" class="text-center mb-4">
              <div class="countdown-card">
                <el-countdown title="距离今晚 (18:00) 还有" :value="eveningTime" />
                <div class="countdown-footer">
                  <span class="manga-text">日落而息 · 静候星辰</span>
                </div>
              </div>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" class="text-center mb-4">
              <div class="countdown-card highlight">
                <el-countdown
                  :title="`距离 [${nextHoliday.name}] 放假还有`"
                  format="DD [天] HH:mm:ss"
                  :value="nextHoliday.date.valueOf()"
                />
                <div class="countdown-footer">
                  <el-tag size="small" effect="plain" round>法定节假日</el-tag>
                </div>
              </div>
            </el-col>

            <el-col :xs="24" :sm="12" :md="8" class="text-center mb-4">
              <div class="countdown-card">
                <el-countdown format="DD [天] HH:mm:ss" :value="nextMonthValue.valueOf()">
                  <template #title>
                    <div style="display: inline-flex; align-items: center">
                      <el-icon style="margin-right: 4px" :size="14"><Calendar /></el-icon>
                      距离下个月月初
                    </div>
                  </template>
                </el-countdown>
                <div class="countdown-footer">
                  {{ nextMonthValue.format('YYYY-MM-DD') }}
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>

      <div class="right" ref="rightRef">
        <!-- 轮播图保持不变 -->
        <el-carousel height="100%" autoplay arrow="always">
          <el-carousel-item v-for="(img, index) in imgList" :key="index">
            <div class="glass-wrapper">
              <div class="blur-bg" :style="{ backgroundImage: `url(${img})` }"></div>
              <img :src="img" class="main-img" alt="" />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>

    <!-- 公告详情弹窗 -->
    <el-dialog v-model="dialogVisible" :title="selectedNotice?.title" width="500" class="manga-dialog" align-center>
      <div class="notice-detail" v-if="selectedNotice">
        <div class="detail-meta">
          <el-tag size="small" effect="plain">{{ selectedNotice.publisher }}</el-tag>
          <span class="detail-time">发布于：{{ selectedNotice.publishTime }}</span>
        </div>
        <el-divider>
          <el-icon><Reading /></el-icon>
        </el-divider>
        <div class="detail-content">{{ selectedNotice.content }}</div>
      </div>
    </el-dialog>

    <!-- 发布/编辑公告弹窗 -->
    <el-dialog
      v-model="publishDialogVisible"
      :title="editingNoticeId ? '编辑公告' : '发布公告'"
      width="500px"
      class="manga-dialog"
    >
      <el-form :model="publishForm" label-width="80px">
        <el-form-item label="标题" required>
          <el-input v-model="publishForm.title" placeholder="请输入公告标题" />
        </el-form-item>
        <el-form-item label="内容" required>
          <el-input v-model="publishForm.content" type="textarea" :rows="4" placeholder="请输入公告内容" />
        </el-form-item>
        <el-form-item label="置顶">
          <el-switch v-model="publishForm.isImportant" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="publishDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitPublish">{{ editingNoticeId ? '保存修改' : '发布' }}</el-button>
      </template>
    </el-dialog>

    <!-- 所有推荐查看弹窗 (保持不变) -->
    <el-dialog v-model="approvedDialogVisible" title="所有推荐记录" width="900px" class="comic-dialog">
      <el-table :data="recommendationList" style="width: 100%" v-loading="loading">
        <el-table-column prop="type" label="类型" width="80">
          <template #default="{ row }">
            <el-tag :type="row.type === 'book' ? 'primary' : row.type === 'music' ? 'success' : 'warning'">
              {{ row.type === 'book' ? '书籍' : row.type === 'music' ? '音乐' : '番剧' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="详情" width="240">
          <template #default="{ row }">
            <template v-if="row.type === 'book'">
              <div style="display: flex; gap: 8px; align-items: center">
                <img :src="row.content.cover" style="width: 40px; height: 50px; object-fit: cover" />
                <div>
                  <div>{{ row.content.bookName }}</div>
                  <div style="font-size: 12px; color: #666">{{ row.content.author }}</div>
                </div>
              </div>
            </template>
            <template v-else-if="row.type === 'music'">
              <div>
                <div>{{ row.content.name }}</div>
                <div style="font-size: 12px; color: #666">{{ row.content.author }}</div>
              </div>
            </template>
            <template v-else-if="row.type === 'anime'">
              <div style="display: flex; gap: 8px; align-items: center">
                <img :src="row.content.coverImg" style="width: 40px; height: 50px; object-fit: cover" />
                <div>
                  <div>{{ row.content.name }}</div>
                  <div style="font-size: 12px; color: #666">{{ row.content.author }}</div>
                </div>
              </div>
            </template>
            <template v-else>
              <span style="color: #999">未知类型</span>
            </template>
          </template>
        </el-table-column>

        <el-table-column prop="proposerName" label="推荐人" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'approved' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'">
              {{ row.status === 'approved' ? '已通过' : row.status === 'pending' ? '待审核' : '已拒绝' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="提交时间" width="160" />

        <el-table-column label="操作" width="120" v-if="isAdmin">
          <template #default="{ row }">
            <div v-if="row.status === 'pending'" style="display: flex; gap: 5px">
              <el-button size="small" type="success" @click="handleApprove(row.id)">通过</el-button>
              <el-button size="small" type="danger" @click="handleReject(row.id)">拒绝</el-button>
            </div>
            <span v-else style="color: #999">—</span>
          </template>
        </el-table-column>

        <template #empty>
          <div style="padding: 20px; text-align: center">暂无推荐记录</div>
        </template>
      </el-table>
      <template #footer>
        <el-button class="comic-btn cancel-btn" @click="approvedDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 我的收藏弹窗 -->
    <el-dialog v-model="favoriteVisible" title="我的收藏" width="600px" class="manga-dialog">
      <div v-loading="favoriteLoading">
        <el-empty v-if="favoriteList.length === 0 && !favoriteLoading" description="你还没有收藏任何内容哦" />
        <div v-else class="favorite-list">
          <div v-for="item in favoriteList" :key="item.id" class="favorite-item">
            <div class="fav-type">
              <el-tag
                size="small"
                :type="item.targetType === 'emotion' ? 'warning' : item.targetType === 'quote' ? 'info' : ''"
              >
                {{ item.targetType === 'emotion' ? '情绪' : item.targetType === 'quote' ? '名言' : item.targetType }}
              </el-tag>
            </div>
            <div class="fav-content">
              <div class="fav-title">{{ item.title }}</div>
              <div class="fav-brief">{{ item.brief }}</div>
            </div>
            <div class="fav-time">{{ item.createTime?.slice(0, 10) }}</div>
          </div>
        </div>
        <div class="pagination-footer" v-if="favoriteTotal > 10">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="favoriteTotal"
            :page-size="10"
            @current-change="handleFavoritePageChange"
          />
        </div>
      </div>
      <template #footer>
        <el-button @click="favoriteVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { onMounted, onUnmounted, computed, ref, reactive } from 'vue'
  import { getPeriod } from '@/utils/time'
  import { useUserStore } from '@/store/modules/user'
  import { useNoticeStore } from '@/store/modules/notice'
  import { useCommentStore } from '@/store/modules/comment'
  import { useRecommendationStore } from '@/store/modules/recommendation'
  import dayjs from 'dayjs'
  import { getNextHoliday } from '@/utils/holiday'
  import { Edit, Delete } from '@element-plus/icons-vue'

  import type { NoticeItem } from '@/api/notice/type'

  import { useFavoriteStore } from '@/store/modules/favorite'
  import type { FavoriteItem } from '@/api/favorite/type'

  import imgC1 from '../../../assets/images/home/C1.png'
  import imgC2 from '../../../assets/images/home/C2.png'
  import imgC3 from '../../../assets/images/home/C3.png'
  import imgC4 from '../../../assets/images/home/C4.png'
  const imgList = [imgC1, imgC2, imgC3, imgC4]

  const userStore = useUserStore()
  const noticeStore = useNoticeStore()
  const commentStore = useCommentStore()
  const recommendationStore = useRecommendationStore()
  const favoriteStore = useFavoriteStore()

  const isAdmin = computed(() => userStore.userInfo.role === 'admin')

  const dialogVisible = ref(false)
  const selectedNotice = ref<NoticeItem | null>(null)

  const approvedDialogVisible = ref(false)
  const recommendationList = ref<any[]>([])
  const loading = ref(false)

  // ========== 公告发布/编辑弹窗 ==========
  const publishDialogVisible = ref(false)
  const editingNoticeId = ref<number | null>(null)
  const publishForm = reactive({
    title: '',
    content: '',
    isImportant: false
  })

  // 打开新增公告弹窗
  const handlePublishNotice = () => {
    editingNoticeId.value = null
    publishForm.title = ''
    publishForm.content = ''
    publishForm.isImportant = false
    publishDialogVisible.value = true
  }

  // 打开编辑公告弹窗
  const openEditDialog = (notice: NoticeItem) => {
    editingNoticeId.value = notice.id
    publishForm.title = notice.title
    publishForm.content = notice.content
    publishForm.isImportant = notice.isImportant
    publishDialogVisible.value = true
  }

  // 提交发布/编辑
  const submitPublish = async () => {
    if (!publishForm.title.trim()) {
      ElMessage.warning('公告标题不能为空')
      return
    }
    if (!publishForm.content.trim()) {
      ElMessage.warning('公告内容不能为空')
      return
    }
    try {
      if (editingNoticeId.value) {
        await noticeStore.updateNotice(editingNoticeId.value, { ...publishForm })
        editingNoticeId.value = null
      } else {
        await noticeStore.addNotice({ ...publishForm })
      }
      publishDialogVisible.value = false
    } catch {
      // store 中已处理错误提示
    }
  }

  // 删除公告
  const handleDeleteNotice = (id: number) => {
    ElMessageBox.confirm('确定要删除这条公告吗？', '警告', { type: 'warning' })
      .then(async () => {
        await noticeStore.deleteNotice(id)
      })
      .catch(() => {})
  }

  const isDesktop = ref(window.innerWidth >= 1024)
  const handleResize = () => {
    isDesktop.value = window.innerWidth >= 1024
  }
  onMounted(() => window.addEventListener('resize', handleResize))
  onUnmounted(() => window.removeEventListener('resize', handleResize))

  const eveningTime = computed(() => {
    let target = dayjs().hour(18).minute(0).second(0)
    if (dayjs().isAfter(target)) target = target.add(1, 'day')
    return target.valueOf()
  })

  const nextHoliday = computed(() => {
    const h = getNextHoliday()
    return {
      name: h.name,
      date: dayjs(h.date)
    }
  })

  const nextMonthValue = computed(() => dayjs().add(1, 'month').startOf('month'))

  const showDetail = (notice: NoticeItem) => {
    selectedNotice.value = notice
    dialogVisible.value = true
  }

  const handleApproveRecommendations = async () => {
    loading.value = true
    try {
      recommendationList.value = await recommendationStore.fetchList()
      approvedDialogVisible.value = true
    } catch (err: any) {
      ElMessage.error(err.message || '加载推荐列表失败')
    } finally {
      loading.value = false
    }
  }

  const handleApprove = async (id: number) => {
    await recommendationStore.approve(id)
    recommendationList.value = await recommendationStore.fetchList()
  }

  const handleReject = async (id: number) => {
    ElMessageBox.prompt('请输入拒绝理由', '拒绝推荐', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      inputPlaceholder: '可选填'
    })
      .then(async ({ value }) => {
        await recommendationStore.reject(id, value || '无')
        recommendationList.value = await recommendationStore.fetchList()
      })
      .catch(() => {})
  }

  const currentMotto = ref('加载中...')
  const getHitokoto = async () => {
    try {
      const res = await fetch('https://v1.hitokoto.cn')
      const data = await res.json()
      currentMotto.value = data.hitokoto
    } catch {
      currentMotto.value = '塞翁失马，焉知非福'
    }
  }
  // 收藏模块
  // ========== 我的收藏 ==========
  const favoriteVisible = ref(false)
  const favoriteList = ref<FavoriteItem[]>([])
  const favoriteLoading = ref(false)
  const favoriteTotal = ref(0)

  const handleMyFavorites = async () => {
    favoriteVisible.value = true
    await fetchFavoriteList()
  }

  const fetchFavoriteList = async (pageNo: number = 1) => {
    favoriteLoading.value = true
    try {
      const res = await favoriteStore.getFavoriteList(pageNo, 10)
      favoriteList.value = res.items
      favoriteTotal.value = res.total
    } catch (err: any) {
      ElMessage.error(err.message || '获取收藏列表失败')
    } finally {
      favoriteLoading.value = false
    }
  }

  const handleFavoritePageChange = (page: number) => {
    fetchFavoriteList(page)
  }

  onMounted(async () => {
    await userStore.reqUserInfo()
    await noticeStore.getNoticeList()
    await commentStore.fetchComments(1, 10)
    getHitokoto()
  })
</script>

<style scoped lang="scss">
  .notice-item {
    position: relative; // 新增
  }

  .notice-actions {
    position: absolute;
    top: 50%;
    right: 10px;
    display: none;
    padding: 0 4px;
    background: rgb(255 255 255 / 90%);
    border-radius: 4px;
    transform: translateY(-50%);
  }

  .notice-item:hover .notice-actions {
    display: flex;
    gap: 4px;
  }

  // ================== 变量定义 ==================
  $border-comic: 2px solid #000;
  $border-light: 1px dashed #eee;
  $transition-hover: all 0.2s ease;
  $font-mono: 'Courier New', Courier, monospace;

  // ================== 混入(Mixins) ==================
  @mixin comic-header {
    padding: 12px 16px;
    border-bottom: $border-comic;

    .header-title {
      display: flex;
      gap: 6px;
      align-items: center;
      font-size: 16px;
      font-weight: 900;
      color: #333;

      .el-icon {
        color: var(--el-color-primary);
      }
    }
  }

  @mixin card-base {
    display: flex;
    flex-direction: column;
    border-radius: 8px;

    :deep(.el-card__header) {
      @include comic-header;
    }

    :deep(.el-card__body) {
      padding: 16px;
    }
  }

  // ================== 全局通用Header样式==================
  .notice-header {
    display: flex;
    flex-wrap: nowrap; /* 强制不换行 */
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .header-title {
      flex-shrink: 0; /* 禁止标题被挤压 */
      white-space: nowrap; /* 标题文字不换行 */
    }

    .more-link {
      flex-shrink: 0; /* 禁止链接被挤压 */
      margin-left: auto; /* 强制靠最右侧 */
      font-size: 12px;
      font-weight: bold;
      white-space: nowrap; /* 链接文字不换行 */
    }
  }

  // ================== 容器布局 ==================
  .container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100vh - $base-tabbar-height - 40px);
    padding-top: 5px;
    overflow: hidden;

    // ----- 头部 -----
    .top {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      height: 30px;
      margin-left: 10px;

      .welcome {
        margin: 0;
        font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
        font-size: 24px;
        font-weight: 800;
        letter-spacing: 2px;
        background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-primary-light-3));
        background-clip: text;
        background-size: 200% auto;
        filter: drop-shadow(0 4px 6px rgb(0 0 0 / 10%));
        animation: shine 3s ease infinite;
        -webkit-text-fill-color: transparent;
      }
    }

    // ----- 主体（左右分区）-----
    .bottom {
      box-sizing: border-box;
      display: flex;
      flex: 1;
      gap: 10px;
      width: 100%;
      padding: 10px;
      overflow: hidden;

      // 左侧内容区
      .left {
        box-sizing: border-box;
        display: flex;
        flex: 2;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
        overflow: hidden auto;
        background-color: rgb(0 0 0 / 5%);
        border-radius: 8px;

        // 卡片模块容器（公告等）
        .modules {
          display: flex;
          flex-shrink: 0;
          gap: 5px;
          align-items: stretch;
          justify-content: space-between;
          min-height: 340px;
          padding: 0 5px;

          .card-item {
            flex: 1;
            border-radius: 8px;
          }

          // 公告卡片专属
          .notice-card {
            display: flex;
            flex-direction: column;

            :deep(.el-card__header) {
              @include comic-header;
            }

            :deep(.el-card__body) {
              flex: 1;
              padding: 0;
              overflow: hidden;
            }

            .notice-list-container {
              height: 100%;

              .notice-list {
                padding: 0;
                margin: 0;
                list-style: none;

                .notice-item {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  padding: 12px 16px;
                  cursor: pointer;
                  border-bottom: $border-light;
                  transition: $transition-hover;

                  &:hover {
                    padding-left: 20px;
                    background-color: var(--el-color-primary-light-9);

                    .notice-title {
                      color: var(--el-color-primary);
                    }
                  }

                  &.is-top {
                    background-color: rgb(var(--el-color-primary-rgb), 0.03);

                    .notice-title {
                      font-weight: bold;
                    }
                  }

                  .notice-content-box {
                    display: flex;
                    flex: 1;
                    gap: 8px;
                    align-items: center;
                    overflow: hidden;

                    .top-tag {
                      flex-shrink: 0;
                      font-weight: bold;
                      background-color: #000;
                      border: none;
                      border-radius: 4px;
                    }

                    .notice-title {
                      overflow: hidden;
                      text-overflow: ellipsis;
                      font-size: 14px;
                      color: #444;
                      white-space: nowrap;
                    }
                  }

                  .notice-time {
                    flex-shrink: 0;
                    margin-left: 10px;
                    font-family: $font-mono;
                    font-size: 12px;
                    color: #999;
                  }
                }
              }
            }
          }

          // 留言卡片专属样式
          .comment-card {
            display: flex;
            flex-direction: column;

            :deep(.el-card__header) {
              @include comic-header;
            }

            :deep(.el-card__body) {
              flex: 1;
              padding: 0;
              overflow: hidden;
            }
          }
        }

        // 自我介绍模块
        .intro-wrapper {
          flex-shrink: 0;
          padding: 0 5px;

          .intro-card {
            @include card-base;

            :deep(.el-card__body) {
              padding: 12px 16px 12px 2px;
            }

            .intro-content {
              display: flex;
              gap: 5px;
              align-items: center;
              padding-left: 10px;

              .intro-text {
                flex: 1;

                .intro-name {
                  margin: 0 0 10px;
                  font-family: Georgia, 'Times New Roman', Times, serif;
                  font-size: 20px;
                  font-weight: 900;
                  color: #333;
                  background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-primary-light-3));
                  background-clip: text;
                  -webkit-text-fill-color: transparent;
                }

                .intro-tags {
                  display: flex;
                  flex-wrap: wrap;
                  gap: 8px;
                }
              }
            }
          }
        }

        // 倒计时模块
        .time {
          flex-shrink: 0;
          width: 100%;

          .countdown-wrapper {
            padding: 8px;
            background: rgb(255 255 255 / 10%);
            border-radius: 16px;
            backdrop-filter: blur(10px);
          }

          .countdown-card {
            display: flex;
            flex-direction: column;
            justify-content: center;
            min-height: 180px;
            padding: 5px;
            background: #fff;
            border: 1px solid #ebeef5;
            border-radius: 12px;
            transition: $transition-hover;

            &:hover {
              box-shadow: 0 10px 20px rgb(0 0 0 / 5%);
              transform: translateY(-4px);
            }

            &.highlight {
              background: linear-gradient(145deg, #fff, var(--el-color-primary-light-9));
              border: 1.5px solid var(--el-color-primary-light-5);
            }
          }

          .countdown-footer {
            margin-top: 5px;
            font-size: 13px;
            color: #909399;

            .manga-text {
              font-family: 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
              font-style: italic;
              letter-spacing: 1px;
            }

            .title {
              margin-top: 18px;
              font-style: normal;
              color: var(--el-color-primary);
            }
          }

          :deep(.el-statistic__head) {
            margin-bottom: 12px;
            font-size: 14px;
            color: #606266;
          }

          :deep(.el-statistic__content) {
            font-family: $font-mono;
            font-size: 26px;
            font-weight: bold;
            color: #303133;
          }

          .highlight :deep(.el-statistic__content) {
            color: var(--el-color-primary);
          }
        }
      }

      // 右侧轮播图区域
      .right {
        flex: 1;
        flex-shrink: 0;
        height: 100%;
        overflow: hidden;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgb(0 0 0 / 10%);

        .glass-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background-color: #fafafa;

          .blur-bg {
            position: absolute;
            top: -10%;
            left: -10%;
            z-index: 1;
            width: 120%;
            height: 120%;
            background-position: center;
            background-size: cover;
            opacity: 0.6;
            filter: blur(25px) brightness(0.9) contrast(1.2);
            transform: scale(1.1);
          }

          .main-img {
            position: relative;
            z-index: 2;
            max-width: 95%;
            max-height: 95%;
            object-fit: contain;
            background-color: #fff;
            border: 1px solid #ddd;
            box-shadow: 0 10px 30px rgb(0 0 0 / 15%);
          }
        }
      }
    }
  }

  // ================== 全局深度样式 ==================
  :deep(.el-carousel) {
    height: 100%;
  }

  :deep(.el-carousel__container) {
    height: 100% !important;
  }

  // ================== 动画 ==================
  @keyframes shine {
    0% {
      background-position: 0% center;
    }

    50% {
      background-position: 100% center;
    }

    100% {
      background-position: 0% center;
    }
  }

  // ================== 弹窗样式 ==================
  :deep(.manga-dialog) {
    border: $border-comic;
    border-radius: 8px;

    .el-dialog__header {
      padding-bottom: 10px;
      margin-right: 0;
      border-bottom: 1px solid #eee;

      .el-dialog__title {
        font-size: 20px;
        font-weight: 900;
        color: #000;
      }
    }

    .notice-detail {
      .detail-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 15px;
        font-size: 13px;
        color: #999;

        .detail-time {
          font-family: $font-mono;
        }
      }

      .detail-content {
        padding: 10px 5px;
        font-size: 15px;
        line-height: 1.8;
        color: #333;
        white-space: pre-wrap;
        background: #fdfdfd;
        border-left: 4px solid var(--el-color-primary);
      }
    }

    .el-dialog__footer .el-button {
      font-weight: bold;
      border: 1.5px solid #000;
      transition: $transition-hover;

      &:hover {
        box-shadow: 2px 2px 0 #000;
        transform: translate(-2px, -2px);
      }
    }
  }

  // ================== 留言项样式 ==================
  .comment-item {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 12px 16px;
    border-bottom: $border-light;

    &:hover {
      background: #f0f9eb !important;

      .manga-avatar {
        transform: scale(1.1) rotate(5deg);
      }
    }

    .manga-avatar {
      flex-shrink: 0;
      color: var(--el-color-success);
      background-color: var(--el-color-success-light-8);
      border: 1.5px solid #000;
    }

    .comment-body {
      flex: 1;
      overflow: hidden;

      .comment-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 2px;

        .user-name {
          font-size: 13px;
          font-weight: bold;
          color: #333;
        }

        .item-time {
          font-family: $font-mono;
          font-size: 11px;
          color: #999;
        }
      }

      .comment-text {
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 12px;
        line-height: 1.5;
        color: #666;
        white-space: nowrap;
      }
    }
  }

  // 重置列表默认样式
  .common-list {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  // ================== 响应式 ==================
  @media (width <= 1024px) {
    .container .bottom {
      .left {
        flex: 1;
      }

      .right,
      .intro-wrapper {
        display: none !important;
      }
    }
  }

  @media (width <= 768px) {
    .container {
      .top .welcome {
        font-size: 18px;
      }

      .bottom .left {
        gap: 8px;
        padding: 5px;

        .modules {
          flex-direction: column;
          gap: 10px;
          min-height: auto;

          .card-item {
            width: 100%;
            min-height: 280px;
          }
        }

        .time .countdown-wrapper {
          padding: 10px;
        }
      }
    }
  }

  .quick-actions-card {
    border-radius: 12px;

    :deep(.el-card__header) {
      padding: 16px 20px;
      border-bottom: 1px solid #f5f7fa;
    }

    .quick-actions {
      display: flex;
      flex-direction: column; // 改为垂直排列长条
      gap: 12px;
      padding: 5px 0;

      .action-btn {
        display: flex;
        align-items: center; // 垂直居中
        padding: 12px 16px;
        cursor: pointer;
        background: #f9fafb;
        border: 1px solid transparent;
        border-radius: 10px;
        transition: all 0.2s ease;

        .icon-wrapper {
          display: flex;
          flex-shrink: 0; // 防止图标被挤压
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          margin-right: 14px;
          border-radius: 8px;

          .el-icon {
            font-size: 18px;
          }

          &.blue {
            color: #4f46e5;
            background: #eef2ff;
          }

          &.orange {
            color: #ea580c;
            background: #fff7ed;
          }

          &.purple {
            color: #7c3aed;
            background: #f5f3ff;
          }
        }

        .btn-text {
          flex: 1; // 占据剩余空间
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          white-space: nowrap; // 强制不换行
        }

        .arrow-icon {
          font-size: 14px;
          color: #d1d5db;
          opacity: 0;
          transition: all 0.2s ease;
        }

        &:hover {
          background: #fff;
          border-color: var(--el-color-primary-light-5);
          box-shadow: 0 4px 12px rgb(0 0 0 / 5%);
          transform: translateX(4px); // 悬浮时向右微动，更有动感

          .arrow-icon {
            opacity: 1;
            transform: translateX(4px);
          }

          .btn-text {
            color: var(--el-color-primary);
          }
        }
      }
    }
  }

  .favorite-list {
    .favorite-item {
      display: flex;
      gap: 12px;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px dashed #eee;

      .fav-type {
        flex-shrink: 0;
      }

      .fav-content {
        flex: 1;

        .fav-title {
          margin-bottom: 4px;
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .fav-brief {
          max-width: 350px;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 13px;
          color: #666;
          white-space: nowrap;
        }
      }

      .fav-time {
        flex-shrink: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }

  .pagination-footer {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }
</style>
