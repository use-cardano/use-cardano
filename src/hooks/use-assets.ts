import { isNil, sortBy } from "lodash"
import { fromUnit, Lucid } from "lucid-cardano"
import { useCallback, useEffect, useState } from "react"
import { utility } from "use-cardano"

// should this be an addon perhaps?

import { Responses } from "@blockfrost/blockfrost-js"

type Value = ReturnType<typeof fromUnit>

interface ValueWithName extends Omit<Value, "name"> {
  value: number
  name: string
}

type Options = {
  lucid?: Lucid
  networkId?: number
  policyId?: string
}

export const useAssets = (options: Options): Responses["asset"][] => {
  const [assets, setAssets] = useState<Responses["asset"][]>([])

  const fetchAdaHandles = useCallback(async () => {
    if (!options.lucid?.wallet || isNil(options.networkId) || isNil(options.policyId)) return

    const utxos = await options.lucid.wallet.getUtxos()

    const allUtxos = utxos
      .map((u) => Object.keys(u.assets).map((key) => ({ key, value: u.assets[key] })))
      .reduce((acc, curr) => [...acc, ...curr], [])
      .map((a) => ({
        ...fromUnit(a.key),
        value: Number(a.value),
      }))

    const utxoAssets = allUtxos
      .filter((u) => u.policyId === options.policyId)
      .filter((v: Value): v is ValueWithName => v.name !== null)
      .map((a) => ({
        ...a,
        fullyQualifiedAssetName: `${a.policyId}${a.name}`,
      }))

    const assetsWithMetadata: Responses["asset"][] = await Promise.all(
      utxoAssets.map((a) =>
        fetch(
          `/api/blockfrost/${utility.toNetworkName(options.networkId as number)}/assets/${
            a.fullyQualifiedAssetName
          }`
        ).then((r) => r.json())
      )
    )

    const sortedAssets = sortBy(
      assetsWithMetadata,
      (a) => (Number(a.quantity) === 1 ? 1 : -1),
      "policy_id",
      "metadata.name",
      "onchain_metadata.name"
    )

    setAssets(sortedAssets)
  }, [options.lucid?.wallet, options.networkId, options.policyId])

  useEffect(() => {
    fetchAdaHandles()
  }, [fetchAdaHandles])

  return assets
}
