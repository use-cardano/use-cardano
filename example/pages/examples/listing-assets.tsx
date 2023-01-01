import { ExampleWrapper } from "components/ExampleWrapper"
import { options } from "config/use-cardano-options"
import { useAssets } from "hooks/use-assets"
import { isNil } from "lodash"
import styles from "styles/example.module.css"
import { CardanoWalletSelector, useCardano, utility } from "use-cardano"

const ListingAssetsExample = () => {
  const { lucid, networkId } = useCardano()
  const { lovelace, assets } = useAssets(lucid, networkId)

  return (
    <>
      <div>
        <CardanoWalletSelector />
      </div>

      {lovelace > 0 && <div>ADA: {utility.lovelaceToAda(lovelace)}</div>}

      <div>
        <ul className={styles.assetsList}>
          {assets.map((a) => {
            const name = a.metadata?.name || a.onchain_metadata?.name || ""

            return (
              <li key={a.asset}>
                <div>
                  <>
                    {name}

                    {Number(a.quantity) > 1 &&
                      ` (${utility.lovelaceToAda(
                        Number(a.quantity) / Math.pow(10, a.metadata?.decimals || 0)
                      )})`}
                  </>
                </div>

                {!isNil(a.metadata?.logo) && (
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      width="64"
                      height="auto"
                      alt={`${name} logo`}
                      src={`data:image/png;base64,${a.metadata?.logo}`}
                    />
                  </div>
                )}

                {!isNil(a.onchain_metadata?.image) && (
                  <div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      width="64"
                      height="auto"
                      alt={`${name} NFT`}
                      src={(a.onchain_metadata?.image as string).replace(
                        "ipfs://",
                        "https://ipfs.blockfrost.dev/ipfs/"
                      )}
                    />
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}

const ListingAssetsExamplePage = () => (
  <ExampleWrapper options={options}>
    <ListingAssetsExample />
  </ExampleWrapper>
)

export default ListingAssetsExamplePage
