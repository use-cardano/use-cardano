import { useCardanoContext } from "contexts/use-cardano-context"
import { useEffect, useRef, useState } from "react"

export const WalletProviderToaster = () => {
  const { toasterIsShowing, count, text, info, hideToaster } = useCardanoContext()

  const openTimeout = useRef<NodeJS.Timeout>()
  const progressInterval = useRef<ReturnType<typeof setInterval>>()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
      setProgress(0)
    }

    progressInterval.current = setInterval(() => {
      if (progress > 100) {
        setProgress(0)
        clearInterval(progressInterval.current)
      } else {
        setProgress((p) => p + 0.1)
      }
    }, 5000 / 1000)

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
        setProgress(0)
      }
    }
  }, [count, toasterIsShowing])

  useEffect(() => {
    if (toasterIsShowing) {
      if (openTimeout.current) clearTimeout(openTimeout.current)
      openTimeout.current = setTimeout(() => {
        setProgress(0)
        clearInterval(progressInterval.current)
        hideToaster()
      }, 5000)
    }

    return () => {
      if (openTimeout.current) clearTimeout(openTimeout.current)
    }
  }, [count, toasterIsShowing])

  return (
    <div
      style={{
        zIndex: 1000,
        fontFamily: '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
        fontSize: "1.1rem",
        position: "fixed",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.25)",
        top: "2rem",
        right: toasterIsShowing ? "2rem" : "-500px",
        transition: "right 0.2s ease-in-out",
        width: 400,
        textAlign: "left",
      }}
    >
      <div
        style={{
          height: "calc(100% - 2px)",
          padding: "1rem 2rem",
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

        <div>
          <div>{text || null}</div>

          <small>
            <i>{info || null}</i>
          </small>
        </div>
      </div>

      <div
        style={{
          height: 2,
          marginLeft: 3,
          width: `calc(${100 - progress}% - 6px)`,
          borderRadius: "5rem",
          background: "blue",
        }}
      />
    </div>
  )
}
