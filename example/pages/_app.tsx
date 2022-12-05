import "use-cardano/styles/use-cardano.css"
import "styles/styles.css"

import styles from "styles/index.module.css"
import { UseCardanoProvider, WalletProviderToaster } from "use-cardano"

import type { AppProps } from "next/app"

export default function App({ Component, pageProps, router }: AppProps) {
  const title = router.pathname.startsWith("/examples/") ? (
    <h1>{router.pathname.split("/").pop()?.replace(/-/g, " ")} example</h1>
  ) : (
    <h1>use-cardano examples</h1>
  )

  return (
    <>
      <UseCardanoProvider>
        <div className={styles.container}>
          {title}

          <Component {...pageProps} />
        </div>

        <WalletProviderToaster />
      </UseCardanoProvider>
    </>
  )
}
