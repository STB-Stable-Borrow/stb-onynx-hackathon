import React from "react";
import SuccessModal from "./SuccessModal";
import FailedModal from "./FailedModal";

function ExchangeConfirmations() {
  return (
    <div className="w-full h-full">
      <h1 className="w-full bg-[#202225] text-[#B0B0B0] font-bold text-[1.125rem] border-[#585858] border-dashed border rounded-[7px] py-[0.5vh] mb-[1.56vh] flex items-center  justify-center ">
        Exchange
      </h1>
      <SuccessModal />
      {/* <FailedModal /> */}
    </div>
  );
}

export default ExchangeConfirmations;
