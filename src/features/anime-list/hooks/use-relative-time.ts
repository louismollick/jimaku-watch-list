import { useEffect, useState } from "react"

export function useRelativeTime() {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setNow(Date.now())
    }, 60 * 1000)

    return () => window.clearInterval(timerId)
  }, [])

  return now
}
