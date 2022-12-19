import { NextApiHandler } from "next"
import httpProxyMiddleware from "next-http-proxy-middleware"

/*
  Since both testnet, preview and preprod are all using network id 1, it is impossible to distinguish them
  Use the one that makes sense for your use case
*/
const getTarget = (url?: string) => {
  if (url?.startsWith("/api/blockfrost/Testnet"))
    return "https://cardano-testnet.blockfrost.io/api/v0"
  if (url?.startsWith("/api/blockfrost/Preview"))
    return "https://cardano-preview.blockfrost.io/api/v0"
  if (url?.startsWith("/api/blockfrost/Preprod"))
    return "https://cardano-preprod.blockfrost.io/api/v0"
  if (url?.startsWith("/api/blockfrost/Mainnet"))
    return "https://cardano-mainnet.blockfrost.io/api/v0"
  return null
}

const getProjectId = (url?: string) => {
  if (url?.startsWith("/api/blockfrost/Testnet")) return process.env.BLOCKFROST_PROJECT_ID_TESTNET
  if (url?.startsWith("/api/blockfrost/Preview")) return process.env.BLOCKFROST_PROJECT_ID_PREVIEW
  if (url?.startsWith("/api/blockfrost/Preprod")) return process.env.BLOCKFROST_PROJECT_ID_PREPROD
  if (url?.startsWith("/api/blockfrost/Mainnet")) return process.env.BLOCKFROST_PROJECT_ID_MAINNET
  return null
}

const blockfrostProxy: NextApiHandler = async (req, res) => {
  const target = getTarget(req.url)
  const PROJECT_ID = getProjectId(req.url)

  try {
    if (!target || !PROJECT_ID) throw new Error("Invalid target or project id")

    const response = await httpProxyMiddleware(req, res, {
      target,
      headers: {
        PROJECT_ID,
      },
      pathRewrite: [
        {
          patternStr: "^/api/blockfrost/Testnet",
          replaceStr: "",
        },
        {
          patternStr: "^/api/blockfrost/Preview",
          replaceStr: "",
        },
        {
          patternStr: "^/api/blockfrost/Preprod",
          replaceStr: "",
        },
        {
          patternStr: "^/api/blockfrost/Mainnet",
          replaceStr: "",
        },
      ],
    })

    return response
  } catch (e) {
    console.error("Blockfrost proxy error", e)

    // NOTE(Alan): Not sure if this is compatible with Lucid / the Blockfrost provider
    return res.status(400).end()
  }
}

export default blockfrostProxy
