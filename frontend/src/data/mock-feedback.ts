import type { Feedback } from "@/types"

export const initialFeedbacks: Feedback[] = [
  { id: 1, user: "John Doe", type: "Suggestion", message: "Please add dark mode support." },
  { id: 2, user: "Jane Smith", type: "Complaint", message: "Notifications are sometimes delayed." },
  { id: 3, user: "Mike Johnson", type: "Feature Request", message: "Add export to Excel option." },
]
