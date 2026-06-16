import { useEffect, useState } from "react"
import AdminLayout from "@/layouts/AdminLayout"
import {
  Users,
  Bell,
  FileText,
} from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts"

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
  totalUsers: 0,
  notifications: 0,
  activityLogs: 0,
})

const [roleData, setRoleData] = useState<any[]>([])
const [activityData, setActivityData] = useState<any[]>([])
const [growthData, setGrowthData] = useState<any[]>([])
const [recentLogs, setRecentLogs] = useState<any[]>([])
useEffect(() => {
  fetch("http://localhost:5000/api/activity-logs")
    .then((res) => res.json())
    .then((data) => {
      setRecentLogs(data.data.slice(0, 5))
    })
    .catch((err) => console.error(err))
}, [])

useEffect(() => {
  fetch("http://localhost:5000/api/user-growth")
    .then((res) => res.json())
    .then((data) => {
      setGrowthData(data.data)
    })
    .catch((err) => console.error(err))
}, [])

useEffect(() => {
  fetch("http://localhost:5000/api/activity-chart")
    .then((res) => res.json())
    .then((data) => {
      const formattedData = data.data.map((item: any) => ({
        action: item.action,
        count: item._count.action,
      }))

      setActivityData(formattedData)
    })
    .catch((err) => console.error(err))
}, [])
useEffect(() => {
  fetch("http://localhost:5000/api/user-role-stats")
    .then((res) => res.json())
    .then((data) => {
      const formattedData = data.data.map((item: any) => ({
        name: item.role,
        value: item._count.role,
      }))

      setRoleData(formattedData)
    })
    .catch((err) => console.error(err))
}, [])

  useEffect(() => {
    fetch("http://localhost:5000/api/dashboard-stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.data)
      })
      .catch((err) => console.error(err))
  }, [])

  // const roleData = [
  //   { name: "Admin", value: 2 },
  //   { name: "User", value: 4 },
  //   { name: "Employee", value: 1 },
  // ]

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
  ]

  return (
    <AdminLayout>
      <h2 className="mb-6 text-3xl font-bold">
        Analytics Dashboard
      </h2>

      {/* Stats Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
       <Card>
  <CardContent className="pt-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-muted-foreground">
          Total Users
        </p>
        <p className="text-3xl font-bold">
          {stats.totalUsers}
        </p>
      </div>

      <Users
        size={40}
        className="text-blue-500"
      />
    </div>
  </CardContent>
</Card>

        

        <Card>
  <CardContent className="pt-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-muted-foreground">
          Notifications
        </p>
        <p className="text-3xl font-bold">
          {stats.notifications}
        </p>
      </div>

      <Bell
        size={40}
        className="text-green-500"
      />
    </div>
  </CardContent>
</Card>

        <Card>
  <CardContent className="pt-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-muted-foreground">
          Activity Logs
        </p>
        <p className="text-3xl font-bold">
          {stats.activityLogs}
        </p>
      </div>

      <FileText
        size={40}
        className="text-orange-500"
      />
    </div>
  </CardContent>
</Card>
      </div>

<div className="grid gap-6 md:grid-cols-2">

      {/* Pie Chart */}
     <Card>
  <CardHeader>
    <CardTitle>Users By Role</CardTitle>
  </CardHeader>

  <CardContent>
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
  data={roleData}
  dataKey="value"
  nameKey="name"
  cx="50%"
  cy="50%"
  outerRadius={120}
  label
>
  {roleData.map((_, index) => (
    <Cell
      key={index}
      fill={COLORS[index % COLORS.length]}
    />
  ))}
</Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>

 {/* Bar Chart Card */}
<Card>
  <CardHeader>
    <CardTitle>Activity Logs</CardTitle>
  </CardHeader>

  <CardContent>
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <BarChart data={activityData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="action" />
          <YAxis />

          <Tooltip />

          <Bar
            dataKey="count"
            fill="#3B82F6"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>


{/* Growth User Chart */}
<Card className="mt-6">
  <CardHeader>
    <CardTitle>User Growth</CardTitle>
  </CardHeader>

  <CardContent>
    <div style={{ width: "100%", height: 400 }}>
      <ResponsiveContainer>
        <LineChart data={growthData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />
          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="count"
            stroke="#10B981"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>

<Card className="mt-6">
  <CardHeader>
    <CardTitle>Recent Activities</CardTitle>
  </CardHeader>

  <CardContent>
    <div className="space-y-4">
      {recentLogs.map((log) => (
        <div
          key={log.id}
          className="border-b pb-2"
        >
          <p className="font-medium">
            {log.action}
          </p>

          <p className="text-sm text-muted-foreground">
            {log.details}
          </p>

          <p className="text-xs text-gray-400">
            {new Date(
              log.createdAt
            ).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  </CardContent>
</Card>

</div>
    </AdminLayout>
  )
}