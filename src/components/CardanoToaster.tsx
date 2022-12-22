import { useCardano } from "contexts/CardanoContext"
import { concatenateClasses } from "lib/concatenate-classes"
import { isNil } from "lodash"
import { useEffect, useMemo, useRef, useState } from "react"

interface CardanoToasterProps {
  position?: "topright" | "bottomright" | "bottomleft" | "topleft"
}

export const CardanoToaster = ({ position = "bottomright" }: CardanoToasterProps) => {
  const { toasterIsShowing, text, info, hideToaster, walletApiError, accountError, networkError } =
    useCardano()

  const [isManuallyOpen, setIsManuallyOpen] = useState(false)

  const openTimeout = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (openTimeout.current) clearTimeout(openTimeout.current)

    if (isManuallyOpen || !toasterIsShowing) return

    openTimeout.current = setTimeout(() => {
      hideToaster()
      setIsManuallyOpen(false)
    }, 10000)

    return () => {
      if (openTimeout.current) clearTimeout(openTimeout.current)
    }
  }, [isManuallyOpen, toasterIsShowing])

  const isValid = useMemo(
    () => isNil(networkError) && isNil(accountError) && isNil(walletApiError),
    [networkError, accountError, walletApiError]
  )

  const toasterClassNames = concatenateClasses(
    "cardano-toaster",
    toasterIsShowing && "cardano-toaster--open",
    (position === "topright" || position === "topleft") && "cardano-toaster--top",
    (position === "bottomright" || position === "bottomleft") && "cardano-toaster--bottom",
    (position === "topright" || position === "bottomright") && "cardano-toaster--right",
    (position === "topleft" || position === "bottomleft") && "cardano-toaster--left"
  )

  return (
    <div className={toasterClassNames} onMouseLeave={() => setIsManuallyOpen(false)}>
      <div className="cardano-toaster__content">
        <button className="cardano-toaster__close-button" onClick={hideToaster}>
          ✖
        </button>

        <div>
          {!isValid ? (
            <div>
              <div>Unable to connect wallet</div>

              <ul className="cardano-toaster__warning-list">
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
  )
}
