import SBT from "../backend/build/contracts/SBT.json";
import { Big } from "big.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//initializes and return sbt contract properties
const sbtContractInit = (web3) => {
  const networkKey = Object.keys(SBT.networks)[0];
  return new web3.eth.Contract(SBT.abi, SBT.networks[networkKey].address);
};

//gets snft balance of an account
const isRegistered = async (sbt, account) => {
  const res = await sbt.methods
    .isTokenHolder(account)
    .call()
    .then(async (res) => {
      return res;
    })
    .catch((err) => {
      if (err.message.includes("Response has no error or result for request")) {
        toast.error(
          "You are offline due to internet connection. check your connection and try again"
        );
      } else {
        console.log("Error while getting snft balance :", err);
        toast.error("Error while getting snft balance. Try again later");
      }
    });
  return res;
};

const totalTokenCount = async (sbt) => {
  const res = await sbt.methods
    .totalTokenCount()
    .call()
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (err.message.includes("Response has no error or result for request")) {
        toast.error(
          "You are offline due to internet connection. check your connection and try again"
        );
      } else {
        console.log("Error while  getting Total supply :", err);
        toast.error("Error while getting Total supply. Try again later");
      }
    });
  return res;
};

const createAccount = async (sbt, tokenUrl, userAccount) => {
  const res = await sbt.methods
    .mint(tokenUrl)
    .send({ from: userAccount })
    .then(() => {
      return true;
    })
    .catch((err) => {
      if (
        err.message.includes(
          `Given address "xdc0000000000000000000000000000000000000000" is not a valid Ethereum address`
        ) ||
        err.message.includes(`Failed to check for transaction receipt`)
      ) {
        return true;
      } else {
        if (
          err.message.includes("Response has no error or result for request")
        ) {
          toast.error(
            "You are offline due to internet connection. check your connection and try again"
          );
        } else {
          console.log("Unexpected error while creating profile :", err);
          toast.error(
            "Unexpected error while creating profile. Try again later"
          );
        }
        return false;
      }
    });
  return res;
};

export { sbtContractInit, isRegistered, totalTokenCount, createAccount };
