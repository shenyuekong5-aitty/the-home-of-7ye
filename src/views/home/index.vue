<template>
  <div class="container">
    <div class="top">
      <p class="welcome">{{ userStore.userInfo.username }} {{ getPeriod() }}</p>
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
              <ul v-if="noticeList.length > 0" class="notice-list">
                <li
                  v-for="notice in noticeList"
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
                </li>
              </ul>
              <el-empty v-else :image-size="60" description="暂无公告" />
            </div>
          </el-card>
          <el-card class="card-item comment-card">
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
                      <span class="user-name">{{ comment.username }}</span>
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

              <div class="action-btn" v-permission="'admin'" @click="handleApproveComments">
                <div class="icon-wrapper green">
                  <el-icon><ChatLineRound /></el-icon>
                </div>
                <span class="btn-text">审批留言回复</span>
                <el-icon class="arrow-icon"><ArrowRight /></el-icon>
              </div>

              <!-- 合并后的审批推荐按钮 -->
              <div class="action-btn" v-permission="'admin'" @click="handleApproveRecommendations">
                <div class="icon-wrapper orange">
                  <el-icon><DocumentChecked /></el-icon>
                </div>
                <span class="btn-text">审批推荐</span>
                <el-icon class="arrow-icon"><ArrowRight /></el-icon>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 自我介绍模块 -->
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

    <!-- 所有推荐查看弹窗（支持书籍、音乐、番剧） -->
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
              <div style="display: flex; align-items: center; gap: 8px">
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
              <div style="display: flex; align-items: center; gap: 8px">
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
          <div style="text-align: center; padding: 20px">暂无推荐记录</div>
        </template>
      </el-table>
      <template #footer>
        <el-button class="comic-btn cancel-btn" @click="approvedDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { onMounted, onUnmounted, computed, ref } from 'vue'
  import { getPeriod } from '@/utils/time'
  import { useUserStore } from '@/store/modules/user'
  import { useNoticeStore } from '@/store/modules/notice'
  import { useCommentStore } from '@/store/modules/comment'
  import { useRecommendationStore } from '@/store/modules/recommendation'
  import dayjs from 'dayjs'
  import { getNextHoliday, type Holiday } from '@/utils/holiday'

  import type { NoticeItem } from '@/api/notice/type'

  import imgC1 from '../../../assets/images/home/C1.png'
  import imgC2 from '../../../assets/images/home/C2.png'
  import imgC3 from '../../../assets/images/home/C3.png'
  import imgC4 from '../../../assets/images/home/C4.png'
  const imgList = [imgC1, imgC2, imgC3, imgC4]

  const userStore = useUserStore()
  const noticeStore = useNoticeStore()
  const commentStore = useCommentStore()
  const recommendationStore = useRecommendationStore()

  const isAdmin = computed(() => userStore.userInfo.role === 'admin')

  const noticeList = ref<NoticeItem[]>([])
  const dialogVisible = ref(false)
  const selectedNotice = ref<NoticeItem | null>(null)

  const approvedDialogVisible = ref(false)
  const recommendationList = ref<any[]>([])
  const loading = ref(false)

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

  const handlePublishNotice = () => {
    ElMessage.info('发布公告功能开发中...')
  }
  const handleApproveComments = () => {
    ElMessage.info('审批留言功能开发中...')
  }

  // 合并后的审批推荐入口
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

  onMounted(async () => {
    await userStore.reqUserInfo()
    const res = await noticeStore.getNoticeList()
    noticeList.value = res
    await commentStore.getComments(1, 10)
    getHitokoto()
  })
</script>

