

require('@nomiclabs/hardhat-waffle')

module.exports = {
  solidity: '0.8.9',
  networks:{
    sepolia:{
      url: 'https://eth-sepolia.g.alchemy.com/v2/BpDfkbhSUrs64MXXgE4hhvkgVtxrUn21',
      accounts: ['ffd222340dbd27e23b2048b1398daa4ce00516d8fc3fef25f3e517420e8aac10']
    }
  }
}