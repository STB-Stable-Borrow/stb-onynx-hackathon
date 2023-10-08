import React, { useState } from "react";
import drag from "../../../assets/dashboard/drag.svg";
import Buy from "./Buy";
import Sell from "./Sell";

function Tokenization() {
  const [expandedComponent, setExpandedComponent] = useState("buy");
  const handleExpand = (component) => {
    setExpandedComponent(component);
  };
  return (
    <>
      <div className="flex items-center justify-between w-full min-h-auto h-[70.67vh] gap-[0.99vw] overflow-hidden  ">
        <div
          className={`rounded-[40px] bg-[#202225] h-auto px-[1.30vw] py-[1.67vh] flex-col items-center  mx-auto  mt-[8.92vh]  md:mt-0  border-[#009FBD80] ${
            expandedComponent === "buy"
              ? "w-[65%] h-full border-[5px]"
              : "w-[35%] h-[95%] border-[3.5px] "
          }`}
          onClick={() => handleExpand("buy")}
        >
          <div className="flex flex-col items-center">
            <h1
              className={`text-[#585858] ${
                expandedComponent === "sell" ? "text-xs" : "text-base"
              } tracking-[5.6px] font-bold mb-[0.65vh] `}
            >
              TOKENIZATION
            </h1>
            <div className="head-border">
              <h2
                className={`exchange-head ${
                  expandedComponent === "sell" ? "text-base" : "text-[1.25rem] "
                }`}
              >
                BUY
              </h2>
            </div>
            <Buy expandedComponent={expandedComponent} />
          </div>
        </div>

        <div
          className={`rounded-[40px] bg-[#202225] h-auto px-[1.30vw] py-[1.67vh] flex-col items-center  mx-auto  mt-[8.92vh]  md:mt-0 border-[#009FBD80]   ${
            expandedComponent === "sell"
              ? "w-[65%] h-full border-[5px]"
              : "w-[35%] h-[95%] border-[3.5px] "
          }`}
          onClick={() => handleExpand("sell")}
        >
          <div className="flex flex-col items-center">
            <h1
              className={`text-[#585858] ${
                expandedComponent === "buy" ? "text-xs" : "text-base"
              } tracking-[5.6px] font-bold mb-[0.65vh] `}
            >
              TOKENIZATION
            </h1>
            <div className="head-border">
              <h2
                className={`exchange-head ${
                  expandedComponent === "buy" ? "text-base" : "text-[1.25rem] "
                }`}
              >
                SELL
              </h2>
            </div>
            <Sell expandedComponent={expandedComponent} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Tokenization;
