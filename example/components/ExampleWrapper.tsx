import React from "react"
import { CardanoProvider, UseCardanoOptions, CardanoToaster } from "mynth-use-cardano"
import styles from "styles/example.module.css"
import { useRouter } from "next/router"
import Link from "next/link"

interface Props {
  options: UseCardanoOptions
}

export const ExampleWrapper = ({ children, options }: React.PropsWithChildren<Props>) => {
  const { pathname } = useRouter()

  const isAnExample = pathname.startsWith("/examples/")

  const title = isAnExample ? (
    <div>
      <h1>{pathname.split("/").pop()?.replace(/-/g, " ")} example</h1>
    </div>
  ) : (
    <div>
      <h1>mynth-use-cardano examples</h1>
    </div>
  )

  const backLink = isAnExample ? (
    <div>
      <Link href="/">Back to examples</Link>
    </div>
  ) : null

  return (
    <CardanoProvider options={options}>
      <div className={styles.container}>
        {backLink}

        {title}

        {children}
      </div>

      <CardanoToaster />
    </CardanoProvider>
  )
}
