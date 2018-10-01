function showJSScrypt(hash) {
    return "<div>Scrypt Hash from js-scrypt:</div> <div>" + hash + "</div>"
}

function showTruebitScrypt(hash) {
    return "<div>Scrypt Hash from TrueBit solver:</div> <div>" + hash + "</div>"
}

function runScrypt() {
    data = document.getElementById('input-data').value
    hash = s.crypto_scrypt(data, "foo", 1024, 1, 1, 256)
    document.getElementById('js-scrypt').innerHTML = showJSScrypt(s.to_hex(hash))

    document.getElementById('tb-scrypt').innerHTML = showTruebitScrypt("foobar")
}

function init() {
    const isMetaMaskEnabled = function() { return !!window.web3 }

    if (!isMetaMaskEnabled()) {
	document.getElementById('app').innerHTML = "Please install MetaMask"
    }    
}

window.onload = init
