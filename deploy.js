const fs = require('fs')

const ipfs = require('ipfs-api')("localhost", '5001', {protocol: 'http'})

let abi = JSON.parse(fs.readFileSync('./build/Scrypt.abi'))
let bin = fs.readFileSync('./build/Scrypt.bin')

let info = JSON.parse(fs.readFileSync('./scrypt-task/info.json'))

const host = "http://localhost:8545"

const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(host))

const merkleRoot = require('./merkleRoot')

async function deploy() {

    //Upload file to IPFS
    let codeBuf = fs.readFileSync("./scrypt-task/task.wasm")

    let ipfsFile = (await ipfs.files.add([{content: codeBuf, path: "task.wasm"}]))[0]

    let ipfsHash = ipfsFile.hash
    let size = ipfsFile.size
    let name = ipfsFile.path
    

    if (ipfsHash == info.ipfsHash) {
	throw "Wrong IPFS Hashes"
    }

    //Deploy contract with appropriate artifacts

    let networkName = await web3.eth.net.getNetworkType()

    let artifacts = JSON.parse(fs.readFileSync('./truebit-os/wasm-client/' + networkName + '.json'))

    let accounts = await web3.eth.getAccounts()
    let account = accounts[0]

    let options = {from: accounts[0].toLowerCase(), gas: 2000000}

    let bundleID, codeFileID
    let initHash = info.codehash

    let tbFileSystem = new web3.eth.Contract(artifacts.fileSystem.abi, artifacts.fileSystem.address)

    //setup bundle
    let bundleNonce = Math.floor(Math.random()*Math.pow(2, 30))
    bundleID = await tbFileSystem.methods.calcId(bundleNonce).call({from: account})
    await tbFileSystem.methods.makeBundle(bundleNonce).send({from: account, gas: 300000})

    //setup file
    let fileNonce = Math.floor(Math.random()*Math.pow(2, 30))
    let mr = merkleRoot(web3, codeBuf)

    codeFileID = await tbFileSystem.methods.calcId(fileNonce).call({from: account})

    await tbFileSystem.methods.addIPFSCodeFile(name, size, ipfsHash, mr, initHash, fileNonce).send({from: account, gas: 300000})

    console.log("Registered IPFS file with Truebit filesystem")

    let args = [
	artifacts.incentiveLayer.address,
	artifacts.tru.address,
	artifacts.fileSystem.address,
	artifacts.depositsManager.address,
	bundleID,
	codeFileID,
	initHash
    ]

    let contract = new web3.eth.Contract(abi)
    
    let c = await contract.deploy({data: "0x" + bin, arguments: args}).send(options)

    let tru = new web3.eth.Contract(artifacts.tru.abi, artifacts.tru.address)

    tru.methods.transfer(c._address, "100000000000").send({from: accounts[0], gas:200000})

    fs.writeFileSync("export.json", JSON.stringify({
	address: c._address,
	abi: c._jsonInterface
    }))

    console.log("Contract has been deployed")
}

deploy()
