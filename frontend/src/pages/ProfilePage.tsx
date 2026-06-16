import { useState } from "react"
import { Camera } from "lucide-react"
import AdminLayout from "@/layouts/AdminLayout"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { STORAGE_KEYS } from "@/lib/storage"

export default function ProfilePage() {
  const [profileImage, setProfileImage] = useState(
    () => localStorage.getItem(STORAGE_KEYS.profileImage) ?? ""
  )

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result
      if (typeof result === "string") {
        setProfileImage(result)
        localStorage.setItem(STORAGE_KEYS.profileImage, result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid gap-4 md:grid-cols-3">
            <Card size="sm">
              <CardHeader>
                <CardTitle>Personal Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-muted-foreground">Full Name</p>
                  <p className="font-semibold">Khushi Jain</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-semibold">khushijain0776@gmail.com</p>
                </div>
              </CardContent>
            </Card>

            <Card size="sm">
              <CardHeader>
                <CardTitle>User Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-muted-foreground">Username</p>
                  <p className="font-semibold">khushijain</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone Number</p>
                  <p className="font-semibold">+91 7014509776</p>
                </div>
              </CardContent>
            </Card>

            <Card size="sm">
              <CardContent className="flex flex-col items-center justify-center pt-6">
                <div className="group relative">
                  <label htmlFor="profile-upload" className="cursor-pointer">
                    <Avatar className="size-28 border-4 border-[#2B2A8F]">
                      <AvatarImage src={profileImage || undefined} alt="Profile" />
                      <AvatarFallback className="text-lg">KJ</AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100">
                      <Camera size={24} className="text-white" />
                    </div>
                  </label>
                </div>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold">Account Information</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <Card size="sm" className="text-center">
                <CardContent className="pt-6">
                  <p className="text-lg text-muted-foreground">Role</p>
                  <p className="mt-2 text-2xl font-bold">Admin</p>
                </CardContent>
              </Card>
              <Card size="sm" className="text-center">
                <CardContent className="pt-6">
                  <p className="text-lg text-muted-foreground">Account Status</p>
                  <Badge variant="success" className="mt-2 text-base">
                    Active
                  </Badge>
                </CardContent>
              </Card>
              <Card size="sm" className="text-center">
                <CardContent className="pt-6">
                  <p className="text-lg text-muted-foreground">Join Date</p>
                  <p className="mt-2 text-2xl font-bold">15 Jan 2025</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
