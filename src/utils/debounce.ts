/**
 * 防抖函数：延迟 delay 毫秒后执行 fn，若在延迟期间再次调用则重新计时
 * @param fn 需要防抖的函数
 * @param delay 延迟时间（毫秒），默认 300
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, delay)
  }
}
