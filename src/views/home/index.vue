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
                  <el-icon><Notification /></el-icon> 系统公告
                </span>
                <el-link
                  underline="never"
                  type="primary"
                  title="有问题？联系站长：QQ3316900024"
                  class="more-link"
                  >更多</el-link
                >
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
                    <el-tag
                      v-if="notice.isImportant"
                      size="small"
                      effect="dark"
                      class="top-tag"
                      >置顶</el-tag
                    >

                    <span class="notice-title">{{ notice.title }}</span>
                  </div>
                  <span class="notice-time">{{
                    dayjs(notice.publishTime).format('MM-DD')
                  }}</span>
                </li>
              </ul>

              <el-empty v-else :image-size="60" description="暂无公告" />
            </div>
          </el-card>
          <el-card class="card-item"> 留言 </el-card>
          <el-card class="card-item"> 快捷入口：发布公告、审批 </el-card>
        </div>
        <div class="time">
          <el-row :gutter="16" class="countdown-wrapper">
            <el-col :xs="24" :sm="12" :md="8" class="text-center mb-4">
              <div class="countdown-card">
                <el-countdown
                  title="距离今晚 (18:00) 还有"
                  :value="eveningTime"
                />
                <div class="countdown-footer">
                  <span class="manga-text">日落而息 · 静候星辰</span>
                  <div class="title">小烨祝你生活愉快,天天开心~</div>
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
                      <el-icon style="margin-right: 4px" :size="14"
                        ><Calendar
                      /></el-icon>
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
              <div
                class="blur-bg"
                :style="{ backgroundImage: `url(${img})` }"
              ></div>
              <img :src="img" class="main-img" alt="" />
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <el-dialog
      v-model="dialogVisible"
      :title="selectedNotice?.title"
      width="500"
      class="manga-dialog"
      align-center
    >
      <div class="notice-detail" v-if="selectedNotice">
        <div class="detail-meta">
          <el-tag size="small" effect="plain">{{
            selectedNotice.publisher
          }}</el-tag>
          <span class="detail-time"
            >发布于：{{ selectedNotice.publishTime }}</span
          >
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
import { onMounted, computed, ref } from 'vue'
import { getPeriod } from '@/utils/time'
import { useUserStore } from '@/store/modules/user'
import dayjs from 'dayjs'
import { Calendar, Notification } from '@element-plus/icons-vue'
// 引入ts类型
import type { NoticeItem } from '@/api/user/type'

// 引入本地图片资源
import imgC1 from '../../../assets/images/C1.png'
import imgC2 from '../../../assets/images/C2.png'
import imgC3 from '../../../assets/images/C3.png'
import imgC4 from '../../../assets/images/C4.png'
const imgList = [imgC1, imgC2, imgC3, imgC4]

// 用户仓库
const userStore = useUserStore()

// 获取公告列表
const noticeList = ref<NoticeItem[]>([])

// 弹窗相关
const dialogVisible = ref(false)
const selectedNotice = ref<NoticeItem | null>(null)

// 时间处理部分
// --- 1. 晚上 18:00 逻辑 ---
const eveningTime = computed(() => {
  let target = dayjs().hour(18).minute(0).second(0)
  if (dayjs().isAfter(target)) target = target.add(1, 'day')
  return target.valueOf()
})

