import React, { useState } from "react";
import collapse from "../../../assets/mobile/collapse.svg";
import expand from "../../../assets/mobile/expand.svg";
import xdc from "../../../assets/dashboard/xdc-w.png";
import stc from "../../../assets/dashboard/stc-w.svg";

function MobileTokenization({ data }) {
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="flex w-full items-center flex-col gap-4 text-[#B0B0B0] font-semibold text-xs bg-[#292C31] rounded-[0.625rem] py-[1.11vh]  px-[3.38vw]">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1 w-[38.46vw] ">
          <p>#{data.id}</p>
          <div className="flex items-center">
            <img
              src={xdc}
              alt=""
              className="md:w-[1.875rem]  w-[1.275rem] h-[1.275rem] "
            />
            <img
              src={stc}
              alt=""
              className="md:w-[1.875rem]  w-[1.275rem] h-[1.275rem] "
            />
          </div>
          <h2 className=" ">
            {data.token1}/{data.token2}
          </h2>
        </div>
        <div className="flex items-center gap-4 w-[35.46vw]  ">
          <h2 className=" ">Debt: ${data.debt}</h2>
          <img
            src={expanded ? collapse : expand}
            alt=""
            onClick={handleExpand}
          />
        </div>
      </div>
      {expanded && (
        <div className="flex items-center justify-between w-full">
          <h2 className="w-[38.46vw] ">Max Sales: ${data.maxSales}</h2>
          <h2 className=" w-[35.46vw] ">Sales: ${data.sales}</h2>
        </div>
      )}
    </div>
  );
}

export default MobileTokenization;
