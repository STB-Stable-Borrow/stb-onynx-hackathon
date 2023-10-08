require("dotenv").config();
const { MNEMONIC, XINFIN_NETWORK_URL, APOTHEM_NETWORK_URL } = process.env;
const HDWalletProvider = require("@truffle/hdwallet-provider");
module.exports = {
  networks: {
    xinfin: {
      provider: () => new HDWalletProvider(MNEMONIC, XINFIN_NETWORK_URL),
      network_id: 50,
      gasLimit: 6721975,
      confirmation: 2,
    },

    apothem: {
      provider: () => new HDWalletProvider(MNEMONIC, APOTHEM_NETWORK_URL),
      network_id: 51,
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