<style scoped lang="scss">
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
      font-weight: 900;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 6px;
      color: #333;
      .el-icon {
        color: var(--el-color-primary);
      }
    }
  }

  @mixin card-base {
    border-radius: 8px;
    display: flex;
    flex-direction: column;
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
    justify-content: space-between;
    align-items: center;
    width: 100%;
    flex-wrap: nowrap; /* 强制不换行 */
    .header-title {
      flex-shrink: 0; /* 禁止标题被挤压 */
      white-space: nowrap; /* 标题文字不换行 */
    }
    .more-link {
      font-size: 12px;
      font-weight: bold;
      flex-shrink: 0; /* 禁止链接被挤压 */
      white-space: nowrap; /* 链接文字不换行 */
      margin-left: auto; /* 强制靠最右侧 */
    }
  }

  // ================== 容器布局 ==================
  .container {
    width: 100%;
    height: calc(100vh - $base-tabbar-height - 40px);
    padding-top: 5px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    // ----- 头部 -----
    .top {
      height: 30px;
      display: flex;
      align-items: center;
      margin-left: 10px;
      flex-shrink: 0;

      .welcome {
        margin: 0;
        font-size: 24px;
        font-weight: 800;
        font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
        background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-primary-light-3));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: shine 3s ease infinite;
        background-size: 200% auto;
        letter-spacing: 2px;
        filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
      }
    }

    // ----- 主体（左右分区）-----
    .bottom {
      width: 100%;
      flex: 1;
      display: flex;
      gap: 10px;
      padding: 10px;
      box-sizing: border-box;
      overflow: hidden;

      // 左侧内容区
      .left {
        flex: 2;
        background-color: rgba(0, 0, 0, 0.05);
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        padding: 10px;
        box-sizing: border-box;
        overflow-y: auto;
        overflow-x: hidden;

        // 卡片模块容器（公告等）
        .modules {
          padding: 0 5px;
          min-height: 340px;
          display: flex;
          justify-content: space-between;
          align-items: stretch;
          gap: 5px;
          flex-shrink: 0;

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
              padding: 0;
              flex: 1;
              overflow: hidden;
            }

            .notice-list-container {
              height: 100%;
              .notice-list {
                list-style: none;
                padding: 0;
                margin: 0;

                .notice-item {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  padding: 12px 16px;
                  border-bottom: $border-light;
                  transition: $transition-hover;
                  cursor: pointer;

                  &:hover {
                    background-color: var(--el-color-primary-light-9);
                    padding-left: 20px;
                    .notice-title {
                      color: var(--el-color-primary);
                    }
                  }

                  &.is-top {
                    background-color: rgba(var(--el-color-primary-rgb), 0.03);
                    .notice-title {
                      font-weight: bold;
                    }
                  }

                  .notice-content-box {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex: 1;
                    overflow: hidden;

                    .top-tag {
                      background-color: #000;
                      border: none;
                      border-radius: 4px;
                      font-weight: bold;
                      flex-shrink: 0;
                    }

                    .notice-title {
                      font-size: 14px;
                      color: #444;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    }
                  }

                  .notice-time {
                    font-size: 12px;
                    color: #999;
                    font-family: $font-mono;
                    margin-left: 10px;
                    flex-shrink: 0;
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
              padding: 0;
              flex: 1;
              overflow: hidden;
            }
          }
        }

        // 自我介绍模块
        .intro-wrapper {
          padding: 0 5px;
          flex-shrink: 0;

          .intro-card {
            @include card-base;
            :deep(.el-card__body) {
              padding: 12px 16px 12px 2px;
            }
            .intro-content {
              padding-left: 10px;
              display: flex;
              gap: 5px;
              align-items: center;
              .intro-text {
                flex: 1;
                .intro-name {
                  margin: 0 0 10px 0;
                  font-size: 20px;
                  font-weight: 900;
                  color: #333;
                  font-family: Georgia, 'Times New Roman', Times, serif;
                  background: linear-gradient(45deg, var(--el-color-primary), var(--el-color-primary-light-3));
                  background-clip: text;
                  -webkit-background-clip: text;
                  -webkit-text-fill-color: transparent;
                }
                .intro-tags {
                  display: flex;
                  gap: 8px;
                  flex-wrap: wrap;
                }
              }
            }
          }
        }

        // 倒计时模块
        .time {
          width: 100%;
          flex-shrink: 0;

          .countdown-wrapper {
            padding: 8px;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 16px;
          }

          .countdown-card {
            background: #fff;
            padding: 5px;
            border-radius: 12px;
            border: 1px solid #ebeef5;
            transition: $transition-hover;
            min-height: 180px;
            display: flex;
            flex-direction: column;
            justify-content: center;

            &:hover {
              box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
              transform: translateY(-4px);
            }

            &.highlight {
              border: 1.5px solid var(--el-color-primary-light-5);
              background: linear-gradient(145deg, #ffffff, var(--el-color-primary-light-9));
            }
          }

          .countdown-footer {
            margin-top: 5px;
            font-size: 13px;
            color: #909399;

            .manga-text {
              font-family: 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
              letter-spacing: 1px;
              font-style: italic;
            }
            .title {
              margin-top: 18px;
              font-style: normal;
              color: var(--el-color-primary);
            }
          }

          :deep(.el-statistic__head) {
            font-size: 14px;
            color: #606266;
            margin-bottom: 12px;
          }
          :deep(.el-statistic__content) {
            color: #303133;
            font-weight: bold;
            font-size: 26px;
            font-family: $font-mono;
          }
          .highlight :deep(.el-statistic__content) {
            color: var(--el-color-primary);
          }
        }
      }

      // 右侧轮播图区域
      .right {
        flex: 1;
        height: 100%;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        flex-shrink: 0;

        .glass-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          background-color: #fafafa;

          .blur-bg {
            position: absolute;
            top: -10%;
            left: -10%;
            width: 120%;
            height: 120%;
            background-size: cover;
            background-position: center;
            filter: blur(25px) brightness(0.9) contrast(1.2);
            z-index: 1;
            opacity: 0.6;
            transform: scale(1.1);
          }

          .main-img {
            position: relative;
            z-index: 2;
            max-width: 95%;
            max-height: 95%;
            object-fit: contain;
            border: 1px solid #ddd;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            background-color: #fff;
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
      margin-right: 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
      .el-dialog__title {
        font-weight: 900;
        font-size: 20px;
        color: #000;
      }
    }

    .notice-detail {
      .detail-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        color: #999;
        font-size: 13px;
        .detail-time {
          font-family: $font-mono;
        }
      }
      .detail-content {
        font-size: 15px;
        line-height: 1.8;
        color: #333;
        white-space: pre-wrap;
        padding: 10px 5px;
        background: #fdfdfd;
        border-left: 4px solid var(--el-color-primary);
      }
    }

    .el-dialog__footer .el-button {
      border: 1.5px solid #000;
      font-weight: bold;
      transition: $transition-hover;
      &:hover {
        transform: translate(-2px, -2px);
        box-shadow: 2px 2px 0 #000;
      }
    }
  }

  // ================== 留言项样式 ==================
  .comment-item {
    display: flex;
    gap: 10px;
    padding: 12px 16px;
    border-bottom: $border-light;
    align-items: flex-start;

    &:hover {
      background: #f0f9eb !important;
      .manga-avatar {
        transform: scale(1.1) rotate(5deg);
      }
    }

    .manga-avatar {
      border: 1.5px solid #000;
      background-color: var(--el-color-success-light-8);
      color: var(--el-color-success);
      flex-shrink: 0;
    }

    .comment-body {
      flex: 1;
      overflow: hidden;

      .comment-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2px;
        .user-name {
          font-size: 13px;
          font-weight: bold;
          color: #333;
        }
        .item-time {
          font-size: 11px;
          color: #999;
          font-family: $font-mono;
        }
      }

      .comment-text {
        margin: 0;
        font-size: 12px;
        color: #666;
        line-height: 1.5;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  // 重置列表默认样式
  .common-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  // ================== 响应式 ==================
  @media (max-width: 1024px) {
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

  @media (max-width: 768px) {
    .container {
      .top .welcome {
        font-size: 18px;
      }
      .bottom .left {
        padding: 5px;
        gap: 8px;
        .modules {
          flex-direction: column;
          min-height: auto;
          gap: 10px;
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
        background: #f9fafb;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid transparent;

        .icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 14px;
          flex-shrink: 0; // 防止图标被挤压

          .el-icon {
            font-size: 18px;
          }

          &.blue {
            background: #eef2ff;
            color: #4f46e5;
          }
          &.green {
            background: #f0fdf4;
            color: #16a34a;
          }
          &.orange {
            background: #fff7ed;
            color: #ea580c;
          }
          &.purple {
            background: #f5f3ff;
            color: #7c3aed;
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
          transform: translateX(4px); // 悬浮时向右微动，更有动感
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

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
</style>
