import type { ActivityLog, User } from "@/types"

export async function exportUsersToExcel(users: User[], filename = "Users.xlsx") {
  const XLSX = await import("xlsx")
  const { saveAs } = await import("file-saver")

  const worksheet = XLSX.utils.json_to_sheet(users)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Users")

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  })

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

  saveAs(file, filename)
}

export async function exportLogsToExcel(
  logs: ActivityLog[],
  filename = "ActivityLogs.xlsx"
) {
  const XLSX = await import("xlsx")
  const { saveAs } = await import("file-saver")

  const worksheet = XLSX.utils.json_to_sheet(logs)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Activity Logs")

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  })

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

  saveAs(file, filename)
}
