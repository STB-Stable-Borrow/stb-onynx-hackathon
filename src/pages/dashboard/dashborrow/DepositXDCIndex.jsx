import React, { useState } from "react";
import back from "../../../assets/dashboard/back.svg";
import approve from "../../../assets/dashboard/approve.svg";
import { useDashboard } from "../../../contexts/dashboardContext";
import { depositCollateral } from "../../../lib/stbContract";

function DepositXDCIndex({ _xdcBalance, _xdcPrc, _stb, _account, _web3 }) {
  const { vaultId, onVaultClick, saveDepositRes, handleLoading } =
    useDashboard();
  const [xdcIn, setXdcIn] = useState(null);
  const depositBtn = document.getElementById("deposit-btn");

  const handleDeposit = async () => {
    if (
      depositBtn &&
      depositBtn.style.backgroundColor === "rgb(0, 159, 189)" &&
      xdcIn &&
      parseFloat(xdcIn) > 0.0
    ) {
      const amount = _web3.utils.toWei(String(xdcIn), "ether");
      handleLoading();
      await depositCollateral(_stb, vaultId, _account, amount).then((res) => {
        handleLoading();
        saveDepositRes(res);
      });
    }
  };

  return (
    <div className="md:w-[760px] w-full bg-[#202225] rounded-[30px] mx-auto pt-[3.0vh] pb-[4.2969vh] flex items-center flex-col">
      <h1 className="text-[#009FBD] font-bold text-sm md:text-[1.125rem] mb-[6.738vh] ">
        How much XDC would you like to Deposit?
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
              depositBtn &&
              parseFloat(e.target.value) > 0.0 &&
              parseFloat(e.target.value) <= parseFloat(_xdcBalance)
            ) {
              depositBtn.style.backgroundColor = "#009FBD";
            } else {
              depositBtn.style.backgroundColor = "#585858";
            }
          }}
          value={xdcIn}
        />{" "}
        <p className="absolute md:top-0 top-2 right-2">XDC</p>
      </div>
      <p className="text-white text-sm md:text-base mb-[7.91vh] ">
        Balance: {_xdcBalance} XDC
      </p>
      <div className="text-white w-full md:px-0 px-[12.80vw] md:w-[450px] md:text-[1rem] mb-[6.738vh] text-xs ">
        <div className="flex w-full justify-between">
          <h3>Total XDC to Deposit:</h3>
          <p className="md:w-[100px]">
            ${(_xdcPrc * parseFloat(xdcIn)).toFixed(4)}
          </p>
        </div>
        <div className="flex w-full justify-between">
          <h3>Current Price:</h3>
          <p className="md:w-[100px]">${_xdcPrc}</p>
        </div>
        <div className="flex w-full justify-between">
          <h3>New XDC Balance:</h3>
          <p className="md:w-[100px]">{_xdcBalance - xdcIn}</p>
        </div>
      </div>
      <div className="flex justify-between md:gap-[110px] w-full md:w-auto gap-[5.07vw] px-[5.79vw] ">
        <button
          onClick={() => onVaultClick(vaultId)}
          className="border border-[#009FBD] w-full md:w-[169px] h-[3.90vh]  md:h-[49px] rounded-lg text-white hover:opacity-75 flex items-center gap-2 justify-center text-xs md:text-base"
        >
          <img src={back} alt="" />
          Back
        </button>
        <button
          onClick={handleDeposit}
          id="deposit-btn"
          className="text-[#B0B0B0] bg-[#585858] w-full md:w-[169px] h-[3.90vh] md:h-[49px] rounded-lg hover:bg-opacity-75 flex items-center gap-2 justify-center text-xs md:text-base"
        >
          Deposit
          <img src={approve} alt="" className="w-[1.25rem]" />
        </button>
      </div>
    </div>
  );
}

export default DepositXDCIndex;
