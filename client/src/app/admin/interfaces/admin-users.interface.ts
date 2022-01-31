export interface AdminUsersAndCount {
  users: AdminUsers[]
  count: number
}

export interface AdminUsers {
  id: number
  email: string
}
