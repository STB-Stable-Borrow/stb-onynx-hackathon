import STB from "../backend/build/contracts/STB.json";
import { Big } from "big.js";
import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//initializes and return stb contract properties
const stbContractInit = (web3) => {
  const networkKey = Object.keys(STB.networks)[0];
  return new web3.eth.Contract(STB.abi, STB.networks[networkKey].address);
};

//gets collaritization ratio from STB contract
const getColRatio = async (stb) => {
  const colRt = await stb.methods
    .minimumColRatio()
    .call()
    .then((res) => {
      const colRatio = new Big(res || 0);
      const formattedColRatio = colRatio.div("10e17").toFixed(4);
      return formattedColRatio;
    })
    .catch((err) => {
      if (err.message.includes("Response has no error or result for request")) {
        toast.error(
          "You are offline due to internet connection. check your connection and try again"
        );
      } else {
        console.log("Error while getting collatarilization ratio :", err);
        toast.error(
          "Error while getting collatarilization ratio. Try again later"
        );
      }
    });
  return colRt;
};



//gets regulator fee from STB contract
const getRegFee = async (stb, amount) => {
  const regFee = await stb.methods
    .getRegulatorFee(amount)
    .call()
    .then((res) => {
      const regFee = new Big(res || 0);
      const formattedRegFee = regFee.div("10e17").toFixed(4);
      return formattedRegFee;
    })
    .catch((err) => {
      if (err.message.includes("Response has no error or result for request")) {
        toast.error(
          "You are offline due to internet connection. check your connection and try again"
        );
      } else {
        console.log("Error while getting reg fee :", err);
        toast.error("Error while getting reg fee. Try again later");
      }
    });
  return regFee;
};

//calls createVault function on STB contract
const createVault = async (stb, userAccount, amount) => {
  const res = await stb.methods
    .createVault(amount)
    .send({ from: userAccount, value: amount })
    .then((res) => {
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
          console.log("Error while creating vault :", err);
        }
        return false;
      }
    });
  return res;
};

//calls getUserVaults function on STB contract
const getAllUserVaults = async (stb, account) => {
  const res = await stb.methods
    .getUserVaults(account)
    .call()
    .then(async (res) => {
      let allVaults = [];
      res.forEach((vault) => {
        if (vault.created_at > 0) {
          allVaults.push(vault);
        }
      });
      return allVaults;
    });
  return res;
};

//gets total locked collateral for an account
const getUserTotalLockedCol = async (stb, account) => {
  const res = await stb.methods
    .userTotalLockedCol(account)
    .call()
    .then(async (res) => {
      const totalLockedCol = new Big(res || 0);
      const formatedCol = totalLockedCol.div("10e17").toFixed(4);
      return formatedCol;
    });
  return res;
};

//gets total vaults
const getTotalVaults = async (stb) => {
  const res = await stb.methods
    .totalVaults()
    .call()
    .then(async (res) => {
      return res;
    });
  return res;
};

//gets user's total debt
const getUserTotalDebt = async (stb, account) => {
  const res = await stb.methods
    .userTotalDebt(account)
    .call()
    .then(async (res) => {
      const totalDebt = new Big(res || 0);
      const formatedDebt = totalDebt.div("10e17").toFixed(4);
      return formatedDebt;
    });
  return res;
};

//gets vault's details using it's id
const getVault = async (stb, vaultId) => {
  const res = await stb.methods
    .getVault(vaultId)
    .call()
    .then(async (res) => {
      const vaultDetails = {
        id: res.id,
        owner: res.owner,
        totalDebt: res.debt,
        totalLockedCol: res.lck_collateral,
        colRatio: res.col_ratio,
        availCollateral: res.avail_collateral,
        createdAt: res.created_at,
        lastPayment: res.last_payment_at,
        interest: res.interest,
        closedAt: res.closed_at,
      };
      return vaultDetails;
    });
  return res;
};

//deposits collateral
const depositCollateral = async (stb, vaultId, userAccount, amount) => {
  const res = await stb.methods
    .depositCollateral(vaultId)
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
          console.log("Error while depositing collateral to vault :", err);
        }
        return false;
      }
    });
  return res;
};

//withdraws collateral
const withdrawCollateral = async (stb, vaultId, userAccount, amount) => {
  const res = await stb.methods
    .withdrawCollateral(vaultId, amount)
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
          console.log("Error while withdrawing collateral to vault :", err);
        }
        return false;
      }
    });
  return res;
};

//pays debt
const payDebt = async (stb, vaultId, userAccount, amount) => {
  const res = await stb.methods
    .payDebt(vaultId, amount)
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
        } 
        return false;
      }
    });
  return res;
};

//gets all haunted vaults
const getAllHauntedVaults = async (stb) => {
  const res = await stb.methods
    .allHauntedVaults()
    .call()
    .then(async (res) => {
      return res;
    });
  return res;
};

//gets all liquidated vaults
const getAllLiquidatedVaults = async (stb) => {
  const res = await stb.methods
    .allVaultsInLiquidation()
    .call()
    .then(async (res) => {
      return res;
    });
  return res;
};

//gets all vaults
const getAllVaults = async (stb) => {
  const res = await stb.methods
    .allVaults()
    .call()
    .then(async (res) => {
      return res;
    });
  return res;
};

//regulate vault through inspection
const hauntVaults = async (stb, vaultId, userAccount) => {
  const res = await stb.methods
    .inspectVault(vaultId)
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
          toast.error("Error while inspecting vault");
        }
        return false;
      }
    });
  return res;
};




export {
  stbContractInit,
  getRegFee,
  getColRatio,
  createVault,
  getAllUserVaults,
  getUserTotalLockedCol,
  getTotalVaults,
  getUserTotalDebt,
  getVault,
  depositCollateral,
  withdrawCollateral,
  payDebt,
  getAllHauntedVaults,
  getAllLiquidatedVaults,
  getAllVaults,
  hauntVaults,
};
