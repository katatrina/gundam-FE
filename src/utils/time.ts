import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale' // Import Vietnamese locale
import { Timestamp } from 'firebase/firestore'

const formatTimestamp = (timestamp: Timestamp) => {
  // Convert Firebase Timestamp to JavaScript Date
  const date = timestamp.toDate()

  // Always show relative time with "trước" suffix
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: vi,
  })
}

export default formatTimestamp
