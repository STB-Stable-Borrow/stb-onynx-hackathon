import React from "react";
import error from "../../assets/borrow/error.svg";

function ErrorConfirm({ _redirect }) {
  return (
    <div
      onLoad={_redirect}
      className="bg-[#292C31] rounded-[12px] flex flex-col items-center gap-[4vh] w-[82.37vw] md:w-[500px] md:py-[10vh] my-[1.875rem] py-[2vh] md:px-[50px] px-[5.80vw] text-sm md:text-base"
    >
      <img src={error} alt="" className="w-[50px]" />
      <p className="text-[#E32424] text-center ">
        Oops! Error while generating vault and requested STC!
      </p>
      <p className="text-center">
        <span className="text-[#E32424] ">Note:</span> Inputed XDC as deposit in
        previous steps was not removed from your wallet, make sure you have
        enough XDC to cover both gas fee and deposit and try again.
      </p>
    </div>
  );
}

export default ErrorConfirm;
