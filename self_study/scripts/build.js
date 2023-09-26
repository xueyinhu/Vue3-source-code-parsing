// import fs from 'fs'
// import {execa} from 'execa'

const fs = require('fs')
const execa = require('execa')

const dirs = fs.readdirSync('packages').filter(p => {
    if (!fs.statSync(`packages/${p}`).isDirectory()) {
        return false
    }
    return true
})

async function build(target) {
    await execa("rollup", ["-c", "--environment", `TARGET:${target}`], {stdio: 'inherit'})
}

async function runParallel(dirs, item_fn) {
    let result = []
    for (let item of dirs) {
        result.push(item_fn(item))
    }
    return Promise.all(result)
}

runParallel(dirs, build).then(() => {
    console.log("打包成功");
})