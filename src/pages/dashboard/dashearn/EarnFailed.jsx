import React from "react";
import handLeft from "../../../assets/dashboard/hand-left.svg";
import handRight from "../../../assets/dashboard/hand-right.svg";
import oops from "../../../assets/dashboard/oops.svg";

function EarnFailed() {
  return (
    <div className="w-full h-full pb-[100%] md:h-[64.91vh] flex items-center justify-center bg-[#202225] rounded-[15px] md:px-0 px-[4.83vw] ">
      <div className="bg-[#292C31] rounded-[12px] w-full md:w-[38.28vw] flex flex-col items-center justify-center pb-[7.22vh]  md:px-[3.19vw] px-[8.21vw] mt-8 pt-[2vh] ">
        <div className="flex justify-between items-center w-full">
          <img src={handLeft} alt="" className="md:w-[9.48vw] w-[5.39rem] " />
          <img src={handRight} alt="" className="md:w-[9.48vw] w-[5.39rem]  " />
        </div>
        <img
          src={oops}
          alt=""
          className="md:w-[7.86vw] w-[8.12rem] mt-[5vh]  md:mt-[-7vh] "
        />
        <h1 className="text-[#FF1F1F]  font-semibold mb-[3.52vh] text-2xl ">
          Ooppss!
        </h1>
        <p className="text-center text-[#009fbd]  font-semibold text-sm ">
          Unable to Liquidate Vault-01 now!
          <br />
          Better luck next time!
        </p>
      </div>
    </div>
  );
}

export default EarnFailed;
