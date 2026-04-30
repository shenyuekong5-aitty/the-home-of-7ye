import dayjs from 'dayjs'

export interface Holiday {
  name: string
  date: string // 'YYYY-MM-DD' 格式
}

// 2026年法定节假日（国务院发布）
const HOLIDAYS_2026: Holiday[] = [
  { name: '元旦', date: '2026-01-01' },
  { name: '春节', date: '2026-02-17' }, // 除夕
  { name: '清明节', date: '2026-04-05' },
  { name: '劳动节', date: '2026-05-01' },
  { name: '端午节', date: '2026-06-19' },
  { name: '中秋节', date: '2026-09-25' },
  { name: '国庆节', date: '2026-10-01' }
]

// 合并所有年份节假日
const ALL_HOLIDAYS: Holiday[] = [
  ...HOLIDAYS_2026
  // 未来可添加 2027 年等
]

/**
 * 获取下一个未过期的节假日
 */
export const getNextHoliday = (): Holiday => {
  const now = dayjs()
  // 找出所有未来的节假日，按日期升序排列
  const upcoming = ALL_HOLIDAYS.filter(h => dayjs(h.date).isAfter(now, 'day') || dayjs(h.date).isSame(now, 'day')).sort(
    (a, b) => dayjs(a.date).diff(dayjs(b.date))
  )

  // 返回最近的节假日，如果没有（理论上不会）则返回默认值
  return upcoming[0] || { name: '元旦', date: dayjs().add(1, 'year').startOf('year').format('YYYY-MM-DD') }
}
