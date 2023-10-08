import React from "react";
import failed from "../../../assets/dashboard/failed.svg";

function TokenizationFailedModal({ _setConfirmationRes }) {
  return (
    <div
      onLoad={() => {
        setTimeout(() => {
          _setConfirmationRes(null);
        }, 5000);
      }}
      className="bg-[#202225] w-full rounded-[30px] flex flex-col items-center font-semibold pt-[5vh] md:pt-[14.746vh] pb-[10.156vh] mx-auto "
    >
      <img
        src={failed}
        alt=""
        className="md:w-[151px] md:h-[14.746vh]  w-[8.125rem] h-[8.125rem] mb-[4.39vh] "
      />
      <h1 className="text-[#FF1F1F] mb-[5.1758vh] ">Transaction Failed!</h1>
      <p className="text-center text-white md:w-[433px] mx-[7.24vw] md:mx-0 text-xs md:text-base">
        <span className="text-[#FF1F1F] ">Note: </span>You will be redirected to
        the previous page in five(5) seconds, don’t cancel or refresh this page.
      </p>
    </div>
  );
}

export default TokenizationFailedModal;
