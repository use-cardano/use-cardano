import { useCardanoContext } from "contexts/use-cardano-context"
import { useEffect, useRef, useState } from "react"

interface Props {
  content?: string | null
  subContent?: string | null
}

const Toaster = ({ content = null, subContent = null }: Props) => {
  const { toasterIsShowing, text, hideToaster } = useCardanoContext()

  const openTimeout = useRef<NodeJS.Timeout>()
  //   const progressTimeout = useRef<NodeJS.Timeout>()
  //   const [progressOngoing, setProgressOngoing] = useState(false)

  useEffect(() => {
    if (!toasterIsShowing) return

    // if (!open) return

    // setProgressOngoing(false)

    // if (openTimeout.current) clearTimeout(openTimeout.current)
    // progressTimeout.current = setTimeout(() => {
    //   setProgressOngoing(true)
    // }, 1000)

    if (openTimeout.current) clearTimeout(openTimeout.current)
    openTimeout.current = setTimeout(() => {
      hideToaster()
      //   setProgressOngoing(false)
      //   setOpen(false)
    }, 5000)

    return () => {
      //   if (progressTimeout.current) clearTimeout(progressTimeout.current)
      if (openTimeout.current) clearTimeout(openTimeout.current)
    }
  }, [toasterIsShowing])

  return (
    <div
      style={{
        fontFamily: '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
        fontSize: "1.1rem",
        position: "fixed",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.25)",
        padding: "1rem 2rem",
        top: "2rem",
        right: toasterIsShowing ? "2rem" : "-500px",
        transition: "right 0.2s ease-in-out",
        width: 400,
        textAlign: "left",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 5,
          right: 5,
        }}
      >
        <button
          style={{
            background: "none",
            border: "none",
            outline: "none",
            cursor: "pointer",
          }}
          onClick={hideToaster}
        >
          ✖
        </button>
      </div>

      <div>{text || null}</div>

      {/* <div
        style={{
          width: open ? "100%" : "0%",
          transition: progressOngoing ? "width 4s" : "none",
        }}
      /> */}
    </div>
  )
}

export { Toaster }
