import React, { useState, useEffect } from "react";
import back from "../../assets/borrow/back.svg";
import gen from "../../assets/borrow/gen.svg";
import { useBorrow } from "../../contexts/borrowContext/borrowContext";
import { createVault } from "../../lib/stbContract";
import { useDashboard } from "../../contexts/dashboardContext";

function Generate({
  onNextButtonClicked,
  onBackButtonClicked,
  _xdcPrice,
  _colRatio,
  _stb,
  _account,
  _web3,
}) {
  const { totalStcOut, totalXdcIn, handleGenerateSTCNext } = useBorrow();

  const { handleLoading } = useDashboard();
  //handles generate click event
  const handleGenerate = async () => {
    const amt = _web3.utils.toWei(String(totalXdcIn), "ether");
    handleLoading();
    await createVault(_stb, _account, amt).then((res) => {
      handleLoading();
      handleGenerateSTCNext(res);
    });
  };

  return (
    <div className="bg-[#292c31]  rounded-[12px] flex flex-col gap-[4vh] md:w-[735px] w-[82.37vw] my-[1.875rem] py-[2vh] px-[0.875rem] md:px-[86px] ">
      <div className="flex flex-col gap-[2vh] font-bold ">
        <div className="flex items-center justify-between">
          <h1 className="text-[] ">XDC to Deposit:</h1>
          <p className="truncate w-[100px] text-end">
            ${totalXdcIn * _xdcPrice}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <h1>STC To Generate:</h1>
          <p>${totalStcOut}</p>
        </div>
        <div className="flex items-center justify-between">
          <h1>XDC To Deposit:</h1>
          <p>{totalXdcIn}</p>
        </div>
        <div className="flex items-center justify-between">
          <h1>STC To Generate:</h1>
          <p>{totalStcOut}</p>
        </div>
        <div className="flex items-center justify-between">
          <h1>Current XDC Price:</h1>
          <p>${_xdcPrice}</p>
        </div>
        <div className="flex items-center justify-between">
          <h1>Liquidity Ratio:</h1>
          <p>{_colRatio}</p>
        </div>
      </div>
      <p className="text-center text-[.75rem] ">
        <span className="text-[#865DFF] ">Note:</span> Total XDC Amount may vary
        depending on price action but XDC to deposit must be the same verify on
        your wallet before you approve transaction. Thanks
      </p>
      <div className="w-full h-[3.90vh]  flex items-center justify-center md:gap-[110px] gap-[1.93vw] mt-[3.19vh] mb-[3.5vh] text-[.75rem] md:h-[5.95vh] ">
        <button
          className="border border-[#009FBD] w-full md:w-[8.54vw] h-full rounded-lg flex items-center justify-center gap-2 bg-inherit hover:opacity-75 "
          onClick={onBackButtonClicked}
        >
          <img src={back} alt="" className="w-[1.25vw] h-[1.25vw] " />
          Back
        </button>
        <button
          className="bg-[#009FBD] w-full h-full md:w-[8.54vw]  rounded-lg flex items-center justify-center gap-2  hover:bg-opacity-75 "
          onClick={handleGenerate}
        >
          Generate
          <img src={gen} alt="" className="w-[1.25vw] h-[1.25vw] " />
        </button>
      </div>
    </div>
  );
}

export default Generate;
