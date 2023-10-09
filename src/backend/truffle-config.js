require("dotenv").config();
const { MNEMONIC, GEORLI_RPC_URL } = process.env;
const HDWalletProvider = require("@truffle/hdwallet-provider");
module.exports = {
  networks: {
    georli: {
      provider: () => new HDWalletProvider(MNEMONIC, GEORLI_RPC_URL),
      network_id: 5,
      gasLimit: 6721975,
      confirmation: 2,
    },
  },

  mocha: {},

  compilers: {
    solc: {
      version: "0.8.17",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
