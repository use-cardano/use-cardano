import fs from "fs-extra"
import path from "path"
import typescript from "@rollup/plugin-typescript"
import peerDepsExternal from "rollup-plugin-peer-deps-external"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"

import packageJson from "./package.json" assert { type: "json" }

// Note: Simple plugin to copy css files from src to dist
const copyCss = () => ({
  name: "copy-css",
  buildEnd: () => {
    const cssPath = path.resolve(process.cwd(), "styles")
    const distPath = path.resolve(process.cwd(), "dist/styles")

    fs.copy(cssPath, distPath, { overwrite: true }, (error) => {
      if (error) console.error(error)
    })
  },
})

// rollup.config.js
/**
 * @type {import('rollup').RollupOptions}
 */
export default {
  input: "src/index.ts",
  output: [
    {
      file: packageJson.module,
      format: "esm",
      sourcemap: true,
      assetFileNames: "[name]-[hash][extname]",
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    copyCss(),
    typescript({
      noEmit: true,
      exclude: ["node_modules/**", "example/**"],
    }),
  ],
  external: ["react", "react-dom"],
}
