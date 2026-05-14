/**
 * 根据环境变量自动生成WebSocket连接地址
 * @param path WebSocket接口路径（如 '/ws'）
 * @param token 认证token
 * @returns 完整的WebSocket地址
 */
export function getWsUrl(path: string, token: string): string {
  // 从环境变量获取后端根地址
  const baseUrl = import.meta.env.VITE_SERVE as string

  // 自动转换协议：http → ws，https → wss
  const wsProtocol = baseUrl.startsWith('https') ? 'wss' : 'ws'

  // 提取域名和端口（去掉http://或https://）
  const host = baseUrl.replace(/^https?:\/\//, '')

  // 拼接完整地址
  return `${wsProtocol}://${host}${path}/${token}`
}
