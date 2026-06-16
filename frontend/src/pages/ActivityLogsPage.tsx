import { useEffect, useState } from "react"
import { Search, FileSpreadsheet } from "lucide-react"
import AdminLayout from "@/layouts/AdminLayout"
// import { initialLogs } from "@/data/mock-logs"
import { exportLogsToExcel } from "@/lib/export-excel"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  useEffect(() => {
  fetch("http://localhost:5000/api/activity-logs")
    .then((res) => res.json())
    .then((data) => {
      setLogs(data.data)
    })
    .catch((err) => console.error(err))
}, [])
  

  const filteredLogs = logs.filter(
  (log: any) =>
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
)

  return (
    <AdminLayout>
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-2xl">Activity Logs</CardTitle>
          <CardAction className="col-start-1 row-start-2 flex items-center gap-3 md:col-start-2 md:row-start-1">
            <div className="relative">
              <Search
                size={18}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => exportLogsToExcel(logs)}
              title="Export Logs"
            >
              <FileSpreadsheet size={20} className="text-green-600" />
            </Button>
          </CardAction>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
             {filteredLogs.map((log: any) => (
  <TableRow key={log.id}>
    <TableCell>{log.action}</TableCell>
    <TableCell>{log.details}</TableCell>
    <TableCell>
      {new Date(log.createdAt).toLocaleString()}
    </TableCell>
  </TableRow>
))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
