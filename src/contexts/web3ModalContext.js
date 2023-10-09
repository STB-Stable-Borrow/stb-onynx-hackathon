import { createContext, useCallback, useState } from "react";
import Web3 from "web3";
import { stbContractInit } from "../lib/stbContract";
import { stcContractInit } from "../lib/stcContract";
import { Big } from "big.js";
import { sbtContractInit } from "../lib/sbtContract";
import "react-toastify/dist/ReactToastify.css";
import { stbSwapContractInit } from "../lib/stbSwapContract";
import { ethers } from "ethers";
import { initSmartAccount } from "../lib/biconomy/smartAccount.ts";

export const Web3ModalContext = createContext({
  connect: () => {},
  disconnect: () => {},
  getGlmrBalance: () => {},
  web3: null,
  stb: null,
  stc: null,
  sbt: null,
  stbSwap: null,
  account: null,
  address: "",
  glmrBalance: null,
  glmrBlnc: null,
  chainId: null,
  networkId: null,
  connected: false,
  smartAccount: null,
  signer: null,
});

const Web3ModalProvider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [stb, setStb] = useState(null);
  const [stc, setStc] = useState(null);
  const [sbt, setSbt] = useState(null);
  const [stbSwap, setStbSwap] = useState(null);
  const [account, setAccount] = useState(null);
  const [address, setAddress] = useState("");
  const [glmrBalance, setglmrBalance] = useState(null);
  const [glmrBlnc, setglmrBlnc] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [connected, setConnected] = useState(false);
  const [smartAccount, setSmartAccount] = useState(null);
  const [signer, setSigner] = useState(null);

  //initialize web3 connection
  const web3Init = () => {
    return new Promise(async (resolve, reject) => {
      // metamask
      if (typeof window.ethereum !== "undefined") {
        await window.ethereum
          .send("eth_requestAccounts")
          .then(() => {
            resolve(new Web3(window.ethereum));
          })
          .catch((err) => {
            if (err.message.includes("User rejected the request")) {
              window.alert("You need to connect your wallet to proceed");
            } else if (
              err.message.includes(
                "Request of type 'wallet_requestPermissions' already pending for origin"
              )
            ) {
              window.alert(
                "You have a pending wallet connection request, approve it to proceed"
              );
            } else {
              window.alert("Unexpected error occured while connecting wallet");
            }
            console.log("err: ", err);
            reject(err);
          });
      } else {
        window.alert("You need to download metamask to proceed");
      }
    });
  };

  //slices wallet address
  const formatAddress = (_address) => {
    return `0x${_address.slice(2, 5)}...${_address.slice(39)}`;
  };

  // connects wallet and saved instances/variables
  const connect = async () => {
    return await web3Init()
      .then(async (_web3) => {
        setWeb3(_web3);
        const stc = await stcContractInit(_web3);
        const stb = await stbContractInit(_web3);
        const sbt = await sbtContractInit(_web3);
        const stbSwap = await stbSwapContractInit(_web3);
        setStc(stc);
        setStb(stb);
        setSbt(sbt);
        setStbSwap(stbSwap);
        //get and save needed instances/variables
        const accounts = await _web3.eth.getAccounts(); //first account connected
        const _account = _web3.utils.toChecksumAddress(accounts[0]); //get address
        const _address = formatAddress(_account);
        const _networkId = await _web3.eth.net.getId(); // get networkid
        const _chainId = await _web3.eth.getChainId(); // get chainid
        const providerEther = new ethers.providers.Web3Provider(
          window.ethereum
        );
        const _signer = providerEther.getSigner();
        const _smartAccount = await initSmartAccount(_signer);
        setSmartAccount(_smartAccount);
        setSigner(_signer);
        setAccount(_account);
        setAddress(_address);
        setNetworkId(Number(_networkId));
        setChainId(Number(_chainId));
        setConnected(true);
        return true;
      })
      .catch((err) => {
        console.log("err: ", err);
        return false;
      });
  };

  //clear all saved instances
  const resetConnection = useCallback(() => {
    setWeb3(null);
    setStb(null);
    setStc(null);
    setSbt(null);
    setAccount(null);
    setChainId(null);
    setNetworkId(null);
    setConnected(false);
  }, []);

  const disconnect = useCallback(async () => {
    if (web3 && web3.currentProvider) {
      const _provider = web3.currentProvider;
      if (_provider.close) await _provider.close();
    }
    resetConnection();
  }, [web3, resetConnection]);

  //gets, formats and save glmrBalance(always call to update balance)
  const getGlmrBalance = async (_web3, _account) => {
    if (_web3 && _account) {
      await _web3.eth.getBalance(_account).then((res) => {
        setglmrBalance(res);
        const blnc = new Big(res || 0);
        const formattedBlnc = blnc.div("10e17").toFixed(4);
        setglmrBlnc(formattedBlnc);
        return formattedBlnc;
      });
    } else {
      return;
    }
  };

  return (
    <Web3ModalContext.Provider
      value={{
        connect,
        disconnect,
        getGlmrBalance,
        web3,
        stb,
        stc,
        sbt,
        stbSwap,
        account,
        address,
        glmrBalance,
        glmrBlnc,
        networkId,
        chainId,
        connected,
        smartAccount,
        signer,
      }}
    >
      {children}
    </Web3ModalContext.Provider>
  );
};

export default Web3ModalProvider;
