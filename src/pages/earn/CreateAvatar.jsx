import React, { useEffect, useRef, useState, useContext } from "react";
import back from "../../assets/borrow/back.svg";

function CreateAvatar({
  onBackButtonClick,
  _setAvatartImage,
  _setLoading,
  _setAvatar,
  _avatar,
  _adr,
}) {
  const domainName = "stb";
  const iFrameRef = useRef(null);

  function subscribe(event) {
    const json = parse(event);
    if (json?.source !== "readyplayerme") {
      return;
    }
    // Subscribe to all events when frame is ready
    if (json.eventName === "v1.frame.ready") {
      let iFrame = iFrameRef.current;
      if (iFrame && iFrame.contentWindow) {
        iFrame.contentWindow.postMessage(
          JSON.stringify({
            target: "readyplayerme",
            type: "subscribe",
            eventName: "v1.**",
          }),
          "*"
        );
      }
    }
    // Get avatar GLB URL
    if (json.eventName === "v1.avatar.exported") {
      _setAvatartImage(null);
      _setAvatar(json.data.url);
      _setLoading(true);
      onBackButtonClick();
    }
    // Get user id
    if (json.eventName === "v1.user.set") {
      console.log(`User with id ${json.data.id} set: ${JSON.stringify(json)}`);
    }
  }

  function parse(event) {
    try {
      return JSON.parse(event.data);
    } catch (error) {
      return null;
    }
  }

  useEffect(() => {
    let iFrame = iFrameRef.current;
    if (iFrame) {
      iFrame.src = `https://${domainName}.readyplayer.me/avatar?frameApi`;
    }
  },[]);

  useEffect(() => {
    window.addEventListener("message", subscribe);
    document.addEventListener("message", subscribe);
    return () => {
      window.removeEventListener("message", subscribe);
      document.removeEventListener("message", subscribe);
    };
  },[]);

  return (
    <div className="md:mx-[167px] mx-[1.25rem] pb-[29.75rem] md:pb-0 ">
      <div className="h-[5.19rem] md:h-[10vh] bg-gradient-to-b from-[#3A3B3D] to-[#202225] py-[.5vh] text-center rounded-[15px] mb-[1vh] ">
        <h1 className="font-black md:text-xl text-base text-[#009FBD] ">
          Welcome to STB Avatar Hub!
        </h1>
        <p className="text-[#B0B0B0] md:text-sm text-xs ">
          Customize your Avatar and click Next to Proceed.
        </p>
      </div>
      <div className="flex justify-between mb-[1.5vh] flex-col md:flex-row gap-[1.81rem]">
        <button
          className="border text-white border-[#009FBD] md:w-[164px] w-[10rem] h-[2.19rem] md:h-[5.95vh] rounded-lg flex items-center justify-center gap-2 bg-inherit hover:opacity-75 "
          onClick={onBackButtonClick}
        >
          <img src={back} alt="" />
          Back
        </button>
        <div className="md:h-[5.95vh] h-[1.88rem] rounded-lg bg-[#202225] w-full md:w-[664px] text-[#B0B0B0] flex items-center pl-[18px] md:text-sm text-xs ">
          Connected Wallet: {_adr} || Avatar Link: {_avatar}
        </div>
      </div>
      <div className="w-full h-[68vh] bg-[#202225] rounded-[15px]">
        <iframe
          allow="camera *; microphone *"
          className="iFrame"
          id="frame"
          ref={iFrameRef}
          style={{
            display: "block",
            border: "none",
            width: "100%",
            height: "inherit",
          }}
          title={"STB AVATAR HUB"}
        />
      </div>
    </div>
  );
}

export default CreateAvatar;
