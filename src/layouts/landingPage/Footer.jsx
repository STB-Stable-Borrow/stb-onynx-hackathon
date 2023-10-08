import React, { useState } from "react";
import twitter from "../../assets/landing/twitter.svg";
import telegram from "../../assets/landing/telegram.svg";
import discord from "../../assets/landing/discord.svg";
import chat from "../../assets/landing/chat.svg";
import phone from "../../assets/landing/phone.svg";

function Footer() {
  const [copied, setCopied] = useState(false);

  function copyToClipboard() {
    document.getElementById("+1 (202) 555 0156");
    setCopied(true);
  }
  return (
    <div className="flex w-full flex-col-reverse  gap-[1.67vh] justify-between items-center  mt-auto text-[0.5rem] md:text-xs md:flex-row md:gap-0 ">
      <div className="flex justify-between gap-[1.09vw] ">
        <div className="gap-[0.68vw] hidden md:flex">
          <img src={twitter} alt="twitter" className="w-[0.8125rem] " />
          <img src={telegram} alt="telegram" className="w-[0.8125rem]" />
          <img src={discord} alt="discord" className="w-[0.8125rem]" />
        </div>
        <p className="text-[#FFFFFF]">
          Copyright © Stable Borrow 2023 | All Rights Reserved
        </p>
      </div>
      <div className="flex text-[#FFFFFF] items-center gap-[1.56vw] justify-between  w-full md:w-auto ">
        <div className="gap-[0.68vw] flex  md:hidden">
          <img src={twitter} alt="twitter" className="w-[0.8125rem] " />
          <img src={telegram} alt="telegram" className="w-[0.8125rem]" />
          <img src={discord} alt="discord" className="w-[0.8125rem]" />
        </div>
        <div className="flex gap-[1.56vw] items-center">
          <div className="flex gap-[0.47vw] items-center">
            <img src={phone} alt="phone" className="w-[0.8125rem]" />
            <p className="cursor-pointer" onClick={copyToClipboard}>
              +234 (815) 433 5363
            </p>
          </div>
          <div className="flex gap-[0.47vw] items-center">
            <img src={chat} alt="chat" className="w-[0.8125rem]" />
            <p>stableborrow.org@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
