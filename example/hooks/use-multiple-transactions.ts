import { Lucid, fromText } from "lucid-cardano"
import { useCallback, useEffect, useState } from "react"

interface TransactionState {
  policyId?: string
  lovelace: number
  toAccount: string
}

const useMultipleTransactions = (isValid?: boolean, lucid?: Lucid) => {
  const [successMessage, setSuccessMessage] = useState<string>()
  const [error, setError] = useState<Error | undefined>()
  const [transactions, setTransactions] = useState<TransactionState[]>([])

  useEffect(() => {
    if (!successMessage) return

    const timeout = setTimeout(() => setSuccessMessage(undefined), 5000)

    return () => clearTimeout(timeout)
  }, [successMessage])

  const sendTransaction = useCallback(async () => {
    if (!lucid || transactions.some((t) => !t.toAccount || !t.lovelace)) return

    if (error) setError(undefined)

    try {
      let newTx = lucid.newTx()

      for (const transaction of transactions) {
        if (transaction.policyId) {
          const unit = transaction.policyId + fromText("TestTest")

          newTx = newTx.payToAddress(transaction.toAccount, {
            [unit]: BigInt(transaction.lovelace),
          })
        } else
          newTx = await newTx.payToAddress(transaction.toAccount, {
            lovelace: BigInt(transaction.lovelace),
          })
      }

      const tx = await newTx.complete()

      const signedTx = await tx.sign().complete()

      const txHash = await signedTx.submit()

      setTransactions([])
      setSuccessMessage(`Transaction submitted with hash ${txHash}`)
    } catch (e) {
      if (e instanceof Error) setError(e)
      else console.error(e)
    }
  }, [lucid, transactions, error])

  const policyIdSetter = useCallback(
    (index: number, value: string) => {
      setError(undefined)
      setSuccessMessage(undefined)

      if (index >= transactions.length || index < 0) return

      const newTransactions = [...transactions]

      newTransactions[index] = {
        ...newTransactions[index],
        policyId: value,
      }

      setTransactions(newTransactions)
    },
    [transactions]
  )

  const lovelaceSetter = useCallback(
    (index: number, value: string) => {
      setError(undefined)
      setSuccessMessage(undefined)

      if (index >= transactions.length || index < 0) return

      const parsed = parseInt(value)
      if (isNaN(parsed)) return

      const newTransactions = [...transactions]

      newTransactions[index] = {
        ...newTransactions[index],
        lovelace: parsed,
      }

      setTransactions(newTransactions)
    },
    [transactions]
  )

  const toAccountSetter = useCallback(
    (index: number, value: string) => {
      setError(undefined)
      setSuccessMessage(undefined)

      if (index >= transactions.length || index < 0) return

      const newTransactions = [...transactions]

      newTransactions[index] = {
        ...newTransactions[index],
        toAccount: value,
      }

      setTransactions(newTransactions)
    },
    [transactions]
  )

  const addTransaction = useCallback(() => {
    setTransactions([...transactions, { lovelace: 0, toAccount: "" }])
  }, [transactions])

  const removeTransaction = useCallback(
    (index: number) => {
      if (index >= transactions.length || index < 0) return

      const newTransactions = [...transactions]

      newTransactions.splice(index, 1)

      setTransactions(newTransactions)
    },
    [transactions]
  )

  return {
    error,
    successMessage,
    transactions,
    setPolicy: policyIdSetter,
    setLovelace: lovelaceSetter,
    setToAccount: toAccountSetter,
    sendTransaction,
    canTransact:
      isValid &&
      transactions.length > 0 &&
      transactions.every((t) => t.lovelace > 0 && t.toAccount),
    addTransaction,
    removeTransaction,
  }
}

export { useMultipleTransactions }
