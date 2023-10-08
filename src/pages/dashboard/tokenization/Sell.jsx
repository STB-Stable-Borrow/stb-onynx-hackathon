import React from "react";
import { AllTokens } from "../../../data/tokenizationData";
import {
  sellTokenDetails,
  sellTokenDetails2,
} from "../../../data/tokenDetails";

import xdc from "../../../assets/dashboard/xdc.svg";
import stc from "../../../assets/dashboard/stc-w.svg";
import mark from "../../../assets/dashboard/mark.svg";
import MobileAllTokenization from "./MobileAllTokenization";

function Sell({ expandedComponent }) {
  return (
    <div className="flex flex-col justify-between items-center  mt-[3.34vh] md:mt-0">
      <p
        className={`text-center text-[#585858]   mb-[.75vh] ${
          expandedComponent === "sell" ? "text-xs" : "text-[0.425rem]"
        } mx-[10.86vw] md:mx-0`}
      >
        Sell your Stable Borrow vault tokens with profits
      </p>
      <h1
        className={`text-[#865DFF] md:italic mb-[1.31vh]  font-bold text-xl mt-[6.13vh] md:mt-0 ${
          expandedComponent === "sell" ? "md:text-base" : "md:text-xs"
        } `}
      >
        All Vault's Tokens
      </h1>

      <div
        className={`md:flex items-center text-[#585858] justify-between pl-[0.7vw] pr-[0.52vw] hidden ${
          expandedComponent === "sell"
            ? "mx-0 text-xs w-full"
            : "mx-2 text-[0.425rem] w-[24vw]"
        } `}
      >
        <h2
          className={`${
            expandedComponent === "sell" ? "w-[2.12vw]" : "w-[1.12vw]"
          }`}
        >
          Id
        </h2>
        <h2
          className={`${
            expandedComponent === "sell" ? "w-[8.42vw]" : "w-[3.12vw"
          }`}
        >
          Token
        </h2>
        <h2
          className={` ${
            expandedComponent === "sell"
              ? "w-[6.25vw]"
              : "w-[3.12vw] text-center "
          }`}
        >
          Balance
        </h2>
        <h2
          className={` ${
            expandedComponent === "sell"
              ? "w-[6.25vw]"
              : "w-[3.12vw] text-center "
          }`}
        >
          Profit
        </h2>
        <h2
          className={`${
            expandedComponent === "sell" ? "w-[6.25vw]" : "w-[4.12vw] "
          }`}
        >
          Profit Amount
        </h2>
      </div>
      <div
        className={`h-[7.46vh] overflow-y-auto overflow-x-hidden md:flex flex-col gap-[.46vh] mb-[1.3vh] hidden ${
          expandedComponent === "sell" ? "w-full" : "w-[24vw]"
        }`}
      >
        {AllTokens.map((data, index) => (
          <div
            className={`md:flex items-center justify-between pl-[0.7vw] pr-[0.52vw] hidden text-[#B0B0B0] py-[0.93vh]  bg-[#292C31] rounded-[10px] ${
              expandedComponent === "sell"
                ? "mx-0 text-xs w-full"
                : "mx-2 text-[0.425rem] w-[24vw]"
            } `}
          >
            <h2
              className={`${
                expandedComponent === "sell" ? "w-[2.12vw]" : "w-[1.12vw]"
              }`}
            >
              #{data.id}
            </h2>
            <div
              className={`flex items-center gap-1 ${
                expandedComponent === "sell" ? "w-[8.42vw]" : "w-[3.12vw"
              }`}
            >
              <img src={stc} d="" className="w-[.88vw] " />
              <h2 className=" ">{data.token}</h2>
            </div>
            <h2
              className={`${
                expandedComponent === "sell" ? "w-[6.25vw]" : "w-[3.12vw] "
              }`}
            >
              ${data.balance}
            </h2>
            <h2
              className={`${
                expandedComponent === "sell" ? "w-[6.25vw]" : "w-[3.12vw] "
              }`}
            >
              ${data.profit}
            </h2>
            <h2
              className={`${
                expandedComponent === "sell" ? "w-[6.25vw]" : "w-[4.12vw] "
              }`}
            >
              ${data.profitAmount}
            </h2>
          </div>
        ))}
      </div>
      <div className=" flex flex-col gap-2 h-[15vh] overflow-y-auto mx-[3.62vw] md:hidden mb-[7.14vh] ">
        {AllTokens.map((data, index) => (
          <MobileAllTokenization data={data} key={data.id} />
        ))}
      </div>
      <h1
        className={`text-[#865DFF] md:italic mb-[1.21vh] md:mt-0 mt-[6.13vh] text-xl  font-bold ${
          expandedComponent === "sell" ? "md:text-base" : "md:text-xs"
        }`}
      >
        Token Details
      </h1>
      <div
        className={`flex justify-between items-center gap-[1.88vw] flex-col md:flex-row md:mx-0 px-[19.56vw] md:px-0 ${
          expandedComponent === "sell"
            ? "text-[.5rem] w-full"
            : "text-[0.25rem] w-[24vw]"
        } `}
      >
        <div
          className={`bg-[#292C31] px-[1.25vw] py-[0.75vh] rounded-[10px] border-[2px] border-[#585858] border-dashed ${
            expandedComponent === "sell" ? "w-full" : "w-[12vw]"
          }`}
        >
          {sellTokenDetails.map((data, index) => (
            <div className="flex justify-between items-center italic w-full md:mb-0 mb-2 ">
              <h3 className="text-[#515152] ">{data.title}</h3>
              <p className="text-[#9F9FA0] ">{data.value}</p>
            </div>
          ))}
        </div>
        <div
          className={`bg-[#292C31] px-[1.25vw] py-[0.75vh] rounded-[10px]  border-[2px] border-dashed border-[#585858] ${
            expandedComponent === "sell" ? "w-full" : "w-[12vw]"
          }`}
        >
          {sellTokenDetails2.map((data, index) => (
            <div className="flex justify-between items-center italic w-full md:mb-0 mb-2  ">
              <h3 className="text-[#515152] ">{data.title}</h3>
              <p className="text-[#9F9FA0] ">{data.value}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-[#585858] md:mx-0 mx-[10.86vw] text-center my-[0.75vh] md:py-0 py-[3.45vh]  ">
        How much would you like to withdraw?
      </p>
      <div className="flex-col items-center w-full md:w-auto px-[9.42vw] ">
        <div className="flex items-center md:justify-around justify-between w-full text-[.60rem] ">
          <h6 className="text-[#865DFF] ">Price: 12345.98</h6>
          <h6 className="text-[#B0B0B0] ">Balance: 34654328.0987</h6>
        </div>
        <div className="flex items-center justify-center w-full">
          <div className="bg-[#B0B0B0] w-[75.60vw] md:w-[17.45vw] h-[4.17vh] rounded-[10px] flex  items-center md:justify-around  px-4 md:px-0">
            <input
              type="number"
              className="h-[3vh] w-[60vw] md:w-[12vw] bg-inherit pl-[.78vw] placeholder:text-[#585858] text-sm outline-none"
              placeholder="Enter STV-1 amount"
            />
            <div className="h-[2.96vh] w-[.10vw] bg-[#202225] mx-4 md:mx-0 "></div>
            <button className="md:text-[#B0B0B0] text-[#202225] md:bg-[#202225] float-right md:w-[2.65vw] h-[2.31vh] text-xs rounded-[6px] ">
              Max
            </button>
          </div>
        </div>
      </div>
      <button className="py-[.75vh] md:h-auto h-[5.133vh] w-[75.60vw]  md:w-auto px-[2.29vw] bg-[#585858] rounded-[7px] text-[.75rem] text-[#B0B0B0] hover:bg-opacity-75 flex items-center justify-center gap-2 mt-[6.91vh] md:mt-[.93vh] mx-[9.42vw] ">
        <img src={mark} alt="" className="md:w-[1.25vw] md:h-[1.25vw] " />
        Sell
      </button>
    </div>
  );
}

export default Sell;
