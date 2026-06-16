import AdminLayout from "@/layouts/AdminLayout"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { toast } from "sonner"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ShieldCheck,
  KeyRound,
  Clock3,
  Lock,
} from "lucide-react"

export default function SecurityPage() {
  
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showLoginActivity, setShowLoginActivity] = useState(false)

  const [showSessions, setShowSessions] = useState(false)
  const [loginLogs, setLoginLogs] = useState<any[]>([])
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const toggleTwoFactor = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/two-factor-toggle",
      {
        method: "POST",
      }
    )

    const data = await response.json()

    if (data.success) {
      setTwoFactorEnabled(data.data.enabled)
      console.log(data.data.enabled)
    }
  } catch (error) {
    console.error(error)
  }
}
  
  const handleChangePassword = async () => {
  if (newPassword !== confirmPassword) {
    toast.error("Passwords do not match")
    return
  }

  try {
    const response = await fetch(
      "http://localhost:5000/api/change-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      }
    )

    const data = await response.json()

    if (data.success) {
      toast.success("Password Updated Successfully")

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } else {
      toast.error(data.message)
    }
  } catch (error) {
    console.error(error)
    alert("Something went wrong")
  }
}

 const [lastLogin, setLastLogin] = useState("")
 useEffect(() => {
  fetch("http://localhost:5000/api/security-stats")
    .then((res) => res.json())
    .then((data) => {
      setLastLogin(data.data.lastLogin)
    })
    .catch((err) => console.error(err))
}, [])

useEffect(() => {
  fetch("http://localhost:5000/api/two-factor-status")
    .then((res) => res.json())
    .then((data) => {
      setTwoFactorEnabled(data.data.enabled)
    })
    .catch((err) => console.error(err))
}, [])

useEffect(() => {
  fetch("http://localhost:5000/api/activity-logs")
    .then((res) => res.json())
    .then((data) => {
      const logins = data.data.filter(
        (log: any) => log.action === "LOGIN"
      )

      setLoginLogs(logins)
    })
    .catch((err) => console.error(err))
}, [])

  return (
    <AdminLayout>
      <h2 className="mb-6 text-3xl font-bold">
        Security Center
      </h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">
                  Security Status
                </p>
                <p className="font-bold text-green-600">
                  Secure
                </p>
              </div>

              <ShieldCheck
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
                  Password Status
                </p>
                <p className="font-bold">
                  Active
                </p>
              </div>

              <KeyRound
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
                  Last Login
                </p>
                <p className="font-bold">
  {lastLogin
    ? new Date(lastLogin).toLocaleString()
    : "No Login"}
</p>
              </div>

              <Clock3
                size={40}
                className="text-orange-500"
              />
            </div>
          </CardContent>
        </Card>

<Card className="mt-6">
  <CardContent className="pt-6">
    <h3 className="mb-4 text-xl font-semibold">
      Two Factor Authentication
    </h3>

    <button
  onClick={toggleTwoFactor}
  className={`rounded-lg px-5 py-2 text-white ${
    twoFactorEnabled
      ? "bg-red-600"
      : "bg-green-600"
  }`}
>
  {twoFactorEnabled
    ? "Disable 2FA"
    : "Enable 2FA"}
</button>
  </CardContent>
</Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">
                  2FA Status
                </p>
                <p
  className={`font-bold ${
    twoFactorEnabled
      ? "text-green-600"
      : "text-red-500"
  }`}
>
  {twoFactorEnabled
    ? "Enabled"
    : "Disabled"}
</p>
              </div>

              <Lock
                size={40}
                className="text-red-500"
              />
            </div>
          </CardContent>
        </Card>

      </div>

      <Card className="mt-6">
  <CardContent className="pt-6">

    <button
      onClick={() =>
        setShowPasswordForm(!showPasswordForm)
      }
      className="flex w-full items-center justify-between"
    >
      <h3 className="text-xl font-semibold">
        Change Password
      </h3>

      {showPasswordForm ? (
        <ChevronUp size={22} />
      ) : (
        <ChevronDown size={22} />
      )}
    </button>

{showPasswordForm && (
  <div className="mt-4 space-y-4">
      <input
  type="password"
  placeholder="Current Password"
  value={currentPassword}
  onChange={(e) =>
    setCurrentPassword(e.target.value)
  }
  className="w-full rounded-lg border p-3"
/>

      <input
  type="password"
  placeholder="New Password"
  value={newPassword}
  onChange={(e) =>
    setNewPassword(e.target.value)
  }
  className="w-full rounded-lg border p-3"
/>

      <input
  type="password"
  placeholder="Confirm Password"
  value={confirmPassword}
  onChange={(e) =>
    setConfirmPassword(e.target.value)
  }
  className="w-full rounded-lg border p-3"
/>

      <button
  onClick={handleChangePassword}
  className="rounded-lg bg-black px-5 py-2 text-white"
>
  Update Password
</button>
    </div>
    )}
  </CardContent>
</Card>

<Card className="mt-6">
  <CardContent className="pt-6">

    <button
      onClick={() =>
        setShowLoginActivity(!showLoginActivity)
      }
      className="flex w-full items-center justify-between"
    >
      <h3 className="text-xl font-semibold">
        Login Activity
      </h3>

      {showLoginActivity ? (
        <ChevronUp size={22} />
      ) : (
        <ChevronDown size={22} />
      )}
    </button>

{showLoginActivity && (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="py-3 text-left">Date</th>
            <th className="py-3 text-left">Device</th>
            <th className="py-3 text-left">Location</th>
            <th className="py-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {loginLogs.map((log: any) => (
  <tr
    key={log.id}
    className="border-b"
  >
    <td className="py-3">
      {new Date(
        log.createdAt
      ).toLocaleString()}
    </td>

    <td>System</td>

    <td>{log.details}</td>

    <td className="text-green-600">
      Success
    </td>
  </tr>
))}
        </tbody>
      </table>
    </div>
    )}
  </CardContent>
</Card>

<Card className="mt-6">
  <CardContent className="pt-6">

    <button
      onClick={() =>
        setShowSessions(!showSessions)
      }
      className="flex w-full items-center justify-between"
    >
      <h3 className="text-xl font-semibold">
        Active Sessions
      </h3>

      {showSessions ? (
        <ChevronUp size={22} />
      ) : (
        <ChevronDown size={22} />
      )}
    </button>

{showSessions && (
    <div className="space-y-4">

      <div className="rounded-lg border p-4">
        <p className="font-semibold">
          Windows • Chrome
        </p>
        <p className="text-sm text-muted-foreground">
          Current Session
        </p>
      </div>

      <div className="rounded-lg border p-4">
        <p className="font-semibold">
          Android Device
        </p>
        <p className="text-sm text-muted-foreground">
          Logged In
        </p>
      </div>

      <button className="rounded-lg bg-red-600 px-5 py-2 text-white">
        Logout All Sessions
      </button>

    </div>
    )}
  </CardContent>
</Card>
    </AdminLayout>
  )
  }