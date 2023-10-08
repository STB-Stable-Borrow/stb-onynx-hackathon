import React, { useContext, useEffect } from "react";
import borrow from "../assets/info/Borrow.svg";
import exchange from "../assets/info/Exchange.svg";
import earn from "../assets/info/Earn.svg";
import { Link, useNavigate } from "react-router-dom";
import LandingBody from "../layouts";
import { useAbout } from "../context/aboutContext";
import { Web3ModalContext } from "../contexts/web3ModalContext";
import { isRegistered } from "../lib/sbtContract";
import { getAllUserVaults } from "../lib/stbContract";
import borrowbgone from "../assets/info/borrowbgone.svg";
import borrowbgtwo from "../assets/info/borrowbgtwo.svg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDashboard } from "../contexts/dashboardContext";
import Header from "../layouts/landingPage/Header";

function Info() {
  const { stbSwap, sbt, account, stb, connected, chainId } =
    useContext(Web3ModalContext);
  const { navigateToAbout } = useAbout();
  const navigate = useNavigate();
  const {
    setShowEarn,
    setShowDashBorrow,
    setShowExchange,
    setShowHome,
    activeTab,
  } = useDashboard();

  // verify connection status and chainId
  const verifyConnection = () => {
    const acceptIds = [50, 51];
    if (!connected && !chainId) {
      toast.error("You have to connect your wallet to proceed");
      navigate("/");
    }
    if (connected && !acceptIds.includes(chainId)) {
      toast.error(
        "You connected to wrong chain, disconnect and connect to Apothem or Xinfin."
      );
      navigate("/");
    }
  };

  //handles borrow's onclick event
  const handleBorrow = async () => {
    await getAllUserVaults(stb, account).then((res) => {
      if (res.length < 1) {
        navigate("/borrow");
      } else {
        navigate("/dashboard");
        setShowDashBorrow(true);
        setShowHome(false);
        activeTab(2);
      }
    });
  };

  //handles earn's onclick event
  const handleEarn = async () => {
    await isRegistered(sbt, account).then((res) => {
      if (res) {
        navigate("/dashboard");
        setShowEarn(true);
        setShowHome(false);
        activeTab(3);
      } else {
        navigate("/register");
      }
    });
  };
  const handleExchange = () => {
    navigate("/dashboard");
    setShowExchange(true);
    setShowHome(false);
    activeTab(5);
  };

  return (
    <>
      <div className="hidden md:block">
        <LandingBody>
          <div
            style={{ font: "TT Firs Neue Trl", fontFamily: "TT Firs Neue Trl" }}
            className="md:mx-[60px] md:mt-[4.44vh] flex flex-col  gap-[5.52vw] text-white  md:min-h-[calc(100vh-180px)] md:overflow-hidden md:flex-row bg-black "
          >
            <div className="flex-col flex justify-between gap-[1.5vh]  h-full w-full ">
              <div className="border-[3px] border-[#009FBD]  rounded-[30px]  w-full h-full relative bg-gradient-to-r from-[#009FBD]  to-[#865DFF] ">
                <div className="flex flex-col items-center gap-[5px] bg-black/80 w-full h-full rounded-[30px] px-[6px] py-2 ">
                  <img
                    src={borrow}
                    alt=""
                    className="w-[9.32vw] h-[11.20vh] "
                  />
                  <h1 className="font-black border-b-2 border-[#009FBD] text-lg ">
                    Borrow $STC
                  </h1>
                  <p className="text-center mx-4 mt-2 text-[#FFFFFF] text-sm ">
                    <span className=" font-bold text-white">
                      {" "}
                      Stable Coin ($STC){" "}
                    </span>{" "}
                    is Stable Borrow (STB) Official Token, it’s a fully
                    Decentralized and collateral backed token that’s maintains
                    1usd as it’s price making it a Stable Token ...{" "}
                    <Link
                      to="/about"
                      className="text-[#865DFF] underline underline-offset-2 hover:underline cursor-pointer "
                      onClick={() => navigateToAbout("Borrow")}
                    >
                      learn more
                    </Link>
                  </p>
                  <button
                    className="bg-[#009FBD] hover:bg-opacity-75 rounded-lg text-xs px-[20px] py-2 mt-2 w-[8.8vw]"
                    onClick={() => handleBorrow()}
                  >
                    Borrow now
                  </button>
                </div>
                <div
                  className=" w-[6.46vw] h-[10.46vh] absolute top-0 left-0"
                  style={{
                    backgroundImage: `url(${borrowbgone})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div
                  className=" w-[6.46vw] h-[10.46vh] absolute top-0 right-0"
                  style={{
                    backgroundImage: `url(${borrowbgtwo})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              </div>
              <div className="bg-gradient-to-r from-[#009FBD]  to-[#865DFF]  border-[3px] border-[#009FBD]  rounded-[30px] w-full h-full relative ">
                <div className="flex flex-col items-center gap-[5px] bg-black/80 w-full h-full rounded-[30px] px-[6px] py-2 ">
                  <img src={earn} alt="" className="w-[9.32vw] h-[11.20vh] " />
                  <h1 className="font-black border-b-2 border-[#009FBD] text-lg ">
                    Earn $STC
                  </h1>
                  <p className="text-center mx-4 mt-2 text-[#FFFFFF] text-sm ">
                    Register as an haunter today to earn as you play by haunting
                    vaults in liquidation and regulating prices. Earn various
                    tokens that can be exchanged to any token via exchange UI
                    ...
                    <Link
                      to="/about"
                      className="text-[#865DFF] underline underline-offset-2 hover:underline cursor-pointer "
                      onClick={() => navigateToAbout("Earn")}
                    >
                      learn more
                    </Link>
                  </p>
                  <button
                    className="bg-[#009FBD] hover:bg-opacity-75 rounded-lg text-xs px-[20px] py-2 mt-2 w-[8.8vw]"
                    onClick={() => handleEarn()}
                  >
                    Earn now
                  </button>
                </div>

                <div
                  className=" w-[6.46vw] h-[10.46vh] absolute top-0 left-0"
                  style={{
                    backgroundImage: `url(${borrowbgone})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div
                  className=" w-[6.46vw] h-[10.46vh] absolute top-0 right-0"
                  style={{
                    backgroundImage: `url(${borrowbgtwo})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              </div>
            </div>
            <div
              // onLoad={verifyConnection}
              className="bg-gradient-to-r from-[#013038] to-[#013139]  border-[3px] border-[#009FBD] h-full w-full rounded-[30px] relative"
            >
              <div className="flex flex-col items-center gap-[5px] bg-black/30 w-full h-full rounded-[30px] px-[6px] py-2 ">
                <img src={exchange} alt="" className="w-[80px] " />
                <h1 className="font-black border-b-2 border-[#009FBD] text-lg">
                  Exchange
                </h1>

                <p className="text-center mx-4 mt-2 text-[#FFFFFF] text-sm ">
                  Stable Swap is Stable Borrow Official Exchange, it’s a
                  Decentralized Exchange with Unique Protocols that allows users
                  Swap Tokens and earn as a Liquidity provider and Pool Creator.
                  <br />
                  <br /> Our unique automatic market maker protocol allows users
                  exchange Tokens instantly without waiting for orders to be
                  filled and automatically determine the exchange rate on each
                  transaction and at same time makes both interest earned and
                  tokens deposited available for liquidity providers. <br />
                  <br /> Stable Swap keeps it’s users safe through unique
                  security on and off chain to screen each token listed by
                  project owners and take damage deposit in advance to keep scam
                  tokens away ...
                  <Link
                    to="/about"
                    className="text-[#009FBD] hover:underline "
                    onClick={() => navigateToAbout("Exchange")}
                  >
                    learn more
                  </Link>
                </p>
                <button
                  onClick={() => handleExchange()}
                  className="bg-[#9114de] hover:bg-opacity-75 rounded-lg text-xs px-[20px] py-2 mt-2 w-[8.8vw]"
                >
                  Exchange
                </button>
              </div>

              <div
                className=" w-[6.46vw] h-[10.46vh] absolute top-0 left-0"
                style={{
                  backgroundImage: `url(${borrowbgone})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <div
                className=" w-[6.46vw] h-[10.46vh] absolute top-0 right-0"
                style={{
                  backgroundImage: `url(${borrowbgtwo})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            </div>
          </div>
        </LandingBody>
      </div>

      {/* mobile */}
      <div className="md:hidden bg-black pb-[11.50vh]">
        <div className="mx-[4.83vw] pt-[4.02vh] ">
          <Header />
        </div>
        <div
          style={{ font: "TT Firs Neue Trl", fontFamily: "TT Firs Neue Trl" }}
          className="mx-[6.83vw] mt-[12.94vh] flex flex-col  gap-[5.52vw] text-white  "
        >
          <div className="flex-col flex justify-between gap-[1.5vh]  h-full w-full ">
            <div className="border-[3px] border-[#009FBD]  rounded-[30px]  w-full h-full relative bg-gradient-to-r from-[#009FBD]  to-[#865DFF] ">
              <div className="flex flex-col items-center gap-[5px] bg-black/80 pb-[4.24vh]  h-full rounded-[30px] px-[4.83vw] md:py-2">
                <img
                  src={borrow}
                  alt=""
                  className="w-[7.81rem] h-[5.25rem] md:w-[9.32vw] md:h-[11.20vh] "
                />
                <h1 className="font-black border-b-2 border-[#009FBD] text-base md:text-lg ">
                  Borrow $STC
                </h1>
                <p className="text-justify text-xs mx-4 mt-2 text-[#FFFFFF] md:text-sm  ">
                  <span className=" font-bold text-white">
                    Stable Coin ($STC){" "}
                  </span>{" "}
                  is Stable Borrow (STB) Official Token, it’s a fully
                  Decentralized and collateral backed token that’s maintains
                  1usd as it’s price making it a Stable Token ...{" "}
                  <Link
                    to="/about"
                    className="text-[#865DFF] underline underline-offset-2 hover:underline cursor-pointer "
                    onClick={() => navigateToAbout("Borrow")}
                  >
                    learn more
                  </Link>
                </p>
                <button
                  className="bg-[#009FBD] hover:bg-opacity-75 rounded-lg text-xs px-[20px] py-2 mt-2 w-[65.77vw] "
                  onClick={() => handleBorrow()}
                >
                  Borrow now
                </button>
              </div>
              <div
                className=" w-[6.46vw] h-[10.46vh] absolute top-0 left-0"
                style={{
                  backgroundImage: `url(${borrowbgone})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <div
                className=" w-[6.46vw] h-[10.46vh] absolute top-0 right-0"
                style={{
                  backgroundImage: `url(${borrowbgtwo})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            </div>
            <div className="bg-gradient-to-r from-[#009FBD]  to-[#865DFF]  border-[3px] border-[#009FBD]  rounded-[30px] w-full h-full relative ">
              <div className="flex flex-col items-center gap-[5px] bg-black/80 w-full h-full pb-[4.24vh]  rounded-[30px] px-[6px] py-2 ">
                <img
                  src={earn}
                  alt=""
                  className="w-[6.625rem] h-[5.625rem] md:w-[9.32vw] md:h-[11.20vh] "
                />
                <h1 className="font-black border-b-2 border-[#009FBD] text-base md:text-lg ">
                  Earn $STC
                </h1>
                <p className="text-justify mx-4 mt-2 text-[#FFFFFF] text-xs md:text-sm ">
                  Register as an haunter today to earn as you play by haunting
                  vaults in liquidation and regulating prices. Earn various
                  tokens that can be exchanged to any token via exchange UI ...
                  <Link
                    to="/about"
                    className="text-[#865DFF] underline underline-offset-2 hover:underline cursor-pointer "
                    onClick={() => navigateToAbout("Earn")}
                  >
                    learn more
                  </Link>
                </p>
                <button
                  className="bg-[#009FBD] hover:bg-opacity-75 rounded-lg text-xs px-[20px] py-2 mt-2 w-[65.77vw] md:w-[8.8vw]"
                  onClick={() => handleEarn()}
                >
                  Earn now
                </button>
              </div>

              <div
                className=" w-[6.46vw] h-[10.46vh] absolute top-0 left-0"
                style={{
                  backgroundImage: `url(${borrowbgone})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <div
                className=" w-[6.46vw] h-[10.46vh] absolute top-0 right-0"
                style={{
                  backgroundImage: `url(${borrowbgtwo})`,
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
            </div>
          </div>
          <div
            // onLoad={verifyConnection}
            className="bg-gradient-to-r from-[#013038] to-[#013139]  border-[3px] border-[#009FBD] h-full rounded-[30px] relative  "
          >
            <div className="flex flex-col items-center gap-[5px] bg-black/30 w-full h-full rounded-[30px] px-[6px] py-2 pb-[4.24vh]">
              <img
                src={exchange}
                alt=""
                className="w-[5.375rem] h-[7.125rem] md:w-[80px] "
              />
              <h1 className="font-black border-b-2 border-[#009FBD] text-base md:text-lg">
                Exchange
              </h1>

              <p className=" mx-4 mt-2 text-[#FFFFFF] text-xs md:text-sm  text-justify">
                Stable Swap is Stable Borrow Official Exchange, it’s a
                Decentralized Exchange with Unique Protocols that allows users
                Swap Tokens and earn as a Liquidity provider and Pool Creator.
                <br />
                <br /> Our unique automatic market maker protocol allows users
                exchange Tokens instantly without waiting for orders to be
                filled and automatically determine the exchange rate on each
                transaction and at same time makes both interest earned and
                tokens deposited available for liquidity providers. <br />
                <br /> Stable Swap keeps it’s users safe through unique security
                on and off chain to screen each token listed by project owners
                and take damage deposit in advance to keep scam tokens away ...
                <Link
                  to="/about"
                  className="text-[#009FBD] hover:underline "
                  onClick={() => navigateToAbout("Exchange")}
                >
                  learn more
                </Link>
              </p>
              <button
                onClick={() => handleExchange()}
                className="bg-[#9114de] hover:bg-opacity-75 rounded-lg text-xs px-[20px] py-2 mt-2 w-[65.77vw] md:w-[8.8vw]"
              >
                Exchange
              </button>
            </div>

            <div
              className=" w-[6.46vw] h-[10.46vh] absolute top-0 left-0"
              style={{
                backgroundImage: `url(${borrowbgone})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <div
              className=" w-[6.46vw] h-[10.46vh] absolute top-0 right-0"
              style={{
                backgroundImage: `url(${borrowbgtwo})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Info;
