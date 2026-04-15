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
                      <span class="item-time">
                        {{ dayjs(comment.createTime).format('MM-DD') }}
                      </span>
                    </div>
                    <p class="comment-text" :title="comment.content">
                      {{ comment.content }}
                    </p>
                  </div>
                </li>
              </ul>
              <el-empty v-else :image-size="40" description="虚位以待" />
            </div>
          </el-card>
          <el-card class="card-item">快捷入口：发布公告、审批留言、审批推荐书籍</el-card>
        </div>

        <!-- 新增：自我介绍模块（CSS+JS双重控制显示） -->
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
                <h3 class="intro-name">Hello, I'm AittyTempest</h3>
                <div class="intro-tags">
                  <el-tag size="small" effect="plain" round>Vue3</el-tag>
                  <el-tag size="small" effect="plain" round>TypeScript</el-tag>
                  <el-tag size="small" effect="plain" round>Element Plus</el-tag>
                  <el-tag size="small" effect="plain" round>HarmonyOS</el-tag>
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
                <el-countdown format="DD [天] HH:mm:ss" :value="nextMonthValue">
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

        <div class="detail-content">
          {{ selectedNotice.content }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, computed, ref } from 'vue'
  import { getPeriod } from '@/utils/time'
  import { useUserStore } from '@/store/modules/user'
  import { useNoticeStore } from '@/store/modules/notice'
  import { useCommentStore } from '@/store/modules/comment'
  import dayjs from 'dayjs'
  import { Calendar, Notification, User, Reading, ChatDotSquare } from '@element-plus/icons-vue'
  import type { NoticeItem } from '@/api/notice/type'

  import imgC1 from '../../../assets/images/home/C1.png'
  import imgC2 from '../../../assets/images/home/C2.png'
  import imgC3 from '../../../assets/images/home/C3.png'
  import imgC4 from '../../../assets/images/home/C4.png'
  const imgList = [imgC1, imgC2, imgC3, imgC4]

  // 用户仓库
  const userStore = useUserStore()
  // 公告仓库
  const noticeStore = useNoticeStore()
  // 留言仓库
  const commentStore = useCommentStore()

  // 获取公告列表
  const noticeList = ref<NoticeItem[]>([])

  // 弹窗相关
  const dialogVisible = ref(false)
  const selectedNotice = ref<NoticeItem | null>(null)

  // 响应式设备判断（保留JS逻辑，同时用CSS兜底）
  const isDesktop = ref(window.innerWidth >= 1024)
  const handleResize = () => {
    isDesktop.value = window.innerWidth >= 1024
  }
  onMounted(() => window.addEventListener('resize', handleResize))
  onUnmounted(() => window.removeEventListener('resize', handleResize))

  // 时间处理部分
  const eveningTime = computed(() => {
    let target = dayjs().hour(18).minute(0).second(0)
    if (dayjs().isAfter(target)) target = target.add(1, 'day')
    return target.valueOf()
  })

  const nextHoliday = computed(() => {
    const now = dayjs()
    const currentYear = now.year()

    const getSolarHolidays = (y: number) => [
      { name: '元旦', date: `${y}-01-01` },
      { name: '劳动节', date: `${y}-05-01` },
      { name: '国庆节', date: `${y}-10-01` }
    ]

    const movingHolidays = [
      { name: '春节', date: '2026-02-17' },
      { name: '清明节', date: '2026-04-05' },
      { name: '端午节', date: '2026-06-19' },
      { name: '中秋节', date: '2026-09-25' },
      { name: '春节', date: '2027-02-06' },
      { name: '清明节', date: '2027-04-05' },
      { name: '端午节', date: '2027-06-09' },
      { name: '中秋节', date: '2027-10-14' },
      { name: '春节', date: '2028-01-26' },
      { name: '清明节', date: '2028-04-04' },
      { name: '端午节', date: '2028-05-28' },
      { name: '中秋节', date: '2028-10-03' },
      { name: '春节', date: '2029-02-13' },
      { name: '清明节', date: '2029-04-04' },
      { name: '端午节', date: '2029-06-16' },
      { name: '中秋节', date: '2029-09-22' },
      { name: '春节', date: '2030-02-03' },
      { name: '清明节', date: '2030-04-05' },
      { name: '端午节', date: '2030-06-05' },
      { name: '中秋节', date: '2030-09-12' }
    ]

    const solarPool = [
      ...getSolarHolidays(currentYear),
      ...getSolarHolidays(currentYear + 1),
      ...getSolarHolidays(currentYear + 2)
    ]

    const allHolidays = [...solarPool, ...movingHolidays]
      .map(h => ({ name: h.name, djs: dayjs(h.date) }))
      .filter(h => h.djs.isAfter(now, 'second'))
      .sort((a, b) => a.djs.diff(b.djs))

    const nearest = allHolidays[0]
    return {
      name: nearest?.name || '下一个假期',
      date: nearest?.djs || now
    }
  })

  const nextMonthValue = computed(() => dayjs().add(1, 'month').startOf('month'))

  // 公告详情弹窗
  const showDetail = (notice: NoticeItem) => {
    selectedNotice.value = notice
    dialogVisible.value = true
  }

  onMounted(async () => {
    // 获取用户信息
    await userStore.reqUserInfo()
    // 获取公告列表
    const res = await noticeStore.getNoticeList()
    noticeList.value = res
    // 获取留言列表
    await commentStore.getComments(1, 10)
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
</style>
