function showJSScrypt(hash) {
    return "<div>Scrypt Hash from js-scrypt:</div> <div>" + hash + "</div>"
}

function showTruebitScrypt(hash) {
    return "<div>Scrypt Hash from TrueBit solver:</div> <div>" + hash + "</div>"
}

var incentiveLayer, fileSystem

const taskInfo = {
    "ipfshash":"QmZGf6QCViGi7VPZSp97EkvDX9NuNyspZvgpXs1Wq73u4L",
    "codehash":"0xcb1f3611566c137482d4a5b560896d2142a13450915d8e17e7dd9c24736a164c",
    "memsize":20
}

function getTruebitScrypt(data) {

    //handle file system work
    
}

function runScrypt() {
    data = document.getElementById('input-data').value
    hash = s.crypto_scrypt(data, "foo", 1024, 1, 1, 256)
    document.getElementById('js-scrypt').innerHTML = showJSScrypt(s.to_hex(hash))

    document.getElementById('tb-scrypt').innerHTML = showTruebitScrypt("foobar")
}

function getArtifacts(networkName) {
    httpRequest = new XMLHttpRequest()

    httpRequest.onreadystatechange = function() {
	if (httpRequest.readyState === XMLHttpRequest.DONE) {
	    //get scrypt submitter artifact
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
