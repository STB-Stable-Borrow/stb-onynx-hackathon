import React, { useState } from "react";
import divider from "../../../assets/dashboard/divider.svg";
import xdc from "../../../assets/dashboard/xdc.svg";
import stc from "../../../assets/dashboard/stc.svg";
import swapImg from "../../../assets/dashboard/swap.svg";
import question from "../../../assets/dashboard/question.svg";
import remove from "../../../assets/dashboard/remove.svg";
import add from "../../../assets/dashboard/add.svg";

function Liquidity({ assetOne, assetTwo, expandedComponent }) {
  const [slippage, setSlippage] = useState([
    {
      id: 1,
      value: 0.1,
      isActive: false,
    },
    {
      id: 2,
      value: 0.5,
      isActive: false,
    },
    {
      id: 3,
      value: 1,
      isActive: false,
    },
  ]);

  const [isSwapped, setIsSwapped] = useState(false);

  const handleSwap = () => {
    setIsSwapped((prev) => !prev);
  };

  const [inputValue, setInputValue] = useState("");
  const [activeSlippage, setActiveSlippage] = useState(0);

  const handleInputChange = (e) => {
    const value = parseFloat(e.target.value);
    setInputValue(value);

    const updatedSlippage = slippage.map((slip) => ({
      ...slip,
      isActive:
        (slip.value === 0.1 && value >= 0 && value <= 0.49) ||
        (slip.value === 0.5 && value >= 0.5 && value <= 0.99) ||
        (slip.value === 1 && value >= 1),
    }));

    setSlippage(updatedSlippage);
  };

  const handleSlippageClick = (id) => {
    setActiveSlippage(id);

    const updatedSlippage = slippage.map((slip) => ({
      ...slip,
      isActive: slip.id === id,
    }));

    setSlippage(updatedSlippage);
    setInputValue("");
  };

  const [isAddLiquidity, setIsAddLiquidity] = useState(true);

  const handleLiquidityToggle = () => {
    setIsAddLiquidity((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center justify-center gap-2 md:gap-[0.47vw] mt-[4.57vh] md:mt-0 font-semibold text-[.825em] mb-[0.275vh] ">
        <h1
          className={` ${
            isAddLiquidity ? "text-[#009FBD]" : "text-[#585858] "
          } cursor-pointer`}
          onClick={handleLiquidityToggle}
        >
          Add Liquidity
        </h1>
        <img src={divider} alt="" />
        <h1
          className={` ${
            isAddLiquidity ? "text-[#585858] " : "text-[#009FBD]"
          } cursor-pointer`}
          onClick={handleLiquidityToggle}
        >
          Remove Liquidity
        </h1>
      </div>
      <div
        className={`flex flex-col py-[1vh] ${
          isSwapped ? "flex-col-reverse" : "flex-col"
        } `}
      >
        <div
          className={`flex flex-col ${
            isSwapped ? "flex-col-reverse" : "flex-col"
          }`}
        >
          <p
            className={`text-[#B0B0B0] ${
              expandedComponent === "pool"
                ? "text-[0.85rem]"
                : "text-[0.63rem] "
            } text-center`}
          >
            Balance: 24,333.2213 {assetOne}
          </p>
          <div
            className={`bg-[#B0B0B0] h-[4.63vh] rounded-[10px] w-[75.6vw] ${
              expandedComponent === "pool" ? "md:w-[30vw]" : "md:w-[22vw]"
            } px-[.83vw] py-[.56vh] flex items-center`}
          >
            <img
              src={xdc}
              alt=""
              className="w-[3.2vh] h-[3.2vh] mr-[0.52vw] "
            />
            <select
              name=""
              id=""
              className="bg-inherit font-semibold text-[.85rem] "
            >
              <option value={assetOne}>{assetOne}</option>
              <option value={assetTwo}>{assetTwo}</option>
            </select>
            <div className="h-[3.43vh] w-[2px] bg-[#292C31] mx-2 md:mx-[.73vw] "></div>
            <div className="relative">
              <input
                type="number"
                name=""
                id=""
                className={`bg-inherit ${
                  expandedComponent === "pool"
                    ? "md:w-[15.25vw]"
                    : "md:w-[10.25vw]"
                } pl-[.73vw] placeholder:text-[#292c31] placeholder:font-semibold  font-semibold text-xs outline-none`}
                placeholder="0"
              />
              <button
                className={`absolute right-[-2.375rem] ${
                  expandedComponent === "pool"
                    ? "md:right-[-4rem]"
                    : "md:right-[-2.26vw]"
                } top-[0.58vh] text-[.75rem]`}
              >
                Max
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center w-full md:w-[17.45vw] justify-between my-[1.48vh] gap-4 md:gap-0 mx-auto">
          <div className="md:w-[7.29vw] w-full h-[.19vh] bg-[#B0B0B0] "></div>
          <button onClick={handleSwap}>
            <img src={swapImg} alt="" className="md:w-auto w-20" />
          </button>
          <div className="md:w-[7.29vw] w-full h-[.19vh] bg-[#B0B0B0] "></div>
        </div>
        <div
          className={`flex flex-col ${
            isSwapped ? "flex-col-reverse" : "flex-col"
          }`}
        >
          <div
            className={`bg-[#B0B0B0] h-[4.63vh] rounded-[10px] w-[75.6vw] ${
              expandedComponent === "pool" ? "md:w-[30vw]" : "md:w-[22vw]"
            } px-[.83vw] py-[.56vh] flex items-center`}
          >
            <img
              src={stc}
              alt=""
              className="w-[3.2vh] h-[3.2vh] mr-[0.52vw] "
            />
            <select
              name=""
              id=""
              className="bg-inherit font-semibold text-[.85rem] "
            >
              <option value={assetTwo}>{assetTwo}</option>
              <option value={assetTwo}>{assetOne}</option>
            </select>
            <div className="h-[3.43vh] w-[2px] bg-[#292C31] mx-2 md:mx-[.73vw] "></div>
            <div className="relative">
              <input
                type="number"
                name=""
                id=""
                className={`bg-inherit ${
                  expandedComponent === "pool"
                    ? "md:w-[15.25vw]"
                    : "md:w-[10.25vw]"
                } pl-[.73vw] placeholder:text-[#292c31] placeholder:font-semibold  font-semibold text-xs outline-none`}
                placeholder="0"
              />
              <button
                className={`absolute right-[-2.375rem] ${
                  expandedComponent === "pool"
                    ? "md:right-[-4rem]"
                    : "md:right-[-2.26vw]"
                } top-[0.58vh] text-[.75rem]`}
              >
                Max
              </button>
            </div>
          </div>
          <p
            className={`text-[#B0B0B0] ${
              expandedComponent === "pool"
                ? "text-[0.85rem]"
                : "text-[0.63rem] "
            } text-center mt-[1.5vh`}
          >
            Balance: 24,333.2213 {assetTwo}
          </p>
        </div>
      </div>
      <div
        className={` w-[75.60vw] ${
          expandedComponent === "pool" ? "md:w-[30vw]" : "md:w-[22vw]"
        } py-2 md:py-[0.5rem] px-4 md:px-[1.04vw] rounded-[15px] bg-[#292C31] mb-[1.5vh] flex flex-col justify-center items-center  `}
      >
        <h4 className="text-[#B0B0B0] text-[0.75rem] flex items-center justify-center gap-1 font-semibold mb-[0.5vh]">
          Slippage Tolerance:
          <img src={question} alt="" className=" " />
        </h4>

        <div className="flex items-center justify-between w-full ">
          <div
            className={`bg-[#202225] w-[50%] ${
              expandedComponent === "pool" ? "md:w-[15.25vw]" : "md:w-[9.53vw] "
            } h-[3.89vh] px-[1.15vw] justify-between flex items-center text-[0.65rem] rounded-[10px] text-[#B0B0B0]`}
          >
            {slippage.map((slip) => (
              <p
                key={slip.id}
                className={`cursor-pointer ${
                  slip.isActive ? "text-[#009FBD]" : "text-gray-500"
                }`}
                onClick={() => handleSlippageClick(slip.id)}
              >
                {slip.value + "%"}
              </p>
            ))}
          </div>
          <div className="bg-[#B0B0B0] rounded-[10px] h-[3.89vh] pl-4 md:pl-[.5vw] w-[40%] md:w-[8.74vw] flex items-center relative text-[0.65rem] ">
            <input
              type="number"
              className="bg-inherit w-[75%] md:w-[6.74vw] placeholder:text-black text-xs  "
              placeholder="input slippage"
              value={inputValue}
              onChange={handleInputChange}
            />
            <p className="absolute  right-1">%</p>
          </div>
        </div>
      </div>
      <div
        className={`px-[1.8vw] py-[1.13vh] w-[75.60vw] md:w-[21.04vw] bg-[#292C31] text-[#b0b0b0] mb-[1.22vh] border-[1.5px] border-[#585858] border-dashed ${
          expandedComponent === "pool"
            ? "text-[0.75rem] rounded-[20px] "
            : "text-[0.425rem] rounded-[8px] "
        }`}
      >
        <div className="flex items-center  gap-[1.09vw] justify-between mb-1">
          <div className="flex items-center gap-[1px]">
            <img src={question} alt="" />
            <h4>Minimum Received:</h4>
          </div>
          <p className="">0</p>
        </div>
        <div className="flex items-center  gap-[1.09vw] justify-between">
          <div className="flex items-center gap-[1px]">
            <img src={question} alt="" />
            <h4>Pool Fee:</h4>
          </div>
          <p>0.00% / 0.000 XDC </p>
        </div>
      </div>
      <button
        className={`${
          expandedComponent === "pool"
            ? "py-[.75vh] text-[.75rem] w-[75.60vw] rounded-[7px]"
            : "py-[.25vh] text-[.425rem] w-[55.60vw] rounded-[4px] "
        }   md:w-auto px-[2.29vw] bg-[#585858]   text-[#B0B0B0] hover:bg-opacity-75 flex items-center justify-center gap-2 md:mt-0 mt-[5.58vh] md:mb-0 mb-[3.87rem] `}
      >
        <img
          src={isAddLiquidity ? add : remove}
          alt=""
          className={`${
            expandedComponent === "pool"
              ? "md:w-[1.25vw] md:h-[1.25vw]"
              : "md:w-[.95vw] md:h-[.95vw]"
          } h-[1.125rem] w-[1.125rem] `}
        />
        {isAddLiquidity ? "Add" : "Remove"} Liquidity
      </button>
    </div>
  );
}

export default Liquidity;
