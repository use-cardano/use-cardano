import "mynth-use-cardano/styles/mynth-use-cardano.css"
import "styles/styles.css"

import type { AppProps } from "next/app"

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
