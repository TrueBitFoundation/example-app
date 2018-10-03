const truffleContract = require('truffle-contract')

function showJSScrypt(hash) {
    return "<div>Scrypt Hash from js-scrypt:</div> <div>" + hash + "</div>"
}

function showTruebitScrypt(hash) {
    return "<div>Scrypt Hash from TrueBit solver:</div> <div>" + hash + "</div>"
}

var fileSystem, scryptSubmitter, account

function getTruebitScrypt(data) {

    return scryptSubmitter.submitData(data, {gas: 2000000, from: account}).then(function(txHash) {

	const gotFilesEvent = scryptSubmitter.GotFiles()

	return new Promise((resolve, reject) => {
	    gotFilesEvent.watch(function(err, result) {
		if (result) {
		    gotFilesEvent.stopWatching(x => {})
		    resolve(result.args.files[0])		    
		} else if(err) {
		    reject()
		}
	    })	    
	})
    }).then(function(fileID) {
	return fileSystem.getData.call(fileID)
    }).then(function(lst) {
	return lst[0]
    })
    
}

window.runScrypt = function () {
    data = document.getElementById('input-data').value
    hash = s.crypto_scrypt(data, "foo", 1024, 1, 1, 256)
    document.getElementById('js-scrypt').innerHTML = showJSScrypt(s.to_hex(hash))

    getTruebitScrypt(data).then(function(truHash) {
	document.getElementById('tb-scrypt').innerHTML = showTruebitScrypt(truHash)
    })    
}

function getArtifacts(networkName) {
    httpRequest = new XMLHttpRequest()

    httpRequest.onreadystatechange = async function() {
	if (httpRequest.readyState === XMLHttpRequest.DONE) {
	    //get scrypt submitter artifact
	    const artifacts = JSON.parse(httpRequest.responseText)

	    fileSystem = truffleContract({
		abi: artifacts.fileSystem.abi,
	    })

	    fileSystem.setProvider(window.web3.currentProvider)

	    fileSystem = await fileSystem.at(artifacts.fileSystem.address)

	    scryptSubmitter = truffleContract({
		abi: artifacts.scrypt.abi
	    })

	    scryptSubmitter.setProvider(window.web3.currentProvider)

	    scryptSubmitter = await scryptSubmitter.at(artifacts.scrypt.address)

	    account = window.web3.eth.defaultAccount	   
	}
    }

    httpRequest.open('GET', '/contracts?network=' + networkName)
    httpRequest.send()
}

function init() {
    const isMetaMaskEnabled = function() { return !!window.web3 }

    if (!isMetaMaskEnabled()) {
	document.getElementById('app').innerHTML = "Please install MetaMask"
    } else {

	//alert(networkType)
	window.web3.version.getNetwork((err, netId) => {
	    if(netId == '1') {
		getArtifacts('main')
	    } else if(netId == '3') {
		getArtifacts('ropsten')
	    } else if(netId == '4') {
		getArtifacts('rinkeby')
	    } else if(netId == '42') {
		getArtifacts('kovan')
	    } else {
		getArtifacts('private')
	    }
	})
	
    }
}

window.onload = init
