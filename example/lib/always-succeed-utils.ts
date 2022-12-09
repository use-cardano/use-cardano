import { Address, Data, Lovelace, Lucid, SpendingValidator, TxHash } from "lucid-cardano"

const alwaysSucceedScript: SpendingValidator = {
  type: "PlutusV2",
  script: "49480100002221200101",
}

const alwaysSucceedAddress = (lucid: Lucid): Address =>
  lucid.utils.validatorToAddress(alwaysSucceedScript)

const Datum = () => Data.empty()
const Redeemer = () => Data.empty()

export const lockUtxo = async (lucid: Lucid, lovelace: Lovelace): Promise<TxHash> => {
  const address = alwaysSucceedAddress(lucid)

  const tx = await lucid
    .newTx()
    .payToContract(address, { inline: Datum() }, { lovelace })
    .payToContract(
      address,
      {
        asHash: Datum(),
        scriptRef: alwaysSucceedScript, // adding plutusV2 script to output
      },
      {}
    )
    .complete()

  const signedTx = await tx.sign().complete()

  const txHash = await signedTx.submit()

  return txHash
}

export const redeemUtxo = async (lucid: Lucid): Promise<TxHash> => {
  const address = alwaysSucceedAddress(lucid)

  const referenceScriptUtxo = (await lucid.utxosAt(address)).find((utxo) => Boolean(utxo.scriptRef))
  if (!referenceScriptUtxo) throw new Error("Reference script not found")

  const utxo = (await lucid.utxosAt(address)).find(
    (utxo) => utxo.datum === Datum() && !utxo.scriptRef
  )
  if (!utxo) throw new Error("Spending script utxo not found")

  const tx = await lucid
    .newTx()
    .readFrom([referenceScriptUtxo]) // spending utxo by reading plutusV2 from reference utxo
    .collectFrom([utxo], Redeemer())
    .complete()

  const signedTx = await tx.sign().complete()

  const txHash = await signedTx.submit()

  return txHash
}
