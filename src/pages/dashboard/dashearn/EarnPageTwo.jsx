import React, { useState, useEffect } from "react";
import refresh from "../../../assets/earn/Refresh_Icon.svg";
import filter from "../../../assets/dashboard/filter.svg";
import search from "../../../assets/dashboard/search.svg";
import dashBorrowData from "../../../data/vaultsData";
import star from "../../../assets/dashboard/star.svg";
import unstar from "../../../assets/dashboard/unstar.svg";
import haunter from "../../../assets/dashboard/haunter.svg";
import { getAllVaults, hauntVaults } from "../../../lib/stbContract";
import Big from "big.js";
import arrowLeft from "../../../assets/dashboard/arrowLeft.svg";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import collapse from "../../../assets/mobile/collapse.svg";
import expand from "../../../assets/mobile/expand.svg";

function EarnPageTwo({
  xdcPrc,
  stb,
  _onBackClick,
  account,
  handleStatus,
  handleLoading,
}) {
  const [allVaults, setAllVaults] = useState(null);
  const [isStar, setIsStar] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  //get all vaults
  useEffect(() => {
    (async () => {
      await getAllVaults(stb).then((res) => {
        setAllVaults(res);
        setIsStar(res.map((item) => ({ id: item.id, status: false })));
      });
    })();
  }, []);

  const handleHauntVault = async (e) => {
    try {
      handleLoading();
      const vaults = await hauntVaults(stb, parseInt(e.target.id), account);
      handleLoading();
      if (vaults) {
        handleStatus(true);
      } else if (!vaults) {
        handleStatus(false);
      }
    } catch (err) {
      console.log("something went wrong", err);
      toast.error("something went wrong");
    }
  };

  return (
    <div>
      <button
        onClick={_onBackClick}
        className="md:hidden flex items-center gap-2 text-[#009FBD] text-sm mb-4  "
      >
        <img src={arrowLeft} alt="" />
        Back
      </button>
      <h1 className="md:hidden mt-[3.34vh] mb-[6.13vh] text-[#B0B0B0] font-bold ">
        Welcome!
      </h1>

      <div className="w-full bg-[#202225] text-[#B0B0B0] font-bold text-[1.125rem] border-[#585858] border-dashed border rounded-[7px] h-[4.5989vh] mb-[1.53vh] flex md:justify-between justify-center items-center gap-[31px] md:pl-[2.86vw] md:pr-[33.93vw] ">
        <button
          onClick={_onBackClick}
          className="md:flex items-center gap-2 text-[#009FBD] text-sm hidden "
        >
          <img src={arrowLeft} alt="" />
          Back
        </button>
        <h1 className=" ">Overview</h1>
      </div>

      <div className="flex justify-evenly items-center  mb-[2.93vh] flex-col md:flex-row gap-[3vh] md:gap-0 ">
        <div className="md:w-[22.84vw] w-full rounded-[20px] bg-[#12A92A] flex flex-col items-center justify-center text-[#D9D9D9] py-[2.3vh] gap-[2.59vh]  ">
          <div className="flex flex-col items-center">
            <h1 className="font-bold">XDC Price:</h1>
            <p className="mt-[-5px] text-[1.875em] font-medium ">${xdcPrc}</p>
          </div>
        </div>
        <div className="bg-[#202225] rounded-[20px] h-[10.61vh] md:w-[6.56vw] w-[30vw] flex items-center justify-center haunt border-[3px] border-[#009FBD] cursor-pointer">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 8,
              repeatType: "loop",
              repeat: true,
            }}
          >
            <img
              src={refresh}
              alt=""
              className="md:w-[4.48vw] w-[10vw] md:h-[6.9vh] cursor-pointer"
            />
          </motion.div>
        </div>
        <div className="md:w-[22.84vw] w-full rounded-[20px] bg-[#C16E08] flex flex-col items-center justify-center text-[#D9D9D9] py-[2.3vh] gap-[2.59vh]  ">
          <div className="flex flex-col items-center">
            <h1 className="font-bold">Active Haunters:</h1>
            <p className="mt-[-5px] text-[1.875em] font-medium ">20</p>
          </div>
        </div>
      </div>
      <h1 className="w-full bg-[#202225] text-center text-[#B0B0B0] font-bold text-[1.125em] border-[#585858] border-dashed border rounded-[7px] h-[4.35vh] mb-[2.73vh] ">
        All Vaults
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
              className="md:w-[24px] w-[3.25vw] md:h-[2.3vh] absolute md:top-1.5 top-2.5 left-3  "
            />
          </div>
          <button className="md:w-[2.9vw] h-full rounded-sm border border-[#B0B0B0] flex items-center justify-center ">
            <img src={filter} alt="" className="w-[24px] h-[2.34vh]" />
          </button>
        </div>
        <h2 className="text-[#B0B0B0] font-bold bg-[#202225] rounded-lg md:w-[191px] w-[32.36vw] flex items-center justify-center text-xs md:text-base ">
          Total Vaults: {dashBorrowData.length}
        </h2>
      </div>
      <div className="md:table w-full h-[34.57vh] text-[#B0B0B0] text-[1rem] hidden ">
        <div className="bg-[#202225] h-[5.76vh] flex justify-around items-center pl-[1.15vw] border-b border-[#B0B0B0] ">
          <h1 className="w-[5.13vw] ">Vault ID</h1>
          <h1 className=" w-[8.21vw] ">Vault Name</h1>
          <h1 className=" w-[6.25vw] ">Collateral</h1>
          <h1 className="w-[6.25vw]">Debt</h1>
          <h1 className="w-[5.21vw] ">Profit</h1>
          <h1 className="w-[3.13vw]">Traffic</h1>
          <h1 className="w-[1.25vw]  "> </h1>
          <h1 className="w-[1.25vw] "> </h1>
        </div>

        <div className="h-[28.8vh] overflow-y-auto">
          {allVaults &&
            allVaults.map((item, index) => {
              const isCurrentStar = isStar.find((star) => star.id === item.id);
              return (
                <div
                  key={index}
                  className="bg-[#292C31] h-[5.76vh] flex justify-around items-center pl-[22px] border-b border-[#B0B0B0]"
                >
                  <p className="w-[5.13vw] ">#{item.id}</p>
                  <p className="w-[8.21vw] text-center ">{item.id}</p>
                  <p className="w-[6.25vw]   ">
                    {new Big(item.lck_collateral).div("10e17").toFixed(4)}
                  </p>
                  <p className="w-[6.25vw]">
                    {new Big(item.debt).div("10e17").toFixed(4)}
                  </p>
                  <p className="w-[5.21vw] ">$100</p>
                  <p className="w-[3.13vw] text-center ">3</p>
                  <div className="w-[1.25vw] cursor-pointer ">
                    <img
                      onClick={() => {
                        setIsStar((prevState) =>
                          prevState.map((star) =>
                            star.id === item.id
                              ? { ...star, status: !star.status }
                              : star
                          )
                        );
                      }}
                      src={isCurrentStar?.status ? star : unstar}
                      alt=""
                      className="h-[2.34vh]"
                    />
                  </div>
                  <div className="w-[1.25vw] cursor-pointer">
                    <img
                      id={item.id}
                      onClick={(e) => handleHauntVault(e)}
                      src={haunter}
                      alt=""
                      className="h-[2.34vh]"
                    />
                  </div>
                </div>
              );
            })}
          {!allVaults && <></>}
        </div>
      </div>
      <div className="md:hidden w-full flex flex-col gap-[1.56vh]">
        {dashBorrowData.map((item, index) => (
          <div className="">
            <div className="bg-[#B0B0B0] w-full h-[3.57vh] rounded-t-[0.93rem] py-[1vh] px-[3.89vw] text-[#292C31] font-semibold flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <h1>{item.vaultName}</h1>
              </div>
            </div>
            <div className=" bg-[#202225] rounded-b-[0.93rem] p-[3.86vw] text-[#B0B0B0]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-[#B0B0B0] w-[10.62vw] h-[10.62vw] rounded-[0.43rem] flex items-center justify-center ">
                    <p className="text-sm font-semibold text-[#202225] ">
                      #{item.id}{" "}
                    </p>
                  </div>
                  <div className="flex flex-col ">
                    <h6 className="font-semibold text-sm">
                      Traffic: {item.traffic}
                    </h6>
                    <div className="w-[3.14vw] cursor-pointer ">
                      <img
                        src={item.star ? star : unstar}
                        alt=""
                        className="h-[2.34vh]"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.haunter && (
                    <div className="w-[8.45vw] cursor-pointer border border-[#009FBD] flex items-center justify-center p-1 rounded-[0.5rem]">
                      <img
                        id={item.id}
                        onClick={(e) => handleHauntVault(e)}
                        src={haunter}
                        alt=""
                      />
                    </div>
                  )}
                  <img
                    src={isExpanded ? collapse : expand}
                    alt=""
                    onClick={handleExpand}
                  />
                </div>
              </div>
              {isExpanded && (
                <div className="mt-[2.45vh] flex flex-col text-xs ">
                  <div className="flex items-start gap-4  ">
                    <h6 className="w-[30.07vw] font-bold ">Collateral: </h6>
                    <span>${item.collateral}</span>
                  </div>

                  <div className="flex items-start gap-4  ">
                    <h6 className="w-[30.07vw] font-bold ">Debt: </h6>
                    <span> {item.debt} </span>
                  </div>
                  <div className="flex items-start gap-4  ">
                    <h6 className="w-[30.07vw] font-bold ">Profit: </h6>
                    <span> {item.profit} </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EarnPageTwo;
