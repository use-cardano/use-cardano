export const shortAddress = (address?: string | null) =>
  address ? `${address.slice(0, 3)}...${address.slice(-4)}` : address
