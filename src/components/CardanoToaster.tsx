import { useCardano } from "contexts/CardanoContext"
import { useEffect, useRef, useState } from "react"

export const CardanoToaster = () => {
  const {
    toasterIsShowing,
    count,
    text,
    info,
    hideToaster,
    showToaster,
    walletApiError,
    accountError,
    networkError,
  } = useCardano()

  const [isManuallyOpen, setIsManuallyOpen] = useState(false)

  const openTimeout = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (openTimeout.current) clearTimeout(openTimeout.current)

    if (isManuallyOpen || !toasterIsShowing) return

    openTimeout.current = setTimeout(() => {
      hideToaster()
      setIsManuallyOpen(false)
    }, 6000)

    return () => {
      if (openTimeout.current) clearTimeout(openTimeout.current)
    }
  }, [count, isManuallyOpen, toasterIsShowing])

  const notificationClassNames = ["use-cardano-wallet-provider-toaster-notification-container"]

  if (count === 0 || toasterIsShowing)
    notificationClassNames.push("use-cardano-wallet-provider-toaster-notification-container-open")

  const toasterClassNames = ["use-cardano-wallet-provider-toaster-container"]

  if (toasterIsShowing) toasterClassNames.push("use-cardano-wallet-provider-toaster-container-open")

  return (
    <>
      <div className={notificationClassNames.join(" ")}>
        <div
          className="use-cardano-wallet-provider-toaster-notification-content"
          onClick={() => {
            showToaster()
            setIsManuallyOpen(true)
          }}
        >
          1
        </div>
      </div>

      <div className={toasterClassNames.join(" ")} onMouseLeave={() => setIsManuallyOpen(false)}>
        <div className="use-cardano-wallet-provider-toaster-content">
          <div className="use-cardano-wallet-provider-toaster-close-wrapper">
            <button className="use-cardano-wallet-provider-toaster-close" onClick={hideToaster}>
              ✖
            </button>
          </div>

          <div>
            {walletApiError || accountError || networkError ? (
              <div className="use-cardano-wallet-provider-toaster-warning">
                <div>Unable to connect wallet</div>

                <ul className="use-cardano-wallet-provider-toaster-warning-list">
                  {walletApiError && (
                    <li>
                      <small>
                        <i>{walletApiError.message}</i>
                      </small>
                    </li>
                  )}

                  {accountError && (
                    <li>
                      <small>
                        <i>{accountError.message}</i>
                      </small>
                    </li>
                  )}

                  {networkError && (
                    <li>
                      <small>
                        <i>{networkError.message}</i>
                      </small>
                    </li>
                  )}
                </ul>
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