// --- 2. 十年法定节假日逻辑 ---
const nextHoliday = computed(() => {
  const now = dayjs()
  const currentYear = now.year()

  // A. 自动生成的固定公历节日 (覆盖未来10年)
  const getSolarHolidays = (y: number) => [
    { name: '元旦', date: `${y}-01-01` },
    { name: '劳动节', date: `${y}-05-01` },
    { name: '国庆节', date: `${y}-10-01` }
  ]

  // B. 农历/变动日期节日表 (由于农历计算复杂，这里预置了2026-2030的核心放假日期)
  // 这些是国家法定会放假的节日
  const movingHolidays = [
    // 2026年
    { name: '春节', date: '2026-02-17' },
    { name: '清明节', date: '2026-04-05' },
    { name: '端午节', date: '2026-06-19' },
    { name: '中秋节', date: '2026-09-25' },
    // 2027年
    { name: '春节', date: '2027-02-06' },
    { name: '清明节', date: '2027-04-05' },
    { name: '端午节', date: '2027-06-09' },
    { name: '中秋节', date: '2027-10-14' },
    // 2028年
    { name: '春节', date: '2028-01-26' },
    { name: '清明节', date: '2028-04-04' },
    { name: '端午节', date: '2028-05-28' },
    { name: '中秋节', date: '2028-10-03' },
    // 2029年
    { name: '春节', date: '2029-02-13' },
    { name: '清明节', date: '2029-04-04' },
    { name: '端午节', date: '2029-06-16' },
    { name: '中秋节', date: '2029-09-22' },
    // 2030年
    { name: '春节', date: '2030-02-03' },
    { name: '清明节', date: '2030-04-05' },
    { name: '端午节', date: '2030-06-05' },
    { name: '中秋节', date: '2030-09-12' }
  ]

  // C. 汇总并筛选
  // 我们计算今年、明年和后年的固定节日，确保池子足够大
  const solarPool = [
    ...getSolarHolidays(currentYear),
    ...getSolarHolidays(currentYear + 1),
    ...getSolarHolidays(currentYear + 2)
  ]

  const allHolidays = [...solarPool, ...movingHolidays]
    .map((h) => ({ name: h.name, djs: dayjs(h.date) }))
    // 过滤掉已经过去的（以天为单位，确保当天还没过完时依然显示）
    .filter((h) => h.djs.isAfter(now, 'second'))
    // 按照时间先后排序
    .sort((a, b) => a.djs.diff(b.djs))

  const nearest = allHolidays[0]
  return {
    name: nearest?.name || '下一个假期',
    date: nearest?.djs || now
  }
})

// --- 3. 下月月初逻辑 ---
const nextMonthValue = computed(() => dayjs().add(1, 'month').startOf('month'))

// 公告---点击显示详情的方法
const showDetail = (notice: NoticeItem) => {
  selectedNotice.value = notice
  dialogVisible.value = true
}

