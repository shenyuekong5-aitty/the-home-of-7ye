/**
 * 根据环境变量自动生成WebSocket连接地址
 * @param path WebSocket接口路径（如 '/ws'）
 * @param token 认证token
 * @returns 完整的WebSocket地址
 */
export function getWsUrl(path: string, token: string): string {
  const baseUrl = import.meta.env.VITE_SERVE as string

  // 开发环境：有完整地址，如 http://localhost:8080
  if (baseUrl) {
    const wsProtocol = baseUrl.startsWith('https') ? 'wss' : 'ws'
    const host = baseUrl.replace(/^https?:\/\//, '')
    return `${wsProtocol}://${host}${path}/${token}`
  }

  // 生产环境：没有配置 VITE_SERVE，自动从当前浏览器地址生成
  const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
  const host = window.location.host
  return `${protocol}://${host}${path}/${token}`
}
