import { isObject } from "lodash"

export const hasErrorCode = (e: any): e is { code: number } =>
  e instanceof Error || (isObject(e) && typeof (e as any)?.code === "number")
