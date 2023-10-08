import { createContext, useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import { providerOptions } from "xdcpay-connect";
import Web3Modal from "web3modal";
import { stbContractInit } from "../lib/stbContract";
import { stcContractInit } from "../lib/stcContract";
import { Big } from "big.js";
import { sbtContractInit } from "../lib/sbtContract";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { stbSwapContractInit } from "../lib/stbSwapContract";

export const Web3ModalContext = createContext({
  connect: () => {},
  disconnect: () => {},
  getXdcBalance: () => {},
  web3: null,
  stb: null,
  stc: null,
  sbt: null,
  stbSwap: null,
  account: null,
  address: "",
  xdcBalance: null,
  xdcBlnc: null,
  chainId: null,
  networkId: null,
  connected: false,
  signer: null,
});

const Web3ModalProvider = ({ children }) => {
  const [web3Modal, setWeb3Modal] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [stb, setStb] = useState(null);
  const [stc, setStc] = useState(null);
  const [sbt, setSbt] = useState(null);
  const [stbSwap, setStbSwap] = useState(null);
  const [account, setAccount] = useState(null);
  const [address, setAddress] = useState("");
  const [xdcBalance, setXdcBalance] = useState(null);
  const [xdcBlnc, setXdcBlnc] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [networkId, setNetworkId] = useState(null);
  const [connected, setConnected] = useState(false);
  const [signer, setSigner] = useState(null);

  //create and save new web3Modal onload
  useEffect(() => {
    const _web3Modal = new Web3Modal({
      cacheProvider: true, // for previous connection
      providerOptions, // for XDCPay
      disableInjectedProvider: false, //For Metamask
      theme: "dark", // For dark theme todo: customise theme,
    });
    setWeb3Modal(_web3Modal);
  }, []);

  //initialize and save web3 from _provider
  const web3Init = (_provider) => {
    if (!_provider) {
      toast.error("Error while connecting to wallet provider. Try again later");
    }
    let provider;
    if (typeof _provider === "string") {
      if (_provider.includes("wss")) {
        provider = new Web3.providers.WebsocketProvider(_provider);
      } else {
        provider = new Web3.providers.HttpProvider(_provider);
      }
    } else {
      provider = _provider;
    }
    const _web3 = new Web3(provider);
    setWeb3(_web3);
    const providerEther = new ethers.providers.Web3Provider(window.ethereum);
    return [_web3, providerEther];
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

  //handles in-wallet actions
  const subscribeProvider = useCallback(
    async (_provider, _web3) => {
      if (!_provider.on) return;

      _provider.on("close", () => {
        console.log("connection closed");
        resetConnection();
      });
      _provider.on("accountsChanged", async (accounts) => {
        console.log("Account changed");
        setAccount(_web3.utils.toChecksumAddress(accounts[0]));
      });
      _provider.on("chainChanged", async (chainId) => {
        console.log("Chain changed: ", chainId);
        const networkId = await _web3.eth.net.getId();
        setChainId(Number(chainId));
        setNetworkId(Number(networkId));
      });

      _provider.on("networkChanged", async (networkId) => {
        console.log("Network changed: ", networkId);
        const chainId = await _web3.eth.getChainId();
        setChainId(Number(chainId));
        setNetworkId(Number(networkId));
      });
    },
    [resetConnection]
  );

  //slices wallet address and replace 0x with xdc
  const formatAddress = (_address) => {
    return `xdc${_address.slice(2, 5)}...${_address.slice(39)}`;
  };

  // connects wallet
  const connect = useCallback(async () => {
    // connect web3modal and get provider
    if (!web3Modal) return;
    const _provider = await web3Modal.connect();
    if (_provider === null) return;
    //initialize web3 with provider
    const web3Res = web3Init(_provider);
    const _web3 = web3Res[0];
    const _etherProv = web3Res[1];
    //monitor wallet actions
    await subscribeProvider(_provider, _web3);
    //initialize and save contracts
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
    setAccount(_account);
    setAddress(_address);
    setNetworkId(Number(_networkId));
    setChainId(Number(_chainId));
    setConnected(true);
    // //request wallet from metamask
    // await _etherProv.send("eth_requestAccounts", []);
    const signer = _etherProv.getSigner();
    setSigner(signer);
    return true;
  }, [web3Modal, subscribeProvider]);

  //track previous connection and automatically connect
  useEffect(() => {
    if (web3Modal && web3Modal.cachedProvider) {
      connect();
    }
  }, [web3Modal, connect]);

  //disconnects wallet
  const disconnect = useCallback(async () => {
    if (web3 && web3.currentProvider) {
      const _provider = web3.currentProvider;
      if (_provider.close) await _provider.close();
    }
    if (web3Modal) {
      await web3Modal.clearCachedProvider();
    }
    resetConnection();
  }, [web3Modal, web3, resetConnection]);

  //gets, formats and save xdcBalance(always call to update balance)
  const getXdcBalance = async (_web3, _account) => {
    if (_web3 && _account) {
      await _web3.eth.getBalance(_account).then((res) => {
        setXdcBalance(res);
        const blnc = new Big(res || 0);
        const formattedBlnc = blnc.div("10e17").toFixed(4);
        setXdcBlnc(formattedBlnc);
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
        getXdcBalance,
        web3,
        stb,
        stc,
        sbt,
        stbSwap,
        account,
        address,
        xdcBalance,
        xdcBlnc,
        networkId,
        chainId,
        connected,
        signer,
      }}
    >
      {children}
    </Web3ModalContext.Provider>
  );
};

export default Web3ModalProvider;
