import "../styles/styles.css"

import type { AppProps } from 'next/app'
import { UseCardanoProvider, Toaster } from "use-cardano"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UseCardanoProvider>
      <Component {...pageProps} />

      <Toaster />
    </UseCardanoProvider>
  )
}
