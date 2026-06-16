import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
// import { useAuth } from "@/contexts/AuthContext"

export default function Login() {
  const navigate = useNavigate()
  // const { login, isAuthenticated } = useAuth()

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate("/dashboard", { replace: true })
  //   }
  // }, [isAuthenticated, navigate])

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
  try {
    console.log('khushi- '  + username);

    setError("");

    const response = await fetch(
      "http://localhost:5000/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      }
    );

    const data = await response.json();

    console.log("Response:", data);

    if (data.success) {
  localStorage.setItem("isLoggedIn", "true");

  const expiryTime =
    Date.now() + 30 * 60 * 1000; // 30 minutes

  localStorage.setItem(
    "sessionExpiry",
    expiryTime.toString()
  );

  window.location.href = "/dashboard";
}
    
    else {
      setError(data.message);
    }
  } catch (error) {
    console.error(error);
    setError("Server Error");
  }
}

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin()
  }

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-[#eaf1f5] p-6 dark:bg-background">
      <div className="relative flex h-[520px] w-full max-w-6xl overflow-hidden rounded-[30px] bg-card shadow-2xl">
        <div className="z-20 flex w-[58%] flex-col justify-center bg-card px-14">
          <h1 className="mb-10 text-[54px] font-bold text-[#283ea7]">SIGN IN</h1>

          {error && (
            <p className="mb-4 text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="mb-8 w-[80%] space-y-2">
            <Label htmlFor="username">User Name</Label>
            <Input
              id="username"
              type="text"
              placeholder="User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-0 border-b border-gray-400 rounded-none px-0 shadow-none focus-visible:ring-0"
            />
          </div>

          <div className="mb-8 w-[80%] space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-0 border-b border-gray-400 rounded-none px-0 shadow-none focus-visible:ring-0"
            />
          </div>

          <Button
            onClick={handleLogin}
            className="h-[42px] w-[220px] bg-[#2f3192] font-semibold hover:bg-[#25277c]"
          >
            Login
          </Button>

          <div className="mt-5 flex w-[80%] items-center justify-between text-sm text-muted-foreground">
            <label className="flex cursor-pointer items-center gap-2">
              <Checkbox
                checked={rememberMe}
                onCheckedChange={(checked) =>
                  setRememberMe(checked === true)
                }
              />
              Remember
            </label>

            <button
              type="button"
              className="text-[#2f3192] hover:underline"
              onClick={() => alert("Forgot Password feature coming soon!")}
            >
              Forgot Password?
            </button>
          </div>
        </div>

        <div className="absolute top-0 right-0 h-full w-[48%] bg-[#27258a]">
          <div className="absolute top-16 left-16 h-12 w-12 rounded-full border border-blue-400 opacity-40" />
          <div className="absolute top-40 right-24 h-40 w-40 rounded-full border border-blue-400 opacity-30" />
          <div className="absolute bottom-20 left-20 h-6 w-6 rotate-45 border border-blue-400 opacity-40" />
          <div className="absolute right-28 bottom-32 text-5xl text-blue-300 opacity-30">
            +
          </div>
          <div className="absolute top-24 right-40 text-4xl text-blue-300 opacity-30">
            ○
          </div>
        </div>

        <div className="absolute top-0 left-[50%] z-10 h-full w-[180px]">
          <svg viewBox="0 0 200 600" preserveAspectRatio="none" className="h-full w-full">
            <path
              d="M80,0 C170,120 170,220 100,300 C40,390 40,500 80,600 L200,600 L200,0 Z"
              fill="#27258a"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
