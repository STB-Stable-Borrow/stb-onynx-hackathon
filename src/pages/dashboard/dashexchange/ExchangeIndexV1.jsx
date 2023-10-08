import React, { useState } from "react";
import drag from "../../../assets/dashboard/drag.svg";
import SwapIndex from "./SwapIndex";
import PoolIndex from "./PoolIndex";
import ExchangeConfirmations from "./ExchangeConfirmations";
import TokenizationFailedModal from "./FailedModal";
import TokenizationSuccessModal from "./SuccessModal";
import FailedModal from "./FailedModal";
import SuccessModal from "./SuccessModal";

function ExchangeIndex({
  account,
  handleLoading,
  web3,
  stbSwap,
  stc,
  stb,
  xdcBlnc,
  stcBlnc,
  xdcPrc,
}) {
  const [isSwapToggleOn, setIsSwapToggleOn] = useState(true);
  const [confirmationRes, setConfirmationRes] = useState(null);

  const handleSwapToggle = () => {
    setIsSwapToggleOn(!isSwapToggleOn);
  };

  const handlePoolToggle = () => {
    setIsSwapToggleOn(!isSwapToggleOn);
  };

  return (
    <div className="rounded-[40px] bg-[#202225] h-full px-[1.30vw] py-[1.67vh] flex flex-col items-center justify-between  mx-auto md:hidden ">
      <div className="flex flex-col items-center">
        <h1 className="text-[#B0B0B0] text-[] font-semibold italic ">
          Stable Swap
        </h1>
        <img src={drag} alt="" className="w-[3.70vw] h-[0.56vh] mb-[0.98vh] " />
      </div>
      <div className="w-[16.93rem] md:w-auto justify-between gap-4 md:gap-0 py-[.65vh] px-[.52vw] bg-[#292C31] rounded-[10px] flex text-[0.75rem] items-center text-[#b0b0b0] mb-[1.31vh] ">
        <button
          className={`py-[.37vh] w-full md:w-auto px-[1.56vw] ${
            isSwapToggleOn ? "bg-[#009FBD] text-white" : ""
          }  rounded-[7px] `}
          onClick={handleSwapToggle}
        >
          Swap
        </button>
        <button
          className={`py-[.37vh] w-full md:w-auto px-[1.56vw] ${
            isSwapToggleOn ? "" : "bg-[#009fbd] text-white "
          } rounded-[7px] `}
          onClick={handlePoolToggle}
        >
          Pool{" "}
        </button>
      </div>
      {confirmationRes === null && isSwapToggleOn && (
        <SwapIndex
          _setConfirmationRes={setConfirmationRes}
          _account={account}
          _handleLoading={handleLoading}
          _web3={web3}
          _stbSwap={stbSwap}
          _stc={stc}
          _stb={stb}
          _xdcBlnc={xdcBlnc}
          _stcBlnc={stcBlnc}
          _xdcPrc={xdcPrc}
        />
      )}
      {confirmationRes === null && !isSwapToggleOn && (
        <PoolIndex
          _setConfirmationRes={setConfirmationRes}
          _account={account}
          _handleLoading={handleLoading}
          _web3={web3}
          _stbSwap={stbSwap}
          _stc={stc}
          _stb={stb}
          _xdcBlnc={xdcBlnc}
          _stcBlnc={stcBlnc}
          _xdcPrc={xdcPrc}
        />
      )}
      {confirmationRes === false && (
        <TokenizationFailedModal _setConfirmationRes={setConfirmationRes} />
      )}
      {confirmationRes === true && (
        <TokenizationSuccessModal _setConfirmationRes={setConfirmationRes} />
      )}
    </div>
  );
}

export default ExchangeIndex;
