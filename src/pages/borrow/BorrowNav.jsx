import React from "react";
import vaultmgt from "../../assets/borrow/vaultmgt.svg";
import generate from "../../assets/borrow/generate.svg";
import confirmations from "../../assets/borrow/confirmations.svg";
import { useBorrow } from "../../contexts/borrowContext/borrowContext";

function BorrowNav() {
  const { vault, generateSTC, confirm } = useBorrow();
  return (
    <div className="text-white h-[4.83vh] px-[2rem] bg-[#202225]  flex items-center  justify-between w-full rounded-[15px] md:w-auto md:h-[7.47vh]  md:px-[33px] ">
      <div className="flex items-center gap-2  font-semibold mr-2 md:mr-0 ">
        <img
          src={vaultmgt}
          alt=""
          className={`w-[20px]  ${vault ? "" : "opacity-75"} `}
        />
        <p
          className={`hidden md:block
            ${vault ? "text-white" : "text-[#8B8E94]"}
        `}
        >
          Vault Management
        </p>
      </div>
      <div
        className={`w-[135px] h-[2px]  ${
          generateSTC ? "bg-white" : "bg-[#8B8E94]"
        }`}
      ></div>
      <div className="flex items-center gap-2 justify-between mx-2 md:mx-0 ">
        <img
          src={generate}
          alt=""
          className={`w-[20px]  ${generateSTC ? "" : "opacity-75"} `}
        />
        <p
          className={` hidden md:block ${
            generateSTC ? "text-white" : "text-[#8B8E94]"
          }`}
        >
          Generate STC
        </p>
      </div>
      <div
        className={` ${
          confirm ? "bg-white" : "bg-[#8B8E94]"
        } w-[132px] h-[2px] `}
      ></div>
      <div className="flex items-center gap-2 justify-between ml-2 md:ml-0 ">
        <img
          src={confirmations}
          alt=""
          className={`w-[20px]  ${confirm ? "" : "opacity-75"} `}
        />
        <p
          className={`hidden md:block ${
            confirm ? "text-white" : "text-[#8B8E94]"
          }`}
        >
          Confirmations
        </p>
      </div>
    </div>
  );
}

export default BorrowNav;
