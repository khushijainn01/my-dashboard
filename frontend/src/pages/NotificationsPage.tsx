import { useEffect, useState } from "react"
import AdminLayout from "@/layouts/AdminLayout"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function timeAgo(dateString: string) {
  const date = new Date(dateString)
  const seconds = Math.floor(
    (new Date().getTime() - date.getTime()) / 1000
  )

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ]

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)

    if (count > 0) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`
    }
  }

  return "Just now"
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  useEffect(() => {
  fetch("http://localhost:5000/api/notifications")
    .then((res) => res.json())
    .then((data) => {
      setNotifications(data.data)
    })
    .catch((err) => console.error(err))
}, [])
  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.map((notification: any) => (
            <Card key={notification.title} size="sm">
              <CardContent className="pt-4">
                <h3 className="font-semibold">{notification.title}</h3>
               <p className="text-muted-foreground">
  {notification.message}
</p>

<p className="text-xs text-gray-400 mt-2">
  {timeAgo(notification.createdAt)}
</p>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
