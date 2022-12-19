import { isObject } from "lodash"

export const isError = (e: any): e is { message: string } =>
  e instanceof Error || (isObject(e) && typeof (e as any)?.message === "string")
