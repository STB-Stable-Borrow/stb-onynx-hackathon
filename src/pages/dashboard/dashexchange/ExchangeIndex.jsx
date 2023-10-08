import React, { useState } from "react";
import drag from "../../../assets/dashboard/drag.svg";
import SwapIndex from "./SwapIndex";
import PoolIndex from "./PoolIndex";
import ExchangeConfirmations from "./ExchangeConfirmations";
import TokenizationFailedModal from "./FailedModal";
import TokenizationSuccessModal from "./SuccessModal";
import FailedModal from "./FailedModal";
import SuccessModal from "./SuccessModal";
import ExchangeIndexV1 from "./ExchangeIndexV1";

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
  const [expandedComponent, setExpandedComponent] = useState("swap");
  const [confirmationRes, setConfirmationRes] = useState(null);

  const handleExpand = (component) => {
    setExpandedComponent(component);
  };

  return (
    <>
      <div className=" items-center justify-between w-full min-h-auto h-[70.67vh] gap-[0.99vw] overflow-hidden hidden md:flex ">
        <div
          className={`rounded-[40px] bg-[#202225] h-full px-[1.30vw] py-[1.67vh] flex flex-col items-center justify-between mx-auto
        border-[#009FBD80]
        ${
          expandedComponent === "swap"
            ? "w-[65%] h-full border-[5px]"
            : "w-[35%] h-[90%] border-[3.5px] "
        }
        `}
          onClick={() => handleExpand("swap")}
        >
          <div className="flex flex-col items-center">
            <h1
              className={`text-[#585858] ${
                expandedComponent === "pool" ? "text-xs" : "text-base"
              } tracking-[5.6px] font-bold mb-[0.65vh] `}
            >
              STABLE SWAP
            </h1>
            <div className="head-border">
              <h2
                className={`exchange-head ${
                  expandedComponent === "pool" ? "text-base" : "text-[1.44rem] "
                }`}
              >
                SWAP
              </h2>
            </div>
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
              expandedComponent={expandedComponent}
            />
          </div>
        </div>
        <div
          className={`exchange rounded-[40px] bg-[#202225] h-full px-[1.30vw] py-[1.67vh] flex flex-col items-center mx-auto
        border-[#009FBD80]
        ${
          expandedComponent === "pool"
            ? "w-[65%] h-full border-[5px] "
            : "w-[35%] h-[90%] border-[3.5px]"
        } 
        `}
          onClick={() => handleExpand("pool")}
        >
          <h1
            className={`text-[#585858] ${
              expandedComponent === "swap" ? "text-xs" : "text-base"
            } tracking-[5.6px] font-bold mb-[0.65vh] `}
          >
            STABLE SWAP
          </h1>
          <div className="head-border">
            <h2
              className={`exchange-head ${
                expandedComponent === "swap" ? "text-base" : "text-[1.44rem] "
              }`}
            >
              POOL
            </h2>
          </div>
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
            expandedComponent={expandedComponent}
          />
          {confirmationRes === false && (
            <TokenizationFailedModal _setConfirmationRes={setConfirmationRes} />
          )}
          {confirmationRes === true && (
            <TokenizationSuccessModal
              _setConfirmationRes={setConfirmationRes}
            />
          )}
        </div>
      </div>
      <ExchangeIndexV1 />
    </>
  );
}

export default ExchangeIndex;
