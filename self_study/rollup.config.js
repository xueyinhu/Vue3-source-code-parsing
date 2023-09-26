// import ts from 'rollup-plugin-typescript2'
// import json from '@rollup/plugin-json'
// import resolvePlugin from '@rollup/plugin-node-resolve'
// import path from 'path'

const ts = require('rollup-plugin-typescript2')
const json = require('@rollup/plugin-json')
const resolvePlugin = require('@rollup/plugin-node-resolve')
const path = require('path')

// import { dirname } from "node:path"
// import { fileURLToPath } from "node:url"

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const __dirname = "E:/v_3/self_study/"
// import pkg from `file://E:/v_3/self_study/packages/reactivity/package.json` assert {type: 'json'}

const packagesDir = path.resolve(__dirname, "packages")
const packageDir = path.resolve(packagesDir, process.env.TARGET)
const resolve = p => path.resolve(packageDir, p)
const pkg = require(resolve("package.json"))
const name = path.basename(packageDir)


const outputOptions = {
    "esm-bundler": {
        file: resolve(`dist/${name}.esm-bundler.js`),
        format: 'es'
    },
    "cjs": {
        file: resolve(`dist/${name}.cjs.js`),
        format: 'cjs'
    },
    "global": {
        file: resolve(`dist/${name}.global.js`),
        format: 'iife'
    },
}

const options = pkg.buildOptions
function createConfig(format, output) {
    output.name = options.name
    output.sourcemap = true
    return {
        input: resolve('src/index.ts'),
        output,
        plugins: [
            json(),
            ts({
                tsconfig: path.resolve(__dirname, 'tsconfig.json')
            }),
            resolvePlugin()
        ]
    }
}

module.exports = options.formats.map(format => createConfig(format, outputOptions[format]))