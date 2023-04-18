import { defineConfig } from 'rollup'
import autoExternal from 'rollup-plugin-auto-external'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import swc from '@rollup/plugin-swc'
import terser from '@rollup/plugin-terser'

export default defineConfig({
  watch: { include: ['src/**/*'] },
  input: 'src/index.ts',
  output: { dir: 'dist', format: 'cjs' },
  plugins: [
    autoExternal(),
    nodeResolve({ extensions: ['.ts', '.mjs', '.js', '.json', '.node'] }),
    swc({ swc: { jsc: { parser: { syntax: 'typescript', dynamicImport: true } } } }),
    terser(),
  ],
})
