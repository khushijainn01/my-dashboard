import AdminLayout from "@/layouts/AdminLayout"
import { useTheme } from "@/contexts/ThemeContext"
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function SettingsPage() {
  const handleSaveProfile = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/profile",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
        }),
      }
    )

    const data = await response.json()

    if (data.success) {
      alert("Profile Updated Successfully")
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.error(error)
  }
}
  
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const { theme, setTheme } = useTheme()
  useEffect(() => {
  fetch("http://localhost:5000/api/profile")
    .then((res) => res.json())
    .then((data) => {
      setName(data.data.name)
      setEmail(data.data.email)
    })
    .catch((err) => console.error(err))
}, [])

  return (
    <AdminLayout>
      <h2 className="mb-6 text-3xl font-bold">
        Settings
      </h2>

      <div className="space-y-6">

        <Card>
  <CardHeader>
    <CardTitle>
      Profile Settings
    </CardTitle>
  </CardHeader>

  <CardContent>
    <div className="space-y-4">

      <input
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
  className="w-full rounded-lg border p-3"
/>

     <input
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="w-full rounded-lg border p-3"
/>

     <button
  onClick={handleSaveProfile}
  className="rounded-lg bg-black px-5 py-2 text-white"
>
  Save Changes
</button>

    </div>
  </CardContent>
</Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Notification Preferences
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-3">

              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked />
                Email Notifications
              </label>

              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked />
                Push Notifications
              </label>

              <label className="flex items-center gap-3">
                <input type="checkbox" />
                SMS Notifications
              </label>

            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Language
            </CardTitle>
          </CardHeader>

          <CardContent>
            <select className="rounded-lg border p-2">
              <option>English</option>
              <option>Hindi</option>
            </select>
          </CardContent>
        </Card>

        <Card>
  <CardHeader>
    <CardTitle>
      Theme Settings
    </CardTitle>
  </CardHeader>

  <CardContent>
    <div className="space-y-3">

      <label className="flex items-center gap-3">
        <input
          type="radio"
          name="theme"
          checked={theme === "light"}
          onChange={() => setTheme("light")}
        />
        Light Mode
      </label>

      <label className="flex items-center gap-3">
        <input
          type="radio"
          name="theme"
          checked={theme === "dark"}
          onChange={() => setTheme("dark")}
        />
        Dark Mode
      </label>

    </div>
  </CardContent>
</Card>

      </div>
    </AdminLayout>
  )
}