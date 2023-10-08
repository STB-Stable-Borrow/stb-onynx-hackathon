import React, { useState } from "react";
import profile from "../../../assets/dashboard/profileImg.svg";
import save from "../../../assets/dashboard/save.svg";
import arrowLeft from "../../../assets/dashboard/arrowLeft.svg";

function EditProfile({ onBackClick, prof, xdcBalance, stcBlnc, xdcPrc }) {
  const [data, setData] = useState({
    username: "",
    about: "",
  });

  return (
    <div className="h-full">
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-full bg-[#202225]  text-[#B0B0B0] font-bold text-[1.125rem] border-[#585858] border-dashed border rounded-[7px] h-[4.5989vh] mb-[1.53vh] flex justify-between items-center gap-[31px] pl-[2.86vw] pr-[33.93vw] ">
          <button
            className="flex items-center gap-2 text-[#009FBD] text-sm "
            onClick={onBackClick}
          >
            <img src={arrowLeft} alt="" />
            Back
          </button>
          <h1 className="">Settings</h1>
        </div>
        <div className="bg-[#202225] w-full md:w-auto px-[4.5vw] md:pt-0 pt-[3.79vh] md:pb-0 pb-[5.91vh] h-full md:py-[1.5vh] rounded-[1.875rem] ">
          {prof && (
            <div className="flex flex-col md:flex-row items-center gap-[23px] mb-[2.35vh] ">
              <h1 className="text-[#B0B0B0] font-semibold text-[1rem]  mb-[1.39vh] text-center md:hidden ">
                @{prof.username}
              </h1>
              <img
                src={prof.imgUrl}
                alt=""
                className="md:h-[8.96vw] md:w-[8.96vw] w-[13.5rem] rounded-[100%] border border-[#585858] border-dashed"
              />
              <div className="w-full md:w-auto">
                <h1 className="text-[#B0B0B0] font-semibold text-[1rem]  mb-[1.39vh] hidden md:block ">
                  {prof.username}
                </h1>
                <div className="border-dashed border  border-[rgb(88,88,88)] px-[1.15vw] py-[1.20vh] rounded-[20px] flex items-center justify-between  gap-[4.47vw] mb-[1.85vh] w-full md:w-auto">
                  <div className="flex items-center flex-col">
                    {stcBlnc && (
                      <h1 className="text-[#009FBD] font-semibold text-[1.25em] ">
                        {stcBlnc} STC
                      </h1>
                    )}
                    {stcBlnc && (
                      <p className="text-[1em] mt-[-0.74vh] text-[#B0B0B0] text-center ">
                        ~ ${stcBlnc}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center flex-col">
                    {xdcBalance && (
                      <h1 className="text-[#009FBD] font-semibold text-[1.25em] ">
                        {xdcBalance} XDC
                      </h1>
                    )}
                    {xdcBalance && (
                      <p className="text-[1em] mt-[-0.74vh] text-[#B0B0B0] text-center  ">
                        ~ ${(xdcPrc * xdcBalance).toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {!prof && (
            <div className="flex flex-col md:flex-row items-center gap-[23px] mb-[2.35vh]">
              <h1 className="text-[#B0B0B0] font-semibold text-[1rem]  mb-[1.39vh] text-center md:hidden ">
                @username
              </h1>
              <img
                src={profile}
                alt=""
                className="md:h-[8.96vw] md:w-[8.96vw] w-[13.5rem] rounded-[100%] border border-[#585858] border-dashed"
              />
              <div>
                <h1 className="text-[#B0B0B0] font-semibold text-[1rem]  mb-[1.39vh] hidden md:block ">
                  @username
                </h1>
                <div className="border-dashed border  border-[#585858] px-[1.15vw] py-[1.20vh] rounded-[20px] flex items-center justify-between  gap-[4.47vw] mb-[1.85vh] ">
                  <div className="flex items-center flex-col">
                    {stcBlnc && (
                      <h1 className="text-[#009FBD] font-semibold text-[1.25em] ">
                        0 STC
                      </h1>
                    )}
                    {stcBlnc && (
                      <p className="text-[1em] mt-[-0.74vh] text-[#B0B0B0] text-center ">
                        ~ $0.0000
                      </p>
                    )}
                  </div>
                  <div className="flex items-center flex-col">
                    {xdcBalance && (
                      <h1 className="text-[#009FBD] font-semibold text-[1.25em] ">
                        0 XDC
                      </h1>
                    )}
                    {xdcBalance && (
                      <p className="text-[1em] mt-[-0.74vh] text-[#B0B0B0] text-center  ">
                        ~ $0.0000
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <form
            action=""
            className="flex flex-col gap-[4.35vh] md:w-[23.50vw] text-[1rem] w-full"
          >
            <div className="flex flex-col gap-[1.57vh] ">
              <label htmlFor="" className=" font-semibold text-[#009FBD]  ">
                Edit Username
              </label>
              <input
                type="text"
                className="bg-[#B0B0B0] py-[1.30vh] pl-[21px] rounded-lg text-[#292C31] "
              />
            </div>
            <div className="flex flex-col gap-[1.57vh] ">
              <label htmlFor="" className=" font-semibold text-[#009FBD]  ">
                Edit About
              </label>
              <textarea
                type="text"
                className="bg-[#B0B0B0] py-[1.30vh] pl-[21px] rounded-lg h-[10.65vh] text-[#292C31] text-[0.85em] "
              ></textarea>
            </div>
            <button className="text-white w-full md:w-max flex items-center justify-center gap-2 py-[1.11vh] px-[2.29vw] bg-[#009FBD] rounded-lg hover:bg-opacity-75 text-sm ">
              <h1> Save Changes</h1>
              <img
                src={save}
                alt=""
                className="md:w-[1.25vw] w-[1.125rem] md:h-[2.22vh]"
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
