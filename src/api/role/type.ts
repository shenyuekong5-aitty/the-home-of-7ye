export interface RoleItem {
  id: number
  name: string
  description?: string
}

export interface RoleListResponse {
  code: number
  data: RoleItem[]
}
