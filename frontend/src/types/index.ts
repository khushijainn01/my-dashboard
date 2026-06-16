export type Theme = "light" | "dark"

export type UserStatus = "Active" | "Inactive"

export interface User {
  id: number
  name: string
  email: string
  role: string
  status: UserStatus
}

export interface ActivityLog {
  id: number
  action: string
  user: string
  time: string
}

export interface Feedback {
  id: number
  user: string
  type: string
  message: string
}

export interface WeatherData {
  dt: number
  dt_txt: string
  main: {
    temp: number
    humidity: number
  }
  weather: Array<{
    main: string
    description: string
  }>
  wind: {
    speed: number
  }
}
