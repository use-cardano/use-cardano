import typescript from "@rollup/plugin-typescript"
import peerDepsExternal from "rollup-plugin-peer-deps-external"
import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"

import packageJson from "./package.json" assert { type: "json" }

export default {
  input: "src/index.ts",
  output: [
    {
      file: packageJson.module,
      format: "esm", // import '' from  '...
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      exclude: ["node_modules/**", "example/**"],
    }),
  ],
  external: ["react", "react-dom"],
}
