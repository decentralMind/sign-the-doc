# sign-the-doc

Deploy Hash of the document/file on Ethereum blockchain and let anyone or only authroised signers(address) to sign the hash of the document thus completing document signature process.

Project live at: https://decentralMind.github.io/signthedoc

**Contract Deployment address:-**

* Rinkeby: [0xf82438a3ba0764ce51b58c484f644905da177b1c](https://ropsten.etherscan.io/address/0xf82438a3ba0764ce51b58c484f644905da177b1c)

* Ropsten: [0x1CB4E004b2a81045097416C0c6CF42aA0C608e4a](https://ropsten.etherscan.io/address/0x1CB4E004b2a81045097416C0c6CF42aA0C608e4a)

* Kovan: [0x4df4c113f15ad7d20642a4cba34071fb3c55c581](https://kovan.etherscan.io/address/0xeba2cef3320c34e7873afa6905e17add8011910f)

___

## INSTALLATION GUIDE

1. **Clone this repository**

    ```sh
    git clone https://github.com/decentralMind/sign-the-doc

    ```

2.  **Install Packages**

    cd into project directory where package.json is included and install the packages.

    ```sh
    
    cd sign-the-doc/client

    npm install
    ```

3. **Install few Packages globally**.

   ```sh
    npm install -g truffle-hd-wallet
    npm install -g chai
    npm install -g chai-bn
    npm install -g semver
   ```

4. **Install / log-in to MetaMask and copy 12 word seed phrase**.

    MetaMask(https://metamask.io/)

    Official Intallation tutorial video(https://www.youtube.com/watch?v=ZIGUC9JAAw8)


5. **Install and configure Ganache**.

   Ganache is a  personal Ethereum blockchain which you can use to run tests, execute commands, and inspect state while controlling how the chain operates.

   There are two versions available(Desktop and Command line version).

   You can choose one of the version below.

    1. Desktop version:-
        * Download and install [Desktop version](https://truffleframework.com/ganache).
        * Open Ganache desktop client.
        * Click setting icon at the top right corner.
        * Click Sever and choose port: 8545.
        * Click ACCOUNTS & KEYS.
        * Enter the same 12 word seed phrase used on MetaMask.

   2. Command Line Version:-
        * Download and install [Command Line version](https://github.com/trufflesuite/ganache-cli).

        * Run follow command with same 12 word seed phrase used on MetaMask.
        ```sh
            ganahce-cli -m "same 12 word seed phrase used on Metamask"

        ```

6. **Configure Infura**.

    This step is not necessary if you are deploying at localhost Ganache client.
    However if you planning to deploy to live tesnet without downloading whole chain and running your own node,  use Infura.
    
    _Infura Setup instruction:-_

    (This instruction is for https://infura.io/).

    1. Register and Setup INFURA [HERE](https://infura.io/).
    2. Click Create New Project after successful registration process.
    3. Name it SignTheDoc('or any name').
    4. Click VIEW PROJECT.
    5. Choose Ropsten from ENDPOINT Dropdown.
    6. Copy the ENDPOINT Link.

7. **Configure truffle.config.js**

    1. cd into root project directory

        ```sh
            cd sign-the-doc

        ```

    2. Open truffle.config.js 

    3. Assign same 12 word seed phrase used on Metamask to mnemonic variable inside truffle.config.js

        ```javascript
            var mnemonic = " This should be same 12 word seed used on Metamask";
        ```

    4. Assign ropsten endpoints received from infura.

        ```javascript
            var ropstenEndPoint = 'https://' + 'your ropsten endpoint received from infura';
        ```

    I've commented out kovan and rinkeby network. However, you can initialize the kovan and rinkeby network following similar process.

8. **Compile and Deploy**

    - **_Local Ganache deployment_**

    1. cd into root project directory.

        ```sh
            cd sign-the-doc
        ```

    2. Deployment on localhost Ganache test blockchain.

        ```sh
            truffle compile && truffle migrate
        ```

    - **_Ropsten deployment_**

     1. cd into root project directory.

        ```sh
            cd sign-the-doc
        ```

    2. Deployment on ropsten.

        ```sh
            truffle compile && truffle migrate --network ropsten
        ```
 
 9. **Run test**

    cd into root project directory and run test.

    ```sh
    cd sign-the-doc

    truffle test
    ```
    If everything is alright, all test should pass.

10. **Run the App**

    cd into root project directory.

    ```sh
    cd sign-the-doc
    cd client
    npm start
    ```

    Visit [localhost:3000](https://localhost:3000) on your browser. App should be running.


creator: decentralMind@gmail.com








    

