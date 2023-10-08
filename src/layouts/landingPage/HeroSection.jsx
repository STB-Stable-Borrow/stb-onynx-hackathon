import React from "react";
import heroImage from "../../assets/landing/Hero_Image.svg";
import next from "../../assets/landing/next.svg";
import { Link } from "react-router-dom";

function HeroSection({ _handleConnectWallet }) {
  return (
    <div className="flex justify-between w-full items-center mt-[10.15vh] flex-col-reverse gap-[3.98vh] md:gap-0 md:flex-row  ">
      <div className="">
        <h1 className="w-full text-[#FFFFFF] text-[1.5rem] font-black text-center leading-tight md:text-start  md:text-[2.5rem]  md:w-[40vw] mb-[10vh] md:mb-0 ">
          Borrow STC, Earn as you Play and Exchange Tokens with Ease!
        </h1>
        <div className="mt-[1.30vh] mb-[4.07vh] ">
          <p className="text-sm text-[#FFFFFF]  leading-tight w-full text-justify md:text-start md:text-[0.875rem] md:w-[35.05vw]  ">
            Stable Borrow (STB), a Web3 Platform where users can Borrow $STC,
            Earn and Exchange Tokens at-a-go using our Simple and Swift UI with
            Unique Protocols embedded in our Smart Contracts!...{" "}
            <span className="text-[#865DFF] font-bold underline underline-offset-4">
              <Link to="/about">Learn more</Link>
            </span>
          </p>
        </div>
        <div className="flex justify-center items-center md:block">
          <Link>
            <button
              className={`py-[1.29vh] w-[41.78vw] md:w-auto flex items-center justify-center px-[2.08vw] text-sm text-[#FFFFFF] bg-[#009FBD]  rounded-lg hover:opacity-75 md:py-[1.57vh] md:px-[3.02vw] md:text-base `}
              onClick={_handleConnectWallet}
            >
              <div className="flex gap-2 items-center">
                <p>Get started</p>
                <img src={next} alt="next icon" className="w-[0.8125rem] " />
              </div>
            </button>
          </Link>
        </div>
      </div>
      <img
        src={heroImage}
        alt="stb vector"
        className="w-[10.87rem] h-[10rem] md:w-[35.12vw] md:h-[60.87vh] hidden md:block "
      />
    </div>
  );
}

export default HeroSection;
