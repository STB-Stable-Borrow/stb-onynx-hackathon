import React, { useState } from "react";
import filter from "../../../assets/dashboard/filter.svg";
import search from "../../../assets/dashboard/search.svg";
import edit from "../../../assets/dashboard/edit.svg";
import dashBorrowData from "../../../data/vaultsData";
import set from "../../../assets/dashboard/set.svg";
import { Big } from "big.js";
import collapse from "../../../assets/mobile/collapse.svg";
import expand from "../../../assets/mobile/expand.svg";

function Borrow({
  totalLck,
  totalDebt,
  xdcPrc,
  colRatio,
  allVaults,
  _onVaultClick,
}) {
  // const {vault, onVaultClick} = useDashboard();
  //gets vault status
  const getStatus = (ratio) => {
    let status;
    if (parseFloat(ratio) >= parseFloat(colRatio)) {
      if (parseFloat(ratio) > parseFloat(colRatio)) {
        status = "Active";
      } else {
        status = "Partial Active";
      }
    } else {
      status = "Haunted";
    }
    return status;
  };

  const handleSettings = (e) => {
    const id = e.target.id;
    _onVaultClick(id);
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const handleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  // const [editVault, setEditVault] = useState(false);

  return (
    <div className="px-[4.83vw] md:px-0 md:pb-0 pb-[15.62vh]">
      <h1 className="md:hidden mt-[3.34vh] mb-[5.46vh] text-[#B0B0B0] font-bold ">
        Welcome!
      </h1>
      <h1 className=" bg-[#202225] text-[#B0B0B0] font-bold text-[1.125rem] border-[#585858] border-dashed border rounded-[7px] py-[0.5vh] mb-[1.56vh] flex items-center  justify-center ">
        Overview
      </h1>
      <div className="flex flex-col items-center gap-[1.56vh] md:gap-0 md:justify-around text-[#D9D9D9] mb-[4.25vh] h-auto md:h-[15.4vh] md:flex-row ">
        <div className="w-full md:w-[264px] pt-[2.44vh] pb-[3.027vh] rounded-[20px] bg-[#12A92A] flex justify-center items-center flex-col ">
          <h1 className="text-sm font-bold">Total Locked </h1>
          <p className="text-[1.875rem] font-medium ">
            ${(xdcPrc * totalLck).toFixed(4)}
          </p>
        </div>
        <div className="w-full md:w-[264px] pt-[2.44vh] pb-[3.027vh] rounded-[20px] bg-[#FF1F1F] flex justify-center items-center flex-col ">
          <h1 className="text-sm font-bold">Total Debts </h1>
          <p className="text-[1.875rem] font-medium ">${1 * totalDebt}</p>
        </div>
        <div className="w-full md:w-[264px] pt-[2.44vh] pb-[3.027vh] rounded-[20px] bg-[#865DFF] flex justify-center items-center flex-col ">
          <h1 className="text-sm font-bold">Collateralization Ratio</h1>
          <p className="text-[1.875rem] font-medium ">{colRatio}</p>
        </div>
      </div>
      <h1 className=" bg-[#202225] text-center text-[#B0B0B0] font-bold text-[1.125rem] border-[#585858] border-dashed border rounded-[7px] py-[0.5vh] mb-[2.73vh] ">
        Vaults
      </h1>
      <div className="flex justify-between mb-[3.22vh] h-[4.1vh] w-full ">
        <div className="h-full flex gap-4">
          <div className="relative h-full">
            <input
              type="search"
              name=""
              id=""
              className="h-full w-[36.95vw] md:w-[426px] rounded-lg bg-[#B0B0B0] md:pl-[50px]  pl-[30px] placeholder:text-[#292C31] text-sm text-[#292C31] "
              placeholder="Search..."
            />
            <img
              src={search}
              alt=""
              className="md:w-[24px] md:h-[2.3vh] absolute md:top-1.5 top-2 left-3 w-[3.25vw]  "
            />
          </div>
          <button className="md:w-[2.9vw] h-full rounded-sm border border-[#B0B0B0] flex items-center justify-center ">
            <img src={filter} alt="" className="w-[24px] h-[2.34vh]" />
          </button>
        </div>
        {allVaults && (
          <h2 className="text-[#B0B0B0] font-bold bg-[#202225] rounded-lg  md:w-[191px] text-center ">
            Total Vaults: {allVaults.length}
          </h2>
        )}
      </div>
      <div className="md:table w-full  text-[#B0B0B0] text-[1rem] hidden ">
        <div className="bg-[#202225] w-full h-[5.76vh] flex justify-between  pl-[21px] items-center  border-b border-[#B0B0B0]  ">
          <h1 className="w-[5.13vw] ">Vault ID</h1>
          <h1 className=" w-[7.21vw]  ">Vault Name</h1>
          <h1 className="w-[2.60vw]">Asset</h1>
          <h1 className="w-[10.81vw]    ">Collateral Locked</h1>
          <h1 className=" w-[10.81vw] ">Liquidation Ratio</h1>
          <h1 className=" w-[6.25vw]  ">Debt</h1>
          <h1 className="w-[5.21vw]  ">Status</h1>
          <h1 className="w-[3.13vw]">Edit</h1>
        </div>
        <div>
          {allVaults && (
            <div className="max-h-[25.8vh] overflow-y-auto">
              {allVaults.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#292C31] w-full  h-[5.76vh] flex justify-between pl-[21px] items-center  border-b border-[#B0B0B0]  "
                >
                  <h1 className="w-[5.13vw]">#{item.id}</h1>
                  <h1 className="w-[7.21vw] text-center ">{item.id}</h1>
                  <h1 className="w-[2.60vw]   ">XDC</h1>
                  <h1 className="w-[10.81vw]  ">
                    $
                    {(
                      xdcPrc *
                      new Big(item.lck_collateral).div("10e17").toFixed(4)
                    ).toFixed(4)}
                  </h1>
                  <h1 className="w-[10.81vw]  ">
                    {new Big(item.col_ratio).div("10e17").toFixed(4)}
                  </h1>
                  <h1 className="w-[6.21vw] ">
                    ${new Big(item.debt).div("10e17").toFixed(4)}
                  </h1>
                  <h1
                    className={` w-[5.21vw] px-[0.52vw] rounded-lg text-center   text-xs ${
                      getStatus(
                        new Big(item.col_ratio).div("10e17").toFixed(4)
                      ) === "Partial Active" && "bg-[#FFF5E8] text-[#F9971E] "
                    } 
                  ${
                    getStatus(
                      new Big(item.col_ratio).div("10e17").toFixed(4)
                    ) === "Haunted" && "bg-[#FFEBEB] text-[#FF1F1F] "
                  } 
                  ${
                    getStatus(
                      new Big(item.col_ratio).div("10e17").toFixed(4)
                    ) === "Active" && "bg-[#E1FBDA] text-[#12A92A] "
                  } 
                  } `}
                  >
                    {getStatus(new Big(item.col_ratio).div("10e17").toFixed(4))}
                  </h1>
                  <button className="w-[3.21vw] flex items-center ">
                    <img
                      id={item.id}
                      onClick={(e) => handleSettings(e)}
                      src={set}
                      alt=""
                    />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="md:hidden w-full flex flex-col gap-[1.56vh]">
        {dashBorrowData.map((item, index) => (
          <div className="">
            <div className="bg-[#B0B0B0] w-full h-[3.57vh] rounded-t-[0.93rem] py-[1vh] px-[3.89vw] text-[#292C31] font-semibold flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <h1>{item.vaultName}</h1>
                <img src={edit} alt="" className="w-[4.25vw] " />
              </div>
              <div className="flex items-center gap-2">
                <img src={set} alt="" onClick={(e) => handleSettings(e)} />
                <p>Edit</p>
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
                      Asset: {item.asset}
                    </h6>
                    <p className="text-xs">{item.collateralLocked}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <h6
                    className={`text-xs font-semibold px-[3.62vw] rounded-[0.43rem] ${
                      item.status === "Partial Active" &&
                      "bg-[#FFF5E8] text-[#F9971E] "
                    }

                    ${
                      item.status === "Active" && "bg-[#E1FBDA] text-[#12A92A] "
                    }
                    
                    ${
                      item.status === "Haunted" &&
                      "bg-[#FFEBEB] text-[#FF1F1F] "
                    } `}
                  >
                    {item.status}
                  </h6>
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
                    <h6 className="w-[30.07vw] font-bold ">
                      Liquidation Price:{" "}
                    </h6>
                    <span>${item.liquidationPrice}</span>
                  </div>

                  <div className="flex items-start gap-4  ">
                    <h6 className="w-[30.07vw] font-bold ">Debt: </h6>
                    <span> {item.debt} </span>
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

export default Borrow;
