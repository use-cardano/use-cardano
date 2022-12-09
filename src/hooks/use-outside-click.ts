import { useCallback, useEffect, useRef, useState } from "react"

export const useOutsideClick = () => {
  const [open, setOpen] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  const handleClickOutside = useCallback((e: any) => {
    if (!ref.current?.contains(e.target)) setOpen(false)
  }, [])

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  })

  return { ref, open, setOpen }
}
