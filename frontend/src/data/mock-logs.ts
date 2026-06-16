import type { ActivityLog } from "@/types"

export const initialLogs: ActivityLog[] = [
  { id: 1, action: "User Login", user: "John Doe", time: "Today, 10:15 AM" },
  { id: 2, action: "Password Changed", user: "Jane Smith", time: "Today, 09:30 AM" },
  { id: 3, action: "New User Created", user: "Admin", time: "Yesterday, 04:45 PM" },
  { id: 4, action: "Profile Updated", user: "Mike Johnson", time: "Yesterday, 02:20 PM" },
]
