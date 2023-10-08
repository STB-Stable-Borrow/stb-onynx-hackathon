import React from "react";
import success from "../../../assets/dashboard/success.svg";

function TokenizationSuccessModal({ _setConfirmationRes }) {
  return (
    <div
      onLoad={() => {
        setTimeout(() => {
          _setConfirmationRes(null);
        }, 500000);
      }}
      className="bg-[#202225] w-full rounded-[30px] flex flex-col items-center font-semibold pt-[5vh] md:pt-[14.746vh] pb-[10.156vh] mx-auto "
    >
      <img
        src={success}
        alt=""
        className="md:w-[151px] md:h-[14.746vh]  w-[8.125rem] h-[8.125rem] mb-[4.39vh] "
      />
      <h1 className="text-[#009FBD] mb-[5.1758vh] ">
        Your Transaction was Successful!
      </h1>
      <p className="text-center text-blue-500 md:w-[433px]  mx-[7.24vw] md:mx-0 text-xs md:text-base">
        <span className="text-[#009FBD]">Note: </span> You will be redirected to
        Exchange in five(5) seconds, don’t cancel or refresh this page.
      </p>
    </div>
  );
}

export default TokenizationSuccessModal;
