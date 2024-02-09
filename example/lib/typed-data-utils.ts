import { Data, Lucid, TxHash, fromText } from "lucid-cardano"

// Type definition could be auto generated from on-chain script
const MyDatum = Data.Object({
  name: Data.String,
  age: Data.BigInt,
  colors: Data.Array(Data.String),
  description: Data.Nullable(Data.String),
})

type MyDatum = Data.Static<typeof MyDatum>

// to move from CBOR to typed data
export const parse = (data: string) => Data.from<MyDatum>(data, MyDatum)

export const send = async (lucid: Lucid, address: string): Promise<TxHash> => {
  const datum: MyDatum = {
    name: fromText("Lucid"),
    age: 0n,
    colors: [fromText("Blue"), fromText("Purple")],
    description: null,
  }

  const tx = await lucid
    .newTx()
    .payToAddressWithData(address, Data.to<MyDatum>(datum, MyDatum), {
      lovelace: 10000000n,
    })
    .complete()

  const signedTx = await tx.sign().complete()

  const txHash = await signedTx.submit()

  return txHash
}
