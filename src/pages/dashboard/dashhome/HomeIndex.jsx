import React, { useState, useEffect } from "react";
import arrow from "../../../assets/dashboard/arrow.svg";
import vaultsData from "../../../data/vaultsData";
import { useNavigate } from "react-router-dom";
import { useBorrow } from "../../../contexts/borrowContext/borrowContext";

function HomeIndex({
  isReg,
  totalLck,
  totalDebt,
  xdcPrc,
  hauntedVlts,
  liquidatedVlts,
  colRatio,
  allVaults,
}) {
  const [isBorrowOverview, setIsBorrowOverview] = useState(false);
  const [isEarnOverview, setIsEarnOverview] = useState(false);
  const navigate = useNavigate();
  const { setFromDashborrow, setFromDashearn } = useBorrow();

  const getArrayLength = (_array) => {
    let finalRes = [];
    _array.forEach((item) => {
      if (item.created_at > 0) {
        finalRes.push(item);
      }
    });
    return finalRes.length;
  };

  useEffect(() => {
    if (totalLck || totalDebt !== null) {
      setIsBorrowOverview(true);
    }
    if (hauntedVlts !== null) {
      setIsEarnOverview(true);
    }
  }, [totalLck, totalDebt, hauntedVlts]);

  return (
    <div className=" overflow-hidden px-[4.83vw] md:px-0 pb-[15.62vh] md:pb-0 ">
      <div className=" text-[#D9D9D9] flex flex-col justify-around mb-[5.09vh] md:flex-row gap-[3.34vh] md:gap-0   ">
        <h1 className="md:hidden mt-[3.34vh] mb-[8.48vh] text-[#B0B0B0] font-bold ">
          Welcome!
        </h1>
        <div
          className={` ${
            !isBorrowOverview && "opacity-10 cursor-not-allowed"
          } border-[3px] border-dashed  border-[#585858] px-[4.83vw] md:px-[1.04vw] h-[28.79vh]  md:h-[34.26vh] min-w-[33.56vw] rounded-[1.5625rem] py-[1.94vh] bg-gradient-to-b 180deg from-[#009fbd] -52.27 to-[#344e53] 127.2% flex flex-col gap-[2.78vh] items-center  `}
        >
          <h1 className="font-semibold md:text-base text-xl">
            Borrow Overview
          </h1>
          <div className="flex justify-between gap-[1.93vw] md:gap-[19px] md:h-[16.20vh] h-[10.15vh] w-full md:w-auto">
            <div className="bg-[#12A92A]  px-[1.88vw] rounded-[0.625rem] flex flex-col items-center justify-center w-full md:w-auto ">
              <h1 className="text-[0.675rem] font-bold ">Total Locked</h1>
              <p className="text-[1.25rem] font-medium">
                ${(xdcPrc * totalLck).toFixed(4)}
              </p>
            </div>
            <div className="bg-[#FF1F1F] px-[1.88vw] rounded-[0.625rem] flex flex-col items-center justify-center w-full md:w-auto  ">
              <h1 className="text-[0.675rem] font-bold ">Total Debt</h1>
              <p className="text-[1.25rem] font-medium">${1 * totalDebt}</p>
            </div>
          </div>
          {allVaults && allVaults.length < 10 && (
            <button
              onClick={() => {
                setFromDashborrow(true);
                navigate("/borrow");
              }}
              className={` bg-[#009FBD] w-full md:w-[12.66vw] py-[0.85vh] rounded-lg flex items-center justify-center gap-2 text-[0.85rem] text-white hover:bg-opacity-75`}
            >
              Borrow Now{" "}
              <img src={arrow} alt="" className="w-[2.22vh] h-[2.22vh] " />
            </button>
          )}
          {allVaults && allVaults.length > 10 && (
            <button
              disabled={true}
              className={`${
                !isBorrowOverview && "cursor-not-allowed"
              } bg-[#009FBD] w-full md:w-[12.66vw] py-[0.85vh] rounded-lg flex items-center justify-center gap-2 text-[0.85rem] text-white hover:bg-opacity-75`}
            >
              Borrow Now{" "}
              <img src={arrow} alt="" className="w-[2.22vh] h-[2.22vh] " />
            </button>
          )}
          {!allVaults && (
            <button
              disabled={true}
              className={`${
                !isBorrowOverview && "cursor-not-allowed"
              } bg-[#009FBD] w-full md:w-[12.66vw] py-[0.85vh] rounded-lg flex items-center justify-center gap-2 text-[0.85rem] text-white hover:bg-opacity-75`}
            >
              Borrow Now{" "}
              <img src={arrow} alt="" className="w-[2.22vh] h-[2.22vh] " />
            </button>
          )}
        </div>

        <div
          className={`${
            !isBorrowOverview && "cursor-not-allowed"
          } border-[3px] border-dashed border-[#585858] md:px-[1.04vw] px-[4.83vw] md:min-h-full   min-h-[34.26vh] min-w-[33.56vw] rounded-[1.562rem] py-[1.94vh] bg-gradient-to-b 180deg from-[#865DFF] -52.27 to-[#344e53] 127.2%  flex flex-col gap-[2.78vh] items-center`}
        >
          <h1 className="font-semibold  md:text-base text-xl">Earn Overview</h1>
          <div className="flex justify-between gap-[1.93vw] md:gap-[19px] h-[18.08vh] md:h-[16.20vh] w-full md:w-auto  ">
            <div className="bg-[#12A92A] md:min-h-auto h-[15vh] md:h-full py-[2.79vh] px-[1.83vw] rounded-[0.625rem] flex flex-col items-center justify-between gap-[1.34vh]">
              <div className="flex flex-col gap-1 items-center">
                <h1 className="text-[0.5rem] font-bold ">
                  Total Vaults Haunted:
                </h1>
                {hauntedVlts && (
                  <p className="md:text-[1.25rem] text-base mt-[-0.74vh] font-medium">
                    {getArrayLength(hauntedVlts)}
                  </p>
                )}
                {!hauntedVlts && (
                  <p className="text-[1.25rem] mt-[-0.74vh] font-medium"></p>
                )}
              </div>
              <div className="flex flex-col gap-1 items-center">
                <h1 className="text-[0.5rem] font-bold ">Total Payout:</h1>
                <p className="md:text-[1.25rem] text-center text-sm mt-[-0.74vh] font-medium">
                  350000.0000 XDC
                </p>
              </div>
            </div>
            <div className="bg-[#C16E08] md:min-h-auto h-[15vh] md:h-full py-[2.79vh] px-[1.83vw] rounded-[0.625rem] flex flex-col items-center justify-between gap-[1.34vh]">
              <div className="flex flex-col gap-1 items-center">
                <h1 className="text-[0.5rem] text-center font-bold ">
                  Current Collateral Ratio:
                </h1>
                <p className="text-sm md:text-[1.25rem] mt-[-0.74vh] font-medium">
                  {colRatio}
                </p>
              </div>
              <div className="flex flex-col items-center gap-1">
                <h1 className="text-[0.5rem] text-center font-bold ">
                  Total Vaults in Liquidity:
                </h1>
                {liquidatedVlts && (
                  <p className="text-sm md:text-[1.25rem] mt-[-0.74vh] font-medium">
                    {getArrayLength(liquidatedVlts)}
                  </p>
                )}
                {!liquidatedVlts && (
                  <p className="text-sm md:text-[1.25rem] mt-[-0.74vh] font-medium"></p>
                )}
              </div>
            </div>
          </div>
          {!isReg && (
            <button
              onClick={() => {
                setFromDashearn(true);
                navigate("/register");
              }}
              className={`${
                !isEarnOverview && "cursor-not-allowed"
              } bg-[#865DFF] w-full md:w-[12.66vw] py-[0.85vh] rounded-lg flex items-center justify-center gap-2 text-[0.85rem] text-white hover:bg-opacity-75 `}
            >
              Earn Now{" "}
              <img src={arrow} alt="" className="w-[2.22vh] h-[2.22vh] " />
            </button>
          )}
          {isReg && (
            <button
              disabled={true}
              className={`${
                !isEarnOverview && "cursor-not-allowed"
              } bg-[#865DFF] w-full md:w-[12.66vw] py-[0.85vh] rounded-lg flex items-center justify-center gap-2 text-[0.85rem] text-white hover:bg-opacity-75 `}
            >
              Earn Now{" "}
              <img src={arrow} alt="" className="w-[2.22vh] h-[2.22vh] " />
            </button>
          )}
        </div>
      </div>
      <h1 className="w-full bg-[#202225] text-center text-[#B0B0B0] font-bold text-[1.125em] border-[#585858] border-dashed border rounded-[7px] h-[4.35vh] mb-[1.48vh] ">
        History
      </h1>
      <div className="hidden w-full text-[#B0B0B0] text-[1rem] md:table ">
        <div className="bg-[#202225] h-[5.76vh] flex justify-between items-center pl-[22px] border-b border-[#B0B0B0]  ">
          <h1 className="w-[300px]">Activity</h1>
          <h1 className="w-[300px]">Date and Time</h1>
          <h1 className="w-[300px]">Tx Hash</h1>
        </div>
        <div className="max-h-[25.85vh] bg-[#292C31] overflow-auto ">
          {vaultsData.map((vault, index) => (
            <div
              className="flex justify-between items-center pl-[22px] pr-2 py-[1.94vh] border-b border-[#B0B0B0]  "
              key={index}
            >
              <h1 className="w-[300px]">{vault.activity}</h1>
              <h1 className="w-[300px] ">
                {vault.date} | {vault.time}
              </h1>
              <h1 className="w-[300px]">{vault.txHash}</h1>
            </div>
          ))}
        </div>
      </div>
      <div className="md:hidden w-full flex flex-col gap-[1.56vh] ">
        {vaultsData.map((vault, index) => (
          <div className="">
            <div className="bg-[#B0B0B0] w-full h-[3.57vh] rounded-t-[0.93rem] py-[1vh] px-[3.89vw] text-[#292C31] font-semibold flex items-center gap-2 text-xs  ">
              {vault.date} | {vault.time}
            </div>
            <div className="h-[7.7vh] bg-[#202225] rounded-b-[0.93rem] p-[3.86vw] text-[#B0B0B0] flex flex-col gap-1 ">
              <h6 className="font-semibold text-sm">{vault.activity}</h6>
              <p className="text-xs">{vault.txHash}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomeIndex;
