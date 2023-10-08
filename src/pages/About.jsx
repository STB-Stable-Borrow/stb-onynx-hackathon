import React, { useState } from "react";
import LandingBody from "../layouts";
import { toggleAbout } from "../data/toggleAboutContent";
import { useAbout } from "../context/aboutContext";

function About() {
  const abouts = useAbout();
  const { about, handleAboutToggle } = abouts;

  return (
    <>
      <div className="md:block hidden">
        <LandingBody>
          <div className="self-center full w-full h-[75.6vh] mt-[8.6vh] border-[#009FBD50] border-[3px] rounded-lg mx-[9.66vw] px-[1.25vw] py-[2.22vh] ">
            <div className="md:flex justify-between w-full h-[70px] bg-[#01303870] rounded-lg px-[29px] py-4  ">
              {toggleAbout.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleAboutToggle(item.name)}
                  className={`text-[#FFFFFF] px-4 rounded-lg text-sm font-bold ${
                    item.name === about
                      ? "bg-[#009FBD]"
                      : " border-[#009FBD] border-2"
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-2 mt-2  mx-6  text-[#FFFFFF] pr-4 h-[58vh] overflow-y-scroll ">
              {toggleAbout.map(
                (item, index) =>
                  item.name === about && (
                    <div key={index} className="">
                      {item.content.map((content, _index) => {
                        return (
                          <p
                            key={_index}
                            className="text-justify text-base mb-4"
                          >
                            {content}
                          </p>
                        );
                      })}
                    </div>
                  )
              )}
            </div>
          </div>
        </LandingBody>
      </div>
      {/* mobile */}
      <div className="md:hidden">
        <LandingBody>
          <div className="self-center full w-full h-[75.6vh] mt-[8.6vh] border-[#009FBD50] border-[3px] rounded-lg mx-[9.66vw] px-[1.25vw] py-[2.22vh] ">
            <div className="md:hidden">
              <select className="bg-[#009FBD] w-full rounded-[0.625rem] text-white h-[5.80vh] px-[4.35vw] ">
                {toggleAbout.map((item, index) => (
                  <option
                    key={index}
                    value={item.name}
                    className="bg-opacity-70 bg-inherit text-sm "
                    onChange={(e) => handleAboutToggle(e.target.value)}
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2 mt-2  mx-6  text-[#FFFFFF] pr-4 h-[58vh] overflow-y-scroll ">
              {toggleAbout.map(
                (item, index) =>
                  item.name === about && (
                    <div key={index} className="">
                      {item.content.map((content, _index) => {
                        return (
                          <p
                            key={_index}
                            className="text-justify text-base mb-4"
                          >
                            {content}
                          </p>
                        );
                      })}
                    </div>
                  )
              )}
            </div>
          </div>
        </LandingBody>
      </div>
    </>
  );
}

export default About;
