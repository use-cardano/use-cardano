import { useCardanoContext } from "contexts/use-cardano-context"
import { useEffect, useRef, useState } from "react"

export const WalletProviderToaster = () => {
  const {
    toasterIsShowing,
    count,
    text,
    info,
    hideToaster,
    showToaster,
    walletApiError,
    accountError,
  } = useCardanoContext()

  const [isManuallyOpen, setIsManuallyOpen] = useState(false)

  const openTimeout = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (openTimeout.current) clearTimeout(openTimeout.current)

    if (isManuallyOpen || !toasterIsShowing) return

    openTimeout.current = setTimeout(() => {
      hideToaster()
      setIsManuallyOpen(false)
    }, 3000)

    return () => {
      if (openTimeout.current) clearTimeout(openTimeout.current)
    }
  }, [count, isManuallyOpen, toasterIsShowing])

  return (
    <>
      <div
        style={{
          userSelect: "none",
          zIndex: 1000,
          fontFamily: '"Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif',
          fontSize: "1.1rem",
          position: "fixed",
          background: "white",
          borderRadius: "50%",
          boxShadow: "0px 0px 8px rgba(0, 0, 0, 0.25)",
          top: "2rem",
          right: "2rem",
          opacity: count === 0 || toasterIsShowing ? 0 : 1,
          transition: "opacity 0.2s ease-in-out",
          transitionDelay: toasterIsShowing ? "0s" : "0.2s",
          width: "2rem",
          height: "2rem",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            height: "100%",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            showToaster()
            setIsManuallyOpen(true)
          }}
        >
          1
        </div>
      </div>

      <div
        style={{
          userSelect: "none",
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
        onMouseLeave={() => setIsManuallyOpen(false)}
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
            {walletApiError || accountError ? (
              <div style={{ color: "red" }}>
                <div>Unable to connect wallet</div>

                {walletApiError && (
                  <small>
                    <i>{walletApiError.message}</i>
                  </small>
                )}

                {accountError && (
                  <small>
                    <i>{accountError.message}</i>
                  </small>
                )}
              </div>
            ) : (
              <>
                <div>{text || null}</div>

                <small>
                  <i>{info || null}</i>
                </small>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
