import React from "react";
import success from "../../assets/borrow/success.svg";

function SuccessConfirm({ _redirect }) {
  return (
    <div
      onLoad={_redirect}
      className="bg-[#292C31] rounded-[12px] flex flex-col items-center gap-[4vh] w-[82.37vw] md:w-[500px] md:py-[10vh] md:px-[50px] px-[5.80vw] my-[1.875rem] py-[2vh] text-sm md:text-base"
    >
      <img src={success} alt="" className="w-[50px]" />
      <p className="text-[#009fbd] text-center ">
        Your Vault and requested STC are being Generated!
      </p>
      <p className="text-center">
        <span className="text-[#009FBD]">Note:</span> You will be redirected to
        your Vault Dashboard after creation, don’t cancel or refresh this page.
      </p>
    </div>
  );
}

export default SuccessConfirm;
