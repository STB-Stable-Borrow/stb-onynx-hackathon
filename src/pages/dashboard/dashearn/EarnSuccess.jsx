import React from "react";
import clapLeft from "../../../assets/dashboard/clap-left.svg";
import clapRight from "../../../assets/dashboard/clap-right.svg";
import medal from "../../../assets/dashboard/medal.svg";

function EarnSuccess() {
  return (
    <div className="w-full h-full pb-[100%] md:h-[64.91vh] flex items-center justify-center bg-[#202225] rounded-[15px] md:px-0 px-[4.83vw]">
      <div className="bg-[#292C31] rounded-[12px] w-full md:w-[38.28vw] flex flex-col items-center justify-center pb-[7.22vh]  md:px-[3.19vw] px-[8.21vw] mt-8 pt-[2vh] ">
        <div className="flex justify-between items-center w-full">
          <img src={clapLeft} alt="" className="md:w-[9.48vw] w-[5.39rem] " />
          <img src={clapRight} alt="" className="md:w-[9.48vw] w-[5.39rem]" />
        </div>
        <img
          src={medal}
          alt=""
          className="md:w-[7.86vw] w-[8.12rem] mt-[5vh]  md:mt-[-7vh] "
        />
        <h1 className="text-[#009FBD]  font-semibold mb-[3.52vh] text-2xl ">
          Congratulations!
        </h1>
        <p className="text-center text-[#009fbd]  font-semibold text-sm ">
          Vault-01 has been Haunted successfully! <br />
          Your Payout is 100 XDC
        </p>
      </div>
    </div>
  );
}

export default EarnSuccess;
