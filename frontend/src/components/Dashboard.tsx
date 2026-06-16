import { useEffect, useState } from "react"
import { CloudSun } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { WeatherData } from "@/types"

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<WeatherData[]>([])
  
  const [weatherError, setWeatherError] = useState("")
  const [stats, setStats] = useState({
  totalUsers: 0,
  notifications: 0,
  activityLogs: 0,
})

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
  fetch("http://localhost:5000/api/dashboard-stats")
    .then((res) => res.json())
    .then((data) => {
      setStats(data.data)
    })
    .catch((err) => console.error(err))
}, [])

  useEffect(() => {
    const apiKey = import.meta.env.VITE_WEATHER_API_KEY
    if (!apiKey) {
      setWeatherError("Weather API key not configured. Add VITE_WEATHER_API_KEY to .env")
      return
    }

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=Jaipur&units=metric&appid=${apiKey}`
        )
        const data = await response.json()

        if (data.cod === "200" && Array.isArray(data.list)) {
          setWeather(data.list[0])
          setForecast(
            data.list.filter((item: WeatherData) =>
              item.dt_txt.includes("12:00:00")
            )
          )
        } else {
          setWeatherError("Unable to load weather data")
        }
      } catch {
        setWeatherError("Failed to fetch weather data")
      }
    }

    fetchWeather()
  }, [])

  const greeting =
    currentTime.getHours() < 12
      ? "Morning"
      : currentTime.getHours() < 16
        ? "Afternoon"
        : "Evening"

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Good {greeting}, Khushi 👋
        </h1>
        <p className="mt-2 text-muted-foreground">
          {currentTime.toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p className="text-xl font-semibold text-foreground">
          {currentTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div className="grid gap-4 mb-8 md:grid-cols-3">
  <Card>
    <CardContent className="pt-6 text-center">
      <h3 className="text-muted-foreground">Total Users</h3>
      <p className="text-4xl font-bold">
        {stats.totalUsers}
      </p>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="pt-6 text-center">
      <h3 className="text-muted-foreground">
        Notifications
      </h3>
      <p className="text-4xl font-bold">
        {stats.notifications}
      </p>
    </CardContent>
  </Card>

  <Card>
    <CardContent className="pt-6 text-center">
      <h3 className="text-muted-foreground">
        Activity Logs
      </h3>
      <p className="text-4xl font-bold">
        {stats.activityLogs}
      </p>
    </CardContent>
  </Card>
</div>

      <Card className="border-blue-100 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30">
        <CardContent className="pt-6">
          {weatherError ? (
            <p className="text-muted-foreground">{weatherError}</p>
          ) : weather ? (
            <>
              <div className="flex items-center gap-6">
                <CloudSun size={60} className="text-yellow-500" />
                <div>
                  <h3 className="text-4xl font-bold">
                    {Math.round(weather.main.temp)}°C
                  </h3>
                  <p className="text-muted-foreground">Jaipur</p>
                  <p className="capitalize text-muted-foreground">
                    {weather.weather[0]?.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Card size="sm">
                  <CardContent>
                    <p className="text-muted-foreground">Humidity</p>
                    <p className="font-semibold">{weather.main.humidity}%</p>
                  </CardContent>
                </Card>
                <Card size="sm">
                  <CardContent>
                    <p className="text-muted-foreground">Wind</p>
                    <p className="font-semibold">{weather.wind.speed} m/s</p>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">Loading weather...</p>
          )}
        </CardContent>
      </Card>

      {forecast.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>5-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {forecast.map((day) => (
                <Card key={day.dt} size="sm" className="text-center">
                  <CardContent>
                    <p className="font-semibold">
                      {new Date(day.dt_txt).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </p>
                    <CloudSun
                      size={32}
                      className="mx-auto my-2 text-yellow-500"
                    />
                    <p className="text-xl font-bold">
                      {Math.round(day.main.temp)}°C
                    </p>
                    <p className="text-sm capitalize text-muted-foreground">
                      {day.weather[0]?.main}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
