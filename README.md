# TrueBit Example Application

*NOTE* This has only been tried on Ubuntu *NOTE*

This repository serves as an example project that uses truebit-os as a dependency.

[Video demonstration](https://www.youtube.com/watch?v=dDzPCMBlZN4)

# Installation

You will need:

- `npm` installed
- `solc` installed
- An Ethereum node on port 8545 (`ganache-cli`)
- `ipfs daemon` on port 5001
- `browserify` installed

```
npm i

chmod 755 install_truebit_os.sh
./install_truebit_os.sh

browserify public/js/app.js -o public/js/bundle.js
```

# Usage

In a separate terminal window start truebit-os in the background.

```
cd truebit-os
npm run truebit wasm-client/config.json
```

This will start up the shell. We can start a solver on account 1 like so:
```
start solve -a 1
```

In a new terminal window, we need to deploy the Scrypt contract that the webapp will be interfacing with. We can do this by running:

```
node deploy.js
```

Now that we have all the dependencies setup,  we will be able to send tasks to the solver via our simple webapp.

Start up the webapp:
```
node index.js
```

And navigate to `localhost:3000` in a MetaMask compatible browser.

Make sure to connect MetaMask to localhost:8545, and send the initial account some Ether so it can send transactions. The easiest way is to import the private key of an account in `ganache-cli` and then send some Ether to Account 1.

Once you enter some text, and press Submit. It will fire off a TrueBit task and wait for the task to complete. The TrueBit task requires two periods of timeouts so you will need to use the skip command in the truebit-os shell.

For best results (skip can be a bit finnicky):
```
skip 300
skip 300
```

Ends challenge period

```
skip 300
skip 300
```

Once the task is finalized the results should show up on the web page.