onMounted(async () => {
  // 获取用户信息
  await userStore.reqUserInfo()
  // 获取公告列表
  const res = await userStore.getNoticeList()
  noticeList.value = res
  console.log(noticeList)
})
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: calc(100vh - $base-tabbar-height - 40px);
  padding-top: 5px;
  box-sizing: border-box;

  .top {
    height: 30px;
    display: flex;
    align-items: center;
    margin-left: 10px;

    .welcome {
      margin: 0;
      font-size: 24px;
      font-weight: 800;
      font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;

      background: linear-gradient(
        45deg,
        var(--el-color-primary),
        var(--el-color-primary-light-3)
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;

      animation: shine 3s ease infinite;
      background-size: 200% auto;
      -webkit-font-smoothing: antialiased;
      letter-spacing: 2px;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
    }
  }

  .bottom {
    width: 100%;
    height: calc(100vh - $base-tabbar-height - 75px);
    display: flex;
    gap: 10px;
    padding: 10px;
    box-sizing: border-box;

    .left {
      flex: 2;
      background-color: rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      .modules {
        padding: 0 5px;
        height: 340px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 5px;
        .card-item {
          width: 90%;
          height: 90%;
          border-radius: 8px;
        }
        /* --- 公告卡片专属样式 --- */
        .notice-card {
          display: flex;
          flex-direction: column;

          // 修改 Element Plus 原生 Header 样式
          :deep(.el-card__header) {
            padding: 12px 16px;
            border-bottom: 2px solid #000; // 漫画风格粗线条
          }

          :deep(.el-card__body) {
            padding: 0; // 去掉内边距，让列表撑满
            flex: 1;
            overflow: hidden;
          }

          .notice-header {
            display: flex;
            justify-content: space-between;
            align-items: center;

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

            .more-link {
              font-size: 12px;
              font-weight: bold;
            }
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
                border-bottom: 1px dashed #eee;
                transition: all 0.2s ease;
                cursor: pointer;

                &:hover {
                  background-color: var(--el-color-primary-light-9);
                  padding-left: 20px; // 悬停平移效果

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
                    background-color: #000; // 漫画感黑底白字
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
                    text-overflow: ellipsis; // 自动省略号
                  }
                }

                .notice-time {
                  font-size: 12px;
                  color: #999;
                  font-family: 'Courier New', monospace;
                  margin-left: 10px;
                  flex-shrink: 0;
                }
              }
            }
          }
        }
      }
      .time {
        width: 100%;
        height: 250px;
        .countdown-wrapper {
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 16px;
        }

        .countdown-card {
          background: #ffffff;
          padding: 20px;
          border-radius: 12px;
          border: 1px solid #ebeef5;
          transition: all 0.3s ease;

          &:hover {
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
            transform: translateY(-4px);
          }

          &.highlight {
            border: 1.5px solid var(--el-color-primary-light-5);
            background: linear-gradient(
              145deg,
              #ffffff,
              var(--el-color-primary-light-9)
            );
          }
        }

        .countdown-footer {
          margin-top: 15px;
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

        /* 深度定制 Element Plus 文字样式 */
        :deep(.el-statistic__head) {
          font-size: 14px;
          color: #606266;
          margin-bottom: 12px;
        }

        :deep(.el-statistic__content) {
          color: #303133;
          font-weight: bold;
          font-size: 26px;

          /* 如果你想让数字带点黑白漫画的硬朗感 */
          font-family: 'Courier New', Courier, monospace;
        }

        .highlight :deep(.el-statistic__content) {
          color: var(--el-color-primary);
        }
      }
    }

    .right {
      flex: 1;
      height: 100%;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

      .glass-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        // 调整点 1: 漫画风格底色建议用浅灰色或白色，而不是纯黑
        background-color: #fafafa;

        .blur-bg {
          position: absolute;
          top: -10%;
          left: -10%;
          width: 120%;
          height: 120%;
          background-size: cover;
          background-position: center;
          // 调整点 2: 漫画风格背景不要太暗，brightness 改为 0.9，增加对比度
          filter: blur(25px) brightness(0.9) contrast(1.2);
          z-index: 1;
          opacity: 0.6; // 让背景淡一点，不干扰主体
          transform: scale(1.1);
        }

        .main-img {
          position: relative;
          z-index: 2;
          max-width: 95%; // 稍微缩小一点，露出更多背景感
          max-height: 95%;
          object-fit: contain;
          // 调整点 3: 漫画主体加个细细的黑色边框和更柔和的阴影
          border: 1px solid #ddd;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
          background-color: #fff; // 确保漫画透明处是白色
        }
      }
    }
  }
}

// 深度作用选择器，确保 el-carousel 撑满
:deep(.el-carousel) {
  height: 100%;
}
:deep(.el-carousel__container) {
  height: 100% !important;
}

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

// 弹窗样式
// 弹窗深度样式定制
:deep(.manga-dialog) {
  border: 2px solid #000; // 漫画粗边框
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
        font-family: 'Courier New', monospace;
      }
    }

    .detail-content {
      font-size: 15px;
      line-height: 1.8;
      color: #333;
      white-space: pre-wrap; // 保留换行符
      padding: 10px 5px;
      // 模拟漫画对话框的背景感
      background: #fdfdfd;
      border-left: 4px solid var(--el-color-primary);
    }
  }

  // 按钮漫画化
  .el-dialog__footer {
    .el-button {
      border: 1.5px solid #000;
      font-weight: bold;
      transition: all 0.2s;
      &:hover {
        transform: translate(-2px, -2px);
        box-shadow: 2px 2px 0 #000;
      }
    }
  }
}
</style>
