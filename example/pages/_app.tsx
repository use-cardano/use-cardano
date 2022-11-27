import "styles/styles.css"

import { UseCardanoProvider, WalletProviderToaster } from "use-cardano"

import type { AppProps } from "next/app"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UseCardanoProvider>
      <Component {...pageProps} />

      <WalletProviderToaster />
    </UseCardanoProvider>
  )
}
