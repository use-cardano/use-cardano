import "../styles/styles.css"

import type { AppProps } from 'next/app'
import * as UseCardano from "use-cardano"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UseCardano.Provider>
      <Component {...pageProps} />

      <UseCardano.Toaster />
    </UseCardano.Provider>
  )
}
