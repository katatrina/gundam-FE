import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns'
import { vi } from 'date-fns/locale' // Import Vietnamese locale
import { Timestamp } from 'firebase/firestore'

const formatTimestamp = (timestamp: Timestamp) => {
  // Convert Firebase Timestamp to JavaScript Date
  const date = timestamp.toDate()

  // If the date is today, show relative time
  if (isToday(date)) {
    return formatDistanceToNow(date, { addSuffix: true, locale: vi })
  }

  // If the date is yesterday
  if (isYesterday(date)) {
    return `Hôm qua, ${format(date, 'HH:mm')}`
  }

  // If the date is within this year
  if (date.getFullYear() === new Date().getFullYear()) {
    return format(date, "dd 'thg' MM, HH:mm")
  }

  // For older dates
  return format(date, "dd 'thg' MM, yyyy HH:mm")
}

export default formatTimestamp
