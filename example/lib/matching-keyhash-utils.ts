import { Constr, Data, Lovelace, Lucid, SpendingValidator, TxHash } from "lucid-cardano"

import * as helios from "@hyperionbt/helios"

const script: SpendingValidator = {
  type: "PlutusV1",
  script: JSON.parse(
    helios.Program.new(
      `
    spending matching_pubKeyHash
    struct Datum {
        owner: PubKeyHash
    }
    struct Redeemer {
        owner: PubKeyHash
    }
    func main(datum : Datum, redeemer: Redeemer) -> Bool {datum.owner == redeemer.owner}
`
    )
      .compile()
      .serialize()
  ).cborHex,
}

const scriptAddress = (lucid: Lucid) => lucid.utils.validatorToAddress(script)

export const lockUtxo = async (lucid: Lucid, lovelace: Lovelace): Promise<TxHash> => {
  const { paymentCredential } = lucid.utils.getAddressDetails(await lucid.wallet.address())

  // This represents the Datum struct from the Helios on-chain code
  const datum = Data.to(new Constr(0, [new Constr(0, [paymentCredential?.hash!])]))

  const address = scriptAddress(lucid)

  const tx = await lucid
    .newTx()
    .payToContract(address, datum, {
      lovelace,
    })
    .complete()

  const signedTx = await tx.sign().complete()

  return signedTx.submit()
}

export const redeemUtxo = async (lucid: Lucid): Promise<TxHash> => {
  const { paymentCredential } = lucid.utils.getAddressDetails(await lucid.wallet.address())

  // This represents the Redeemer struct from the Helios on-chain code
  const redeemer = Data.to(new Constr(0, [new Constr(0, [paymentCredential?.hash!])]))

  const datumHash = lucid.utils.datumToHash(redeemer)

  const address = scriptAddress(lucid)

  const utxos = await lucid.utxosAt(address)

  const utxo = utxos.find((utxo) => utxo.datumHash === datumHash)

  if (!utxo) throw new Error("UTxO not found.")

  const tx = await lucid
    .newTx()
    .collectFrom([utxo], redeemer)
    .attachSpendingValidator(script)
    .complete()

  const signedTx = await tx.sign().complete()

  return signedTx.submit()
}
