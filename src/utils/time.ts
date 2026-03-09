export function getPeriod() {
  const now = new Date().getHours() // 获取当前小时数（0-23）
  let msg: string

  // 按时间区间划分问候语
  if (now >= 0 && now < 5) {
    msg = '凌晨好' // 0点-5点：凌晨
  } else if (now >= 5 && now < 8) {
    msg = '早餐好' // 5点-8点：早餐
  } else if (now >= 8 && now < 11) {
    msg = '上午好' // 8点-11点：上午
  } else if (now >= 11 && now < 14) {
    msg = '中午好' // 11点-14点：中午
  } else if (now >= 14 && now < 17) {
    msg = '下午好' // 14点-17点：下午
  } else if (now >= 17 && now < 20) {
    msg = '傍晚好' // 17点-20点：傍晚
  } else {
    msg = '晚上好' // 20点-24点/0点前：晚上
  }
  return msg // 新增返回值，方便外部调用
}
