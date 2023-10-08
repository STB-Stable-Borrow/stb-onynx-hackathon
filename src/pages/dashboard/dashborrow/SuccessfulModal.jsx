import React from "react";
import success from "../../../assets/dashboard/success.svg";

function SuccessfulModal({
  vaultId,
  depositRes,
  onVaultClick,
  withdrawRes,
  paybackRes,
}) {
  return (
    <div
      onLoad={() => {
        if (
          depositRes === true ||
          withdrawRes === true ||
          paybackRes === true
        ) {
          setTimeout(() => {
            onVaultClick(vaultId);
          }, 50000);
        }
      }}
      className="bg-[#202225] w-full md:w-[39.58vw] rounded-[30px] flex flex-col items-center font-semibold pt-[14.746vh] pb-[10.156vh] mx-auto "
    >
      <img
        src={success}
        alt=""
        className="md:w-[151px] w-[8.125rem] md:h-[14.746vh] mb-[4.39vh] "
      />
      <h1 className="text-[#009FBD] mb-[5.1758vh] ">
        Your Transaction was Successful!
      </h1>
      <p className="text-center md:px-0 px-[7.24vw] text-white text-xs md:text-base w-full md:w-[433px]">
        <span className="text-[#009FBD] ">Note: </span> You will be redirected
        to your Vault Dashboard in five(5) seconds, don’t cancel or refresh this
        page.
      </p>
    </div>
  );
}

export default SuccessfulModal;
