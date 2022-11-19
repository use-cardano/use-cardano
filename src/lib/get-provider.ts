import { UseCardanoNodeOptions } from "hooks/use-cardano"
import { Blockfrost } from "lucid-cardano"

const getProvider = ({
  networkId,
  provider,
  projectId,
  proxyUrl,
}: UseCardanoNodeOptions & { networkId: number }) => {
  if (provider === "blockfrost") {
    const network = networkId === 0 ? "testnet" : "mainnet"

    return new Blockfrost(
      `https://cardano-${network.toLowerCase()}.blockfrost.io/api/v0`,
      projectId
    )
  }

  if (provider === "blockfrost-proxy") return new Blockfrost(`${proxyUrl}/${networkId}`)

  throw new Error(`Unknown provider: ${provider}`)
}

export { getProvider }
