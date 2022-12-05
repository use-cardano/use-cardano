import "use-cardano/styles/use-cardano.css"
import "styles/styles.css"

import Link from "next/link"
import styles from "styles/index.module.css"
import { UseCardanoProvider, WalletProviderToaster } from "use-cardano"

import type { AppProps } from "next/app"

export default function App({ Component, pageProps, router }: AppProps) {
  const isAnExample = router.pathname.startsWith("/examples/")

  const title = isAnExample ? (
    <div>
      <h1>{router.pathname.split("/").pop()?.replace(/-/g, " ")} example</h1>
    </div>
  ) : (
    <div>
      <h1>use-cardano examples</h1>
    </div>
  )

  const backLink = isAnExample ? (
    <div>
      <Link href="/">Home</Link>
    </div>
  ) : null

  return (
    <>
      <UseCardanoProvider>
        <div className={styles.container}>
          {backLink}

          {title}

          <Component {...pageProps} />
        </div>

        <WalletProviderToaster />
      </UseCardanoProvider>
    </>
  )
}
