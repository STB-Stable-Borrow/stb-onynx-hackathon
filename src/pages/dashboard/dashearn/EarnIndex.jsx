import React, { useState } from "react";
import haunt from "../../../assets/dashboard/haunt.svg";
import filter from "../../../assets/dashboard/filter.svg";
import search from "../../../assets/dashboard/search.svg";
import vaultsData from "../../../data/vaultsData";
import { motion, AnimatePresence } from "framer-motion";

function EarnIndex({
  web3,
  stb,
  account,
  colRatio,
  hauntedVlts,
  liquidatedVlts,
  _onHauntClick,
}) {
  const [isBouncing, setIsBouncing] = useState(true);
  const getArrayLength = (_array) => {
    let finalRes = [];
    _array.forEach((item) => {
      if (item.created_at > 0) {
        finalRes.push(item);
      }
    });
    return finalRes.length;
  };

  return (
    <div className="">
      <h1 className="md:hidden mt-[3.34vh] mb-[6.13vh] text-[#B0B0B0] font-bold ">
        Welcome!
      </h1>
      <h1 className="w-full bg-[#202225] flex items-center justify-center text-[#B0B0B0] font-bold text-[1.125em] border-[#585858] border-dashed border rounded-[7px] h-[4.35vh] mb-[1.48vh] ">
        Overview
      </h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-[40px] mb-[2.93vh]  ">
        <div className="md:w-[22.84vw] w-full h-full rounded-[20px] bg-[#12A92A] flex flex-row  md:flex-col items-center justify-between md:justify-center text-[#D9D9D9] py-[2.79vh] md:py-[1.3vh] gap-[2.59vh] px-[4.83vw] md:px-0  ">
          <div className="flex flex-col items-center">
            <h1 className="font-bold md:text-base text-xs">
              Total Vaults Haunted:
            </h1>
            {hauntedVlts && (
              <p className="md:mt-[-5px] text-xl md:text-[1.5em]  font-medium ">
                {getArrayLength(hauntedVlts)}
              </p>
            )}
            {!hauntedVlts && (
              <p className="mt-[-5px] text-[1.5em]  font-medium "></p>
            )}
          </div>
          <div className="flex flex-col items-center">
            <h1 className="font-bold md:text-base text-xs">Total Payout:</h1>
            <p className="md:mt-[-5px] text-xl md:text-[1.5em] font-medium ">
              3500.00 XDC
            </p>
          </div>
        </div>
        <div
          onClick={_onHauntClick}
          className="bg-[#202225] rounded-[20px] h-[8.80vh] md:h-[16.61vh] w-[35.02vw] md:w-[6.56vw] flex items-center justify-center haunt border-[3px] border-[#009FBD] cursor-pointer"
        >
          <AnimatePresence>
            <motion.img
              src={haunt}
              alt=""
              className={`md:w-[4.48vw] w-auto md:h-[9.9vh] h-[4.46vh]  ${
                isBouncing ? "animate-bounce" : ""
              }`}
              initial={{ y: 0 }}
              animate={{ y: isBouncing ? [-10, 0] : 0 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
        </div>
        <div className="w-full md:w-[22.84vw] h-full rounded-[20px] bg-[#12A92A] flex md:flex-col items-center justify-between md:justify-center text-[#D9D9D9] py-[2.79vh] md:py-[1.3vh] gap-[2.59vh] px-2 md:px-0  ">
          <div className="flex flex-col items-center justify-center">
            <h1 className="font-bold md:text-base text-xs">
              Current Collateral Ratio:
            </h1>
            <p className="md:mt-[-5px] text-xl md:text-[1.5em]  font-medium ">
              {colRatio}
            </p>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="font-bold md:text-base text-xs">
              Total Vaults in Liquidity:
            </h1>
            {liquidatedVlts && (
              <p className="md:mt-[-5px] text-xl md:text-[1.5em]  font-medium  ">
                {getArrayLength(liquidatedVlts)}
              </p>
            )}
            {!liquidatedVlts && (
              <p className="mt-[-5px] text-[1.5em]  font-medium "></p>
            )}
          </div>
        </div>
      </div>
      <h1 className="w-full bg-[#202225] flex items-center justify-center text-[#B0B0B0] font-bold text-[1.125em] border-[#585858] border-dashed border rounded-[7px] h-[4.35vh] mb-[2.73vh] ">
        Haunt History
      </h1>
      <div className="flex w-full justify-between mb-[3.22vh] h-[4.1vh] ">
        <div className="h-full flex gap-4">
          <div className="relative h-full">
            <input
              type="search"
              name=""
              id=""
              className="h-full md:w-[426px] w-[36.95vw]  rounded-lg bg-[#B0B0B0] pl-[30px] md:pl-[50px] placeholder:text-[#292C31] text-[#292C31] "
              placeholder="Search..."
            />
            <img
              src={search}
              alt=""
              className="md:w-[24px] w-[3.25vw] md:h-[2.3vh] absolute md:top-1.5 top-2 left-3  "
            />
          </div>
          <button className="md:w-[2.9vw] h-full rounded-sm border border-[#B0B0B0] flex items-center justify-center ">
            <img src={filter} alt="" className="w-[24px] h-[2.34vh]" />
          </button>
        </div>
        <h2 className="text-[#B0B0B0] font-bold bg-[#202225] rounded-lg md:w-[191px] w-[32.36vw] flex items-center justify-center text-xs md:text-base ">
          Total Vaults: {vaultsData.length}
        </h2>
      </div>
      <div className="md:table w-full text-[#B0B0B0] text-[1rem] hidden  ">
        <div className="bg-[#202225] py-[1vh] flex justify-between items-center pl-[22px] border-b border-[#B0B0B0]  ">
          <h1 className="w-[200px]">Activity</h1>
          <h1 className="w-[200px]">Date and Time</h1>
          <h1 className="w-[200px]">Tx Hash</h1>
        </div>
        <div className="max-h-[20.85vh] bg-[#292C31] overflow-auto ">
          {vaultsData.map((vault, index) => (
            <div
              className="flex justify-between items-center pl-[22px] py-[1vh] border-b border-[#B0B0B0]  "
              key={index}
            >
              <h1 className="w-[200px]">{vault.activity}</h1>
              <h1 className="w-[200px] ">
                {vault.date} | {vault.time}
              </h1>
              <h1 className="w-[200px]">{vault.txHash}</h1>
            </div>
          ))}
        </div>
      </div>
      <div className="md:hidden w-full flex flex-col gap-[1.56vh]">
        {vaultsData.map((vault, index) => (
          <div className="">
            <div className="bg-[#B0B0B0] w-full  rounded-t-[0.93rem] py-[1vh] px-[3.89vw] text-[#292C31] font-semibold flex items-center gap-2 text-xs  ">
              {vault.date} | {vault.time}
            </div>
            <div className=" bg-[#202225] rounded-b-[0.93rem] p-[3.86vw] text-[#B0B0B0] flex flex-col gap-1 ">
              <h6 className="font-semibold text-sm">{vault.activity}</h6>
              <p className="text-xs">{vault.txHash}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EarnIndex;
