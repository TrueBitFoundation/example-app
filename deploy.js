const fs = require('fs')

let abi = fs.readFileSync('./build/Scrypt.abi')
let bin = fs.readFileSync('./build/Scrypt.bin')

let info = JSON.parse(fs.readFileSync('./scrypt-task/info.json'))

const host = "http://localhost:8545"

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(host))

let contract = new web3.eth.Contract(abi)

(async function () {

    let networkName = await web3.eth.net.getNetworkType()

    let artifacts = JSON.parse(fs.readFileSync('./truebit-os/wasm-client/' + networkName + '.json'))

    let accounts = await web3.getAccounts()

    let options = {from: accounts[0], gas: 2000000}

    let args = [
	artifacts.incentiveLayer.address,
	artifacts.tru.address,
	artifacts.fileSystem.address,
	info.ipfsHash,
	info.codeHash
    ]
    
    await contract.deploy({data: "0x" + bin, arguments: args}).send(options)
})()
