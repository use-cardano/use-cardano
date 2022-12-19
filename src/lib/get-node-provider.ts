import { Blockfrost } from "lucid-cardano"
import { TestnetNetwork, UseCardanoNodeOptions } from "use-cardano"

export const getNodeProvider = ({
  testnetNetwork,
  networkId,
  provider,
  projectId,
  proxyUrl,
}: UseCardanoNodeOptions & { testnetNetwork: TestnetNetwork; networkId: number }) => {
  const network = networkId === 0 ? testnetNetwork : "Mainnet"

  if (provider === "blockfrost") {
    return new Blockfrost(
      `https://cardano-${network.toLowerCase()}.blockfrost.io/api/v0`,
      projectId
    )
  }

  if (provider === "blockfrost-proxy") return new Blockfrost(`${proxyUrl}/${network}`)

  throw new Error(`Unknown provider: ${provider}`)
}
