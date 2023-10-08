import React, { useState } from "react";
import copy from "../../assets/dashboard/copy.svg";
import profile from "../../assets/dashboard/profile.svg";
import notif from "../../assets/dashboard/notif.svg";

function Navbar({ _account, _address, _profile }) {
  const handleCopy = () => {
    const textToCopy = _account;
    navigator.clipboard.writeText(textToCopy);
    alert("Address copied to clipboard");
  };

  return (
    <div className="flex items-center justify-between w-full ">
      <h1 className="font-semibold text-[1.43rem] ">Welcome!</h1>
      <div className="flex gap-[10px] items-center ">
        <div className="text-end">
          {_profile && <h1 className="font-semibold">{_profile.username}</h1>}
          {!_profile && <h1 className="font-semibold">username</h1>}
          <p
            className="flex items-center gap-[7px] hover:underline hover:text-white/75 cursor-pointer "
            onClick={handleCopy}
          >
            <img src={copy} alt="" /> {_account}
          </p>
        </div>
        <div className="relative">
          {_profile && (
            <img
              src={_profile.imgUrl}
              alt=""
              className="w-[5.20vw] h-[5.2vw] rounded-full border-[1.5px] border-[#009FBD] border-dashed "
            />
          )}
          {!_profile && (
            <img
              src={profile}
              alt="profile"
              className="w-[5.2vw] h-[5.2vw] rounded-full border-[1.5px] border-dashed border-[#009FBD]"
            />
          )}
          <div className="absolute top-0 right-0 w-[25px] h-[25px] rounded-full bg-[#009FBD]">
            <img src={notif} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
