const { ethers } = require("ethers");
const axios = require('axios');
const express = require('express');
const app = express();




const walletAddress = "0x6BE99e615b13c57341a171C7b6549548aaD17dF2"; 






async function hasInteractedWithBridgeOnSepolia(walletAddress, startBlock = 0, endBlock = 'latest') {

  const ETHERSCAN_API_KEY = "7XCJZGQ41NDWMAKJSESADNPIDW82Y5I9WZ"; 
// const address = "0x73cb4Cf464Ba30bBB369Ce7AC58C0e1B1920EAF6"; 








// Contract and user details
const contractAddress = "0x084C27a0bE5dF26ed47F00678027A6E76B14a0B4";
const userAddress = walletAddress

// ABI for the bridge function
const contractAbi = [
    "function bridge(address _stablecoin, uint256 _amount, address _to)"
];


// Initialize ethers.js interface
const iface = new ethers.utils.Interface(contractAbi);


    console.log(`Checking if ${userAddress} has called the bridge function on ${contractAddress}...`);

    // Fetch transaction history from Etherscan
    const url = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${userAddress}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`;

    try {
        const response = await axios.get(url);

        if (response.data.status !== "1" || !response.data.result) {
            console.log("No transactions found or error fetching data.");
            return false
        }

        const transactions = response.data.result;
        let bridgeCalls = 0;

        // Loop through the user's transactions
        for (const tx of transactions) {
            if (tx.to && tx.to.toLowerCase() === contractAddress.toLowerCase()) {
                try {
                    // Decode the input data
                    const decodedData = iface.parseTransaction({
                        data: tx.input,
                    });

                    if (decodedData.name === "bridge") {
                        bridgeCalls++;
                        console.log(`Bridge function called in transaction: ${tx.hash}`);
                        console.log(`Decoded Args:`, decodedData.args);
                    }
                } catch (error) {
                    // Ignore decoding errors (not a bridge call)
                }
            }
        }

        if (bridgeCalls === 0) {
            console.log("No calls to the bridge function found.");
        } else {
            console.log(`Total calls to the bridge function: ${bridgeCalls}`);
            return true
        }
    } catch (error) {
       return false

    }
    return false



}
  
  async function hasInteractedWithStakeAndMint(walletAddress, startBlock = 0, endBlock = 'latest') {

    const contractAddress = "0x1Ce4888a6dED8d6aE5F5D9ca1CABc758c680950b"; 
   
    const providerUrl = "https://ozean-testnet.rpc.caldera.xyz/http"; 

    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const logs = await provider.getLogs({
      fromBlock: startBlock,
      toBlock: endBlock,
      address: contractAddress,
      topics: [null, ethers.utils.hexZeroPad(walletAddress.toLowerCase(), 32)], 
    });
  
    
    return logs.length > 0;
  }

  async function hasInteractedWithWrapAndMint(walletAddress, startBlock = 0, endBlock = 'latest') {


    const wozAbi=[
        {
            "inputs": [
                {
                    "internalType": "contract OzUSD",
                    "name": "_ozUSD",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "account",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "internalType": "uint8",
                    "name": "",
                    "type": "uint8"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "subtractedValue",
                    "type": "uint256"
                }
            ],
            "name": "decreaseAllowance",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "spender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "addedValue",
                    "type": "uint256"
                }
            ],
            "name": "increaseAllowance",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "ozUSD",
            "outputs": [
                {
                    "internalType": "contract OzUSD",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "ozUSDPerToken",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "tokensPerOzUSD",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_wozUSDAmount",
                    "type": "uint256"
                }
            ],
            "name": "unwrap",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "ozUSDAmount",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_ozUSDAmount",
                    "type": "uint256"
                }
            ],
            "name": "wrap",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "wozUSDAmount",
                    "type": "uint256"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]

    const providerUrl = "https://ozean-testnet.rpc.caldera.xyz/http"; 

    const ozAddress = "0x1Ce4888a6dED8d6aE5F5D9ca1CABc758c680950b"; 

    const wozAddress = "0x2f6807b76c426527C3a5C442E8697f12C554195b"; 

    const provider = new ethers.providers.JsonRpcProvider(providerUrl);

    const wozContract = new ethers.Contract(wozAddress, wozAbi, provider);
   
    


    const logs = await provider.getLogs({
      fromBlock: startBlock,
      toBlock: endBlock,
      address: ozAddress,
      topics: [null, ethers.utils.hexZeroPad(walletAddress.toLowerCase(), 32)], 
    });
    
    if(logs.length>0)
    {
        console.log("oz true hai")
        const tokenContract=wozContract
        try {
           
            const decimals = await tokenContract.decimals();
        
            // Get the token balance
            const balance = await tokenContract.balanceOf(walletAddress);
        
            // Format the balance with token decimals
            const formattedBalance = ethers.utils.formatUnits(balance, decimals);
        
            // Check if the balance is greater than zero
            if (parseFloat(formattedBalance) > 0) {
              console.log(true);
              return true
            } else {
              console.log(false);

            }
          } catch (error) {
            console.error("Error checking token balance:", error);
          }
        }
        else{
            console.log(false)
        }

 
   
    return false;
  }



    app.get('/stakeAndMint', (req, res) => {

        const { address } = req.query;

        hasInteractedWithStakeAndMint(address)
        .then(interacted => {
          console.log("Has interacted:", interacted); // true or false
          let obj={"data":{"result":interacted}}
          
          res.send(obj)
        })
        .catch(error => {
          console.error("Error:", error);
        });
      });
      
      app.get('/bridgeOnSepolia', (req, res) => {

        const { address } = req.query;
       

        hasInteractedWithBridgeOnSepolia(address)
        .then(interacted => {
          console.log("Has interacted:", interacted); // true or false
        let obj={"data":{"result":interacted}}
          
          res.send(obj)
        })
        .catch(error => {
          console.error("Error:", error);
        });
      });

      app.get('/wrapAndMint', (req, res) => {

        const { address } = req.query;

        hasInteractedWithWrapAndMint(address)
        .then(interacted => {
          console.log("Has interacted:", interacted); // true or false
          let obj={"data":{"result":interacted}}
          
          res.send(obj)
        })
        .catch(error => {
          console.error("Error:", error);
        });
      });
      
      
    const PORT = process.env.PORT || 3000;
      
      
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
      