export interface FriendUser {
  userId: number
  nickname: string
  avatar: string
}

export interface FriendMemoryItem {
  id: number
  userId: number
  friendId: number
  title: string
  photo: string // base64 或 url
  description: string
  memoryTime: string // 如 "2024 夏天"
  createTime: string
}

export interface FriendUsersResponse {
  code: number
  data: { items: FriendUser[] }
  message: string
}

export interface MemoryListResponse {
  code: number
  data: { items: FriendMemoryItem[] }
  message: string
}

export interface OperationResponse {
  code: number
  data?: any
  message: string
}
