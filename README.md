# TrueBit Example Application

This repository serves as an example project that uses truebit-os as a dependency.

# Installation

Make sure you already have `solc` installed and an Ethereum node on port 8545.

```
npm i

chmod 755 install_truebit_os.sh
./install_truebit_os.sh

```

# Usage

Start truebit-os in the background. You will also need to be running an ipfs daemon on port 5001

```
cd truebit-os
npm run truebit wasm-client/config.json
```

This will start up the shell. We can start a solver on account 1 like so:
```
start solve -a 1
```

Now we will be able to send tasks to the solver via our simple webapp.

Start up the webapp:
```
node index.js
```

And navigate to `localhost:3000` in a MetaMask compatible browser.

Make sure to connect MetaMask to localhost:8545, and send the initial account some Ether so it can send transactions.


