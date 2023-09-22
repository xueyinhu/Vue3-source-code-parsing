const { terser } = require('rollup-plugin-terser')
const commonjs = require('@rollup/plugin-commonjs')
const typescript = require('rollup-plugin-typescript2')

const override = { compilerOptions: { module: 'ESNext' } }
module.exports = {

  input: 'src/core/index.ts',
  output: {
    file: 'dist/app.min.js',
    format: 'cjs',
    sourcemap: true,
    exports: 'default',
  },
  plugins: [typescript({ tsconfig: './tsconfig.json', tsconfigOverride: override }), commonjs(), terser()],
}

