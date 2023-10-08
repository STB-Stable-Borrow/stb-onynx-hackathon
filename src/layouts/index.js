import React from "react";
import bgImage from "../assets/landing/bg.png";
import Header from "./landingPage/Header";
import { useLocation } from "react-router-dom";

function LandingBody({ children, _handleConnectWallet }) {
  const location = useLocation();
  return (
    <div className="relative min-h-screen">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgImage})` }}
      ></div>
      <div className="relative flex flex-col  h-[100vh] py-[3.43vh] px-[4.17vw] ">
        <Header _handleConnectWallet_={_handleConnectWallet} />
        {children}
      </div>
    </div>
  );
}

export default LandingBody;
