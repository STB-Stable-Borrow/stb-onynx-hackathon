import React,{useState,useEffect } from "react";
import haunt from "../../../assets/dashboard/haunt.svg";
import filter from "../../../assets/dashboard/filter.svg";
import search from "../../../assets/dashboard/search.svg";
import vaultsData from "../../../data/vaultsData";
import { useDashboard } from "../../../contexts/dashboardContext";
  

function History() {
    const { active, activeTab } = useDashboard();

  useEffect(() => {
    if (active === 1) {
      activeTab(4);
    }
  }, []);
  return(
    <div>
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
              className="h-full w-[426px] rounded-lg bg-[#B0B0B0] pl-[50px] placeholder:text-[#292C31] text-[#292C31] "
              placeholder="Search..."
            />
            <img
              src={search}
              alt=""
              className="w-[24px] h-[2.3vh] absolute top-1.5 left-3  "
            />
          </div>
          <button className="w-[2.9vw] h-full rounded-sm border border-[#B0B0B0] flex items-center justify-center ">
            <img src={filter} alt="" className="w-[24px] h-[2.34vh]" />
          </button>
        </div>
        <h2 className="text-[#B0B0B0] font-bold bg-[#202225] rounded-lg w-[191px] flex items-center justify-center ">
          Total Vaults: {vaultsData.length}
        </h2>
      </div>
      <div className="table h-full w-full text-[#B0B0B0] text-[1rem]  ">
        <div className="bg-[#202225] py-[1vh] flex justify-between items-center pl-[22px] border-b border-[#B0B0B0]  ">
          <h1 className="w-[200px]">Activity</h1>
          <h1 className="w-[200px]">Date and Time</h1>
          <h1 className="w-[200px]">Tx Hash</h1>
        </div>
        <div className="h-[50vh] bg-[#292C31] overflow-auto ">
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

    </div>
  )

}

export default History;
