import "styles/styles.css"

import * as UseCardano from "use-cardano"

import type { AppProps } from "next/app"
export default function App({ Component, pageProps }: AppProps) {
  return (
    <UseCardano.Provider>
      <Component {...pageProps} />

      <UseCardano.Toaster />
    </UseCardano.Provider>
  )
}
