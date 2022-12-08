import { Lucid, MintingPolicy, PolicyId, TxHash, Unit, utf8ToHex } from "lucid-cardano"

interface Options {
  lucid: Lucid
  mintingPolicy: MintingPolicy
  policyId: string
  name: string
}

const getMintingPolicy = (lucid: Lucid, address: string) => {
  const { paymentCredential } = lucid.utils.getAddressDetails(address)

  const mintingPolicy: MintingPolicy = lucid.utils.nativeScriptFromJson({
    type: "all",
    scripts: [
      { type: "sig", keyHash: paymentCredential?.hash! },
    ],
  })

  return mintingPolicy
}

const getPolicyId = (lucid: Lucid, mintingPolicy: MintingPolicy) => {
  const policyId: PolicyId = lucid.utils.mintingPolicyToId(mintingPolicy)

  return policyId
}

const mintNFT = async ({ lucid, mintingPolicy, policyId, name }: Options): Promise<TxHash> => {
  const unit: Unit = policyId + utf8ToHex(name)

  const tx = await lucid
    .newTx()
    .mintAssets({ [unit]: 1n })
    .validTo(Date.now() + 100000)
    .attachMintingPolicy(mintingPolicy)
    .complete()

  const signedTx = await tx.sign().complete()

  const txHash = await signedTx.submit()

  return txHash
}

const burnNFT = async ({ lucid, mintingPolicy, policyId, name }: Options): Promise<TxHash> => {
  const unit: Unit = policyId + utf8ToHex(name)

  console.log("mintingPolicy", mintingPolicy)
  console.log("policyId", policyId)
  console.log("name", name)
  console.log("unit", unit)

  const tx = await lucid
    .newTx()
    .mintAssets({ [unit]: -1n })
    .validTo(Date.now() + 100000)
    .attachMintingPolicy(mintingPolicy)
    .complete()

  const signedTx = await tx.sign().complete()

  const txHash = await signedTx.submit()

  return txHash
}

export const mintingUtils = {
  getMintingPolicy,
  getPolicyId,
  mintNFT,
  burnNFT,
}
