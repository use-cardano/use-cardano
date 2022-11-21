import { C, fromHex } from "lucid-cardano"

export const hexArrayToAddress = (hexArray: string[]) =>
  hexArray.length > 0 ? C.Address.from_bytes(fromHex(hexArray[0])).to_bech32(undefined) : null
