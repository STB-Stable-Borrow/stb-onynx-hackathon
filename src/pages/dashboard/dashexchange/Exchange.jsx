import React, { useEffect, useState } from "react";

import { useDashboard } from "../../../contexts/dashboardContext";
import ExchangeIndex from "./ExchangeIndex";

function Exchange({
  _account,
  _handleLoading,
  _web3,
  _stbSwap,
  _stc,
  _stb,
  _colRatio,
  _xdcBln,
  _stcBln,
  _xdcPrc,
}) {
  const { active, activeTab } = useDashboard();

  useEffect(() => {
    if (active === 1) {
      activeTab(5);
    }
  }, [active]);

  return (
    <>
      <h1 className="font-bold md:hidden text-[#B0B0B0] text-xl mb-[5.91vh] pl-4 ">
        Welcome!
      </h1>
      <p className="text-[#D9D9D9] text-[0.625rem] py-[1.85vh] px-[1.41vw] bg-[#191B1D] border-[1.5px] border-dashed border-[#585858] rounded-[0.9375rem] mb-[2.31vh] hidden md:block ">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti, modi
        nostrum excepturi, veniam molestiae sed alias rem, ut sint doloremque
        vero unde saepe adipisci iure quam dolore fuga facere aspernatur!
      </p>
      <div className="flex items-center gap-[8.92vh]  md:gap-[2.60vw]  w-full h-auto flex-col md:flex-row px-[4.83vw] md:px-0 md:pb-0 pb-[15.62vh]  ">
        <ExchangeIndex
          account={_account}
          handleLoading={_handleLoading}
          web3={_web3}
          stbSwap={_stbSwap}
          stc={_stc}
          stb={_stb}
          xdcBlnc={_xdcBln}
          stcBlnc={_stcBln}
          xdcPrc={_xdcPrc}
        />
      </div>
    </>
  );
}

export default Exchange;
