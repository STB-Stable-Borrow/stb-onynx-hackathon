import STBSWAP from "../backend/build/contracts/STBSWAP.json";
import { Big } from "big.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//initializes and return stbswap contract properties
const stbSwapContractInit = (web3) => {
  const networkKey = Object.keys(STBSWAP.networks)[0];
  return new web3.eth.Contract(
    STBSWAP.abi,
    STBSWAP.networks[networkKey].address
  );
};

//gets token's price from pool
const getPriceFromPool = async (stbSwap, poolId, tokenAddress) => {
  const res = await stbSwap.methods
    .tokenPriceFromPool(poolId, tokenAddress)
    .call()
    .then(async (res) => {
      return res / 100000;
    });
  return res;
};

//gets all pools
const getAllPools = async (stbSwap) => {
  const res = await stbSwap.methods
    .getAllPools()
    .call()
    .then(async (res) => {
      console.log("rtn: ", res);
      return res;
    });
  return res;
};

//gets a pool using it's id
const getPool = async (stbSwap, poolId) => {
  const res = await stbSwap.methods
    .getPool(poolId)
    .call()
    .then(async (res) => {
      return res;
    });
  return res;
};

//gets if a user is a pool providee
const isProvider = async (stbSwap, poolId, account) => {
  const res = await stbSwap.methods
    .isAProvider(poolId, account)
    .call()
    .then(async (res) => {
      return res;
    });
  return res;
};

//gets user's pool share
const getShare = async (stbSwap, poolId, account) => {
  const res = await stbSwap.methods
    .getShare(poolId, account)
    .call()
    .then(async (res) => {
      const share1 = new Big(res[0]);
      const share2 = new Big(res[1]);
      const formatShare1 = share1.div("10e17").toFixed(2);
      const formatShare2 = share2.div("10e17").toFixed(2);
      return [formatShare1, formatShare2];
    });
  return res;
};

//gets user's pool share
const getProfit = async (stbSwap, poolId, account) => {
  const res = await stbSwap.methods
    .getProfit(poolId, account)
    .call()
    .then(async (res) => {
      const profit1 = new Big(res[0]);
      const profit2 = new Big(res[1]);
      const formatProfit1 = profit1.div("10e17").toFixed(2);
      const formatProfit2 = profit2.div("10e17").toFixed(2);
      return [formatProfit1, formatProfit2];
    });
  return res;
};

//gets amount out from swap
const getAmountOut = async (stbSwap, poolId, tokenAddress, amount) => {
  const res = await stbSwap.methods
    .getAmountOutFromSwap(poolId, tokenAddress, amount)
    .call()
    .then(async (res) => {
      const bigInt = new Big(res);
      const formatted = bigInt.div("10e17").toFixed(6);
      return formatted;
    });
  return res;
};

//gets amount out from share
const getShareAmountOut = async (stbSwap, poolId, tokenAddress, amount) => {
  const res = await stbSwap.methods
    .shareAmountOut(poolId, tokenAddress, amount)
    .call()
    .then(async (res) => {
      const bigInt = new Big(res);
      const formatted = bigInt.div("10e17").toFixed(2);
      return formatted;
    });
  return res;
};

//adds liquidity to a pool
const addLiquidity = async (
  stbSwap,
  poolId,
  token1Amount,
  token2Amount,
  maxTolerance,
  userAccount,
  amount
) => {
  const res = await stbSwap.methods
    .addLiquidity(poolId, token1Amount, token2Amount, maxTolerance)
    .send({ from: userAccount, value: amount })
    .then(async (res) => {
      if (res) {
        return true;
      } else {
        return false;
      }
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
          console.log("Error while adding liquidity to pool :", err);
        }
        return false;
      }
    });
  return res;
};

//removes liquidity from a pol
const removeLiquidity = async (
  stbSwap,
  poolId,
  token1Amount,
  token2Amount,
  minTolerance1,
  minTolerance2,
  userAccount
) => {
  const res = await stbSwap.methods
    .removeLiquidity(
      poolId,
      token1Amount,
      token2Amount,
      minTolerance1,
      minTolerance2
    )
    .send({ from: userAccount })
    .then(async (res) => {
      if (res) {
        return true;
      } else {
        return false;
      }
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
          console.log("Error while removing liquidity from pool :", err);
        }
        return false;
      }
    });
  return res;
};

//swaps tokens in a pool
const swap = async (
  stbSwap,
  poolId,
  tokenFrom,
  tokenTo,
  amountToSwap,
  minTolerance,
  userAccount,
  amount
) => {
  const res = await stbSwap.methods
    .swap(poolId, tokenFrom, tokenTo, amountToSwap, minTolerance)
    .send({ from: userAccount, value: amount })
    .then(async (res) => {
      if (res) {
        return true;
      } else {
        return false;
      }
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
          console.log("Error while exchanging tokens :", err);
        }
        return false;
      }
    });
  return res;
};

export {
  stbSwapContractInit,
  getAllPools,
  getAmountOut,
  getPool,
  getPriceFromPool,
  getProfit,
  getShare,
  getShareAmountOut,
  isProvider,
  addLiquidity,
  removeLiquidity,
  swap,
};
