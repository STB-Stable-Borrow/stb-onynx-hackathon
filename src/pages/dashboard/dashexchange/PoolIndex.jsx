import React, { useState } from "react";
import Liquidity from "./Liquidity";
import xdc from "../../../assets/dashboard/xdcA.svg";
import stc from "../../../assets/dashboard/stcA.png";
import liquidityData from "../../../data/liquidityData";
import MobileLiquidityItem from "./MobileLiquidityItem";

function PoolIndex({
  _setConfirmationRes,
  _account,
  _handleLoading,
  _web3,
  _stbSwap,
  _stc,
  _stb,
  _xdcBlnc,
  _stcBlnc,
  _xdcPrc,
  expandedComponent,
}) {
  const [showPool, setShowPool] = useState(true);
  const [selectedLiquidity, setSelectedLiquidity] = useState(null);
  const selectedData = liquidityData.find(
    (data) => data.id === selectedLiquidity
  );
  const [allPools, setAllPools] = useState(null);

  const handleItemClick = (id) => {
    setSelectedLiquidity(id);
    setShowPool(false);
  };

  return (
    <div
      className={`px-[3.62vw] ${
        expandedComponent === "pool" ? "" : "text-[0.625rem]"
      }`}
    >
      {showPool ? (
        <div className="flex flex-col items-center md:pb-0 pb-12">
          <p
            className={`text-center  text-[#585858]  mb-[0.5vh]  ${
              expandedComponent === "pool" ? "text-[.75rem]" : "text-[0.63rem] "
            }`}
          >
            Click on each Pool to add Liquidity, check your Liquidity overview
            for details.
          </p>
          <h1 className="font-semibold text-[#865DFF] text-[1rem] mt-[6.13vh] md:mt-0 ">
            Your Liquidity
          </h1>
          <div className="md:w-full w-[] md:flex items-center justify-between text-[#585858] text-[.75rem] pr-[0.52vw] hidden  ">
            <h1>Pair</h1>
            <div className="flex items-start gap-[1.04vw]">
              <h1 className="w-[3.0vw]">Volume</h1>
              <h1 className="w-[3.28vw] ">Liquidity</h1>
              <h1 className="w-[3.64vw] ">Percentage</h1>
            </div>
          </div>
          <div
            className={`w-full ${
              expandedComponent === "pool" ? "h-[15.46vh]" : "h-[10.46vh]"
            } pr-[0.52vw] overflow-y-auto md:flex flex-col gap-[0.93vh] hidden `}
          >
            {liquidityData.map((data) => (
              <div
                className="flex items-center w-full justify-between text-xs text-[#B0B0B0] py-[0.93vh] pl-[0.7vw] bg-[#292C31] rounded-[10px] liquidity "
                key={data.id}
                onClick={() => handleItemClick(data.id)}
              >
                <div className="flex items-center">
                  <img src={xdc} alt="" className="h-[2.78vh] w-[2.78vh] " />
                  <img src={stc} alt="" className="h-[2.78vh] w-[2.78vh] " />
                  <h1 className="ml-[0.52vw]">
                    {data.assetOne}/{data.assetTwo}
                  </h1>
                </div>
                <div className="flex items-start gap-[1.04vw] text-center ">
                  <h1 className="w-[3.0vw] ">{data.volume}</h1>
                  <h1 className="w-[3.28vw] ">${data.liquidity}K</h1>
                  <h1 className="w-[3.64vw] ">${data.percentage}K</h1>
                </div>
              </div>
            ))}
          </div>
          <div className=" flex gap-2 flex-col md:hidden w-full text-[#B0B0B0] text-sm mt-[3.34vh] h-[15vh] overflow-auto ">
            {liquidityData.map((data, index) => (
              <MobileLiquidityItem
                key={index}
                data={data}
                handleItemClick={handleItemClick}
              />
            ))}
          </div>

          <div className="flex items-center justify-between w-full gap-4 md:gap-[0.57vw] h-[4.53vh]  text-[.75rem] mt-[1.92vh] mb-[2.4vh] ">
            <div className="h-full w-full border-[1.5px] border-[#009FBD] text-[#B0B0B0] flex items-center justify-center rounded-[10px] ">
              Total Pools: {liquidityData.length}
            </div>
            <div className="h-full w-full border-[1.5px] border-[#009FBD] text-[#B0B0B0] flex items-center justify-center rounded-[10px] ">
              Total Liquidity: 100M
            </div>
          </div>
          <h1 className="font-semibold text-[#865DFF] text-[1rem] md:mt-0 mt-6">
            Top Pools
          </h1>
          <div className="w-full md:flex items-center justify-between text-[#585858] text-[.75rem] hidden ">
            <h1 className="w-[8vw]">Pair</h1>
            <div className="flex items-start gap-[1vw]">
              <h1 className="w-[4.0vw] ">Volume</h1>
              <h1 className="w-[4.28vw] ">Liquidity</h1>
              <h1 className="w-[3.64vw] text-center">Fee</h1>
            </div>
          </div>
          <div
            className={`w-full overflow-y-auto md:flex flex-col gap-[0.93vh] pr-[0.52vw] hidden ${
              expandedComponent === "pool" ? "h-[13.46vh]" : "h-[10.46vh]"
            }`}
          >
            {liquidityData.map((data) => (
              <div
                className="flex items-center w-full justify-between text-[.75rem] text-[#B0B0B0]  rounded-[10px] liquidity "
                key={data.id}
                onClick={() => handleItemClick(data.id)}
              >
                <div className="flex items-center w-[8vw] cursor-pointer ">
                  <img src={xdc} alt="" className="h-[2.78vh] w-[2.78vh] " />
                  <img src={stc} alt="" className="h-[2.78vh] w-[2.78vh] " />
                  <h1 className="ml-[0.52vw]">
                    {data.assetOne}/{data.assetTwo}
                  </h1>
                </div>
                <div className="flex items-start gap-[1vw] text-center ">
                  <h1 className="w-[4.0vw]   ">{data.volume}</h1>
                  <h1 className="w-[4.28vw]  ">${data.liquidity}K</h1>
                  <h1 className="w-[3.64vw] text-end ">{data.percentage}%</h1>
                </div>
              </div>
            ))}
          </div>
          <div className=" flex gap-2 flex-col md:hidden w-full text-[#B0B0B0] text-sm mt-[3.34vh] h-[15vh] overflow-auto ">
            {liquidityData.map((data, index) => (
              <MobileLiquidityItem
                key={index}
                data={data}
                handleItemClick={handleItemClick}
              />
            ))}
          </div>
        </div>
      ) : (
        <Liquidity
          assetOne={selectedData.assetOne}
          assetTwo={selectedData.assetTwo}
          expandedComponent={expandedComponent}
        />
      )}
    </div>
  );
}

export default PoolIndex;
