import React, { useEffect, useState } from "react";
import back from "../../../assets/dashboard/back.svg";
import approve from "../../../assets/dashboard/approve.svg";
import { useDashboard } from "../../../contexts/dashboardContext";
import { getVault, withdrawCollateral } from "../../../lib/stbContract";
import { Big } from "big.js";

function WithdrawXDCIndex({ _web3, _xdcPrc, _xdcBalance, _stb, _account }) {
  const { vaultId, onVaultClick, saveWithdrawRes, handleLoading } =
    useDashboard();
  const [xdcIn, setXdcIn] = useState(null);
  const [vaultInfo, setVaultInfo] = useState(null);
  const withdrawBtn = document.getElementById("withdraw-btn");

  //get vault details
  useEffect(() => {
    (async () => {
      await getVault(_stb, parseInt(vaultId)).then((res) => {
        setVaultInfo(res);
      });
    })();
  }, []);

  const handleWithdraw = async () => {
    if (
      withdrawBtn &&
      withdrawBtn.style.backgroundColor === "rgb(0, 159, 189)" &&
      xdcIn &&
      parseFloat(xdcIn) > 0.0
    ) {
      const amount = _web3.utils.toWei(String(xdcIn), "ether");
      handleLoading();
      await withdrawCollateral(_stb, vaultId, _account, amount).then((res) => {
        handleLoading();
        saveWithdrawRes(res);
      });
    }
  };

  return (
    <div className="md:w-[760px] bg-[#202225] rounded-[30px] mx-auto pt-[3.0vh] pb-[4.2969vh] flex items-center flex-col">
      <h1 className="text-[#009FBD] text-center font-bold text-sm md:text-[1.125rem] mb-[6.7383vh] px-4 ">
        How much STC would you like to Withdraw?
      </h1>

      <div className="text-[#292C31] relative ">
        <input
          type="number"
          className="md:w-[428px] w-[75.60vw] h-[4.49vh] bg-[#B0B0B0] rounded-lg pl-[21px] placeholder:text-[#292C31] "
          placeholder="Enter Amount"
          onChange={(e) => {
            setXdcIn(e.target.value);
          }}
          onInput={(e) => {
            if (
              withdrawBtn &&
              parseFloat(e.target.value) > 0.0 &&
              parseFloat(e.target.value) <=
                parseFloat(
                  new Big(vaultInfo.availCollateral).div("10e17").toFixed(4)
                )
            ) {
              withdrawBtn.style.backgroundColor = "#009FBD";
            } else {
              withdrawBtn.style.backgroundColor = "#585858";
            }
          }}
          value={xdcIn}
        />{" "}
        <p className="absolute md:top-0 top-2 right-2">XDC</p>
      </div>
      {vaultInfo && (
        <p className="text-white text-sm md:text-base mb-[7.91vh] ">
          Withdrawable Balance:{" "}
          {new Big(vaultInfo.availCollateral).div("10e17").toFixed(4)} XDC
        </p>
      )}
      {!vaultInfo && (
        <p className="text-white mb-[7.91vh] ">Withdrawable Balance: </p>
      )}
      <div className="text-white md:w-[450px] w-full text-xs md:text-[1rem] mb-[6.738vh] px-[12.80vw] md:px-0 ">
        <div className="flex w-full justify-between">
          <h3>Total XDC to Withdraw:</h3>
          <p className="md:w-[100px]">
            ${(_xdcPrc * parseFloat(xdcIn)).toFixed(4)}
          </p>
        </div>
        <div className="flex w-full justify-between">
          <h3>Current Price:</h3>
          <p className="md:w-[100px]">${_xdcPrc}</p>
        </div>
        {vaultInfo && (
          <div className="flex w-full justify-between">
            <h3>New withdrawable XDC balance:</h3>
            <p className="md:w-[100px]">
              {(
                new Big(vaultInfo.availCollateral).div("10e17").toFixed(4) -
                parseFloat(xdcIn)
              ).toFixed(4)}
            </p>
          </div>
        )}
        {!vaultInfo && (
          <div className="flex w-full justify-between">
            <h3>New withdrawable XDC balance:</h3>
            <p className="md:w-[100px]"></p>
          </div>
        )}
      </div>
      <div className="flex justify-between md:gap-[110px] w-full md:w-auto gap-[5.07vw] px-[5.79vw] ">
        <button
          onClick={() => onVaultClick(vaultId)}
          className="border border-[#009FBD] w-full md:w-[169px] md:h-[49px] h-[3.90vh] rounded-lg text-white hover:opacity-75 text-xs md:text-base flex items-center gap-2 justify-center"
        >
          <img src={back} alt="" className="w-[1.25rem]" />
          Back
        </button>
        <button
          onClick={handleWithdraw}
          id="withdraw-btn"
          className="text-[#B0B0B0] bg-[#585858] w-full h-[3.90vh] md:w-[169px] md:h-[49px] rounded-lg hover:bg-opacity-75 flex items-center gap-2 justify-center text-xs md:text-base"
        >
          Withdraw
          <img src={approve} alt="" className="w-[1.25rem]" />
        </button>
      </div>
    </div>
  );
}

export default WithdrawXDCIndex;
