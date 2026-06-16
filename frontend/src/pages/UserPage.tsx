import { useEffect, useState } from "react"
import { Pencil, Trash2, Search, FileSpreadsheet } from "lucide-react"
import AdminLayout from "@/layouts/AdminLayout"
// import { initialUsers } from "@/data/mock-users"
import { exportUsersToExcel } from "@/lib/export-excel"
import type { User, UserStatus } from "@/types"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const USERS_PER_PAGE = 10

const emptyUser = (): Omit<User, "id"> => ({
  name: "",
  email: "",
  role: "User",
  status: "Active",
})

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
  fetch("http://localhost:5000/api/users")
    .then((res) => res.json())
    .then((data) => {
      setUsers(data.data)
    })
    .catch((err) => console.error(err))
}, [])

  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editedUser, setEditedUser] = useState<User | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState(emptyUser())

  const handleDelete = async (id: number) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this user?"
  )

  if (!confirmed) return

  try {
    const response = await fetch(
      `http://localhost:5000/api/users/${id}`,
      {
        method: "DELETE",
      }
    )

    const data = await response.json()

    if (data.success) {
      setUsers((prev) =>
        prev.filter((user) => user.id !== id)
      )
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.error(error)
    alert("Failed to delete user")
  }
}

  const handleEdit = (user: User) => {
    setEditingId(user.id)
    setEditedUser({ ...user })
  }

  const handleSave = async () => {
  if (!editedUser || editingId === null) return

  try {
    const response = await fetch(
      `http://localhost:5000/api/users/${editingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editedUser.name,
          email: editedUser.email,
          role: editedUser.role,
        }),
      }
    )

    const data = await response.json()

    if (data.success) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === editingId ? data.data : user
        )
      )

      setEditingId(null)
      setEditedUser(null)
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.error(error)
    alert("Failed to update user")
  }
}

  const handleAddUser = async () => {
  if (!newUser.name.trim() || !newUser.email.trim()) return

  try {
    const response = await fetch(
      "http://localhost:5000/api/users",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        }),
      }
    )

    const data = await response.json()

    if (data.success) {
      const usersResponse = await fetch(
        "http://localhost:5000/api/users"
      )

      const usersData = await usersResponse.json()

      setUsers(usersData.data)

      setNewUser(emptyUser())
      setDialogOpen(false)
    } else {
      alert(data.message)
    }
  } catch (error) {
  console.error("CREATE USER ERROR:", error)
  alert(String(error))
}
}

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)
  const indexOfLastUser = currentPage * USERS_PER_PAGE
  const currentUsers = filteredUsers.slice(
    indexOfLastUser - USERS_PER_PAGE,
    indexOfLastUser
  )

  return (
    <AdminLayout>
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-2xl">User Management</CardTitle>
          <CardAction className="col-start-1 row-start-2 flex flex-wrap items-center gap-3 md:col-start-2 md:row-start-1">
            <div className="relative">
              <Search
                size={18}
                className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="pl-10"
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => exportUsersToExcel(users)}
              title="Export Users"
            >
              <FileSpreadsheet size={20} className="text-green-600" />
            </Button>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>+ Add User</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-name">Name</Label>
                    <Input
                      id="new-name"
                      value={newUser.name}
                      onChange={(e) =>
                        setNewUser({ ...newUser, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-email">Email</Label>
                    <Input
                      id="new-email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) =>
                        setNewUser({ ...newUser, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-role">Role</Label>
                    <Input
                      id="new-role"
                      value={newUser.role}
                      onChange={(e) =>
                        setNewUser({ ...newUser, role: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select
                      value={newUser.status}
                      onValueChange={(value: UserStatus) =>
                        setNewUser({ ...newUser, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser}>Add User</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardAction>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    {editingId === user.id && editedUser ? (
                      <Input
                        value={editedUser.name}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, name: e.target.value })
                        }
                      />
                    ) : (
                      user.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === user.id && editedUser ? (
                      <Input
                        type="email"
                        value={editedUser.email}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, email: e.target.value })
                        }
                      />
                    ) : (
                      user.email
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === user.id && editedUser ? (
                      <Input
                        value={editedUser.role}
                        onChange={(e) =>
                          setEditedUser({ ...editedUser, role: e.target.value })
                        }
                      />
                    ) : (
                      user.role
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === user.id && editedUser ? (
                      <Select
                        value={editedUser.status}
                        onValueChange={(value: UserStatus) =>
                          setEditedUser({ ...editedUser, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        variant={
                          user.status === "Active" ? "success" : "warning"
                        }
                      >
                        {user.status}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {editingId === user.id ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSave}
                          className="text-green-600"
                        >
                          Save
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Pencil size={18} />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDelete(user.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
