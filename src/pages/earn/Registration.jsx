import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/borrow/logo.svg";
import back from "../../assets/borrow/back.svg";
import next from "../../assets/borrow/next.svg";
import addAvatar from "../../assets/earn/addAvatar.svg";
import CreateAvatar from "./CreateAvatar";
import editAvatar from "../../assets/earn/editAvatar.svg";
import { Web3ModalContext } from "../../contexts/web3ModalContext";
import {
  isRegistered,
  totalTokenCount,
  createAccount,
} from "../../lib/sbtContract";
import { saveTokenDetails } from "../../lib/filebaseIpfs";
import {
  GatewayStatus,
  IdentityButton,
  useGateway,
} from "@civic/ethereum-gateway-react";
import { CivicPassProvider } from "../../contexts/civicpassContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Registration() {
  const { gatewayStatus } = useGateway();
  const { web3, sbt, account, signer, address, connected, chainId } =
    useContext(Web3ModalContext);
  const [createAvatar, setCreateAvatar] = useState(false);
  const [showRegistration, setShowRegistration] = useState(true);
  const [loading, setLoading] = useState(false);
  const [avatarImage, setAvatarImage] = useState(null);

  const [username, setUsername] = useState(null);
  const [about, setAbout] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();
  const registerBtn = document.getElementById("register-btn");
  const captchaBtn = document.querySelector(
    '[data-testid="CIVIC_IDENTITY_BUTTON"]'
  );

  // verify connection status and chainId
  const verifyConnection = () => {
    const acceptIds = [50, 51];
    if (!connected && !chainId) {
      toast.info("You have to connect your wallet to proceed");
      navigate("/");
    }
    if (connected && !acceptIds.includes(chainId)) {
      toast.error(
        "You connected to wrong chain, disconnect and connect to Apothem or Xinfin."
      );
      navigate("/");
    }
  };

  const handleCreateAvatar = () => {
    setCreateAvatar(true);
    setShowRegistration(false);
  };

  const handleCreateAvatarBackButtonClick = () => {
    setCreateAvatar(false);
    setShowRegistration(true);
  };

  //handles register button colour behaviour
  const handleRegisterButtonColour = () => {
    if (registerBtn) {
      if (
        captchaBtn.textContent == "Active" &&
        avatarImage &&
        username &&
        about
      ) {
        registerBtn.style.backgroundColor = "#009FBD";
      } else {
        registerBtn.style.backgroundColor = "#585858";
      }
    }
  };

  /// since gatewayStatus keeps returning 2 even when pass is active
  ///get the content of the identityButton to track if pass is active or not
  handleRegisterButtonColour();

  //handles profile creation
  const handleMintProfile = async () => {
    if (
      registerBtn &&
      registerBtn.style.backgroundColor === "rgb(0, 159, 189)"
    ) {
      registerBtn.style.backgroundColor = "rgb(88, 88, 88)";
      await isRegistered(sbt, account).then(async (res) => {
        if (!res) {
          await totalTokenCount(sbt).then(async (res1) => {
            const tokenId = res1 + 1;
            saveTokenDetails(tokenId, username, about, avatarImage, account).on(
              "httpHeaders",
              async (statusCode, headers) => {
                const tokenUrl = `https://ipfs.filebase.io/ipfs/${headers["x-amz-meta-cid"]}`;
                await createAccount(sbt, tokenUrl, account).then((res2) => {
                  if (res2) {
                    navigate("/dashboard");
                  } else {
                    registerBtn.style.backgroundColor = "rgb(0, 159, 189)";
                  }
                });
              }
            );
          });
        } else {
          toast.success(
            "You are a registered user, you will be redirected to your dashbaord."
          );
          navigate("/dashboard");
        }
      });
    }
  };

  //gets 2d image of 3d avatar
  const getAvatarImage = (avatarUrl) => {
    const params = {
      model: `${avatarUrl}`,
      scene: "fullbody-portrait-v1-transparent",
      armature: "ArmatureTargetMale",
      blendShapes: {},
    };
    const http = new XMLHttpRequest();
    http.open("POST", "https://render.readyplayer.me/render");
    http.setRequestHeader("Content-type", "application/json");
    http.send(JSON.stringify(params));
    http.onload = function () {
      const avataerImg = JSON.parse(http.responseText).renders[0];
      if (avataerImg !== "") {
        console.log("png: ", avataerImg);
        setAvatarImage(avataerImg);
        setAvatar(null);
      } else {
        toast.error("Error while getting created avatar. Try again later");
      }
    };
  };

  //get image when avatar is ready
  useEffect(() => {
    if (avatar) {
      (async () => {
        getAvatarImage(avatar);
      })();
    }
  }, [avatar]);

  //handle loading behaviour
  useEffect(() => {
    if (avatarImage) {
      (async () => {
        setLoading(false);
      })();
    }
  }, [avatar]);

  return (
    <CivicPassProvider _wallet={signer}>
      <div className="w-screen md:h-screen h-full pb-[19.06rem] md:pb-0 bg-[#292C31] ">
        <Link to={"/"}>
          <img
            src={logo}
            alt=""
            className=" pt-[6vh] pl-[6.2vw] mb-[2.87vh] h-[9.57vh] "
          />
        </Link>
        {showRegistration && (
          <div className="bg-[#202225] text-white rounded-[15px] md:h-[80vh] md:mx-[253px] mx-[1.25rem] px-[1.51vh] py-[1.39vh] mt-[5rem] md:mt-0 ">
            <div className="text-center mb-[2.3vh]">
              <h1 className="mb-[10px] text-[#009FBD] font-black text-xl ">
                Registration
              </h1>
              <p className="px-[70px] text-xs"></p>
            </div>
            <div className="bg-[#292C31] w-full gap-[3vh]  rounded-[15px] flex flex-col justify-between  p-[10px] mb-[2vh] ">
              <div className="bg-[#202225] py-[1vh] px-[3vw] rounded-[15px] flex flex-col items-center justify-center ">
                <h1 className="text-[#009FBD] font-semibold text-sm mb-[2.4vh]  ">
                  Step 1 - Verify you are human
                </h1>
                <IdentityButton />
              </div>
              <div className="gap-[25px] flex flex-col items-center justify-between md:h-[35.03vh] md:flex-row   ">
                <div className="md:w-[30.81vw] w-full h-[15rem] flex flex-col items-center rounded-[15px] bg-[#202225] pt-[1.6vh] ">
                  <h1 className="text-center text-[0.875rem] font-semibold text-[#009FBD] mb-[2.4vh] ">
                    Step 2 - Create your avatar
                  </h1>
                  <div className="md:w-[10.81vw] w-[9.68rem] md:h-[10.81vw] h-[9.68rem] rounded-full border border-dashed border-[#585858] flex justify-center items-center flex-col relative  ">
                    {loading && (
                      <div>
                        <h1 className="text-xs">Loading...</h1>
                      </div>
                    )}
                    <img
                      src={avatarImage || addAvatar}
                      alt=""
                      className={
                        avatarImage
                          ? "w-full h-full object-cover rounded-full"
                          : "w-[2.6vw] h-[2.6vw]"
                      }
                    />
                    {avatarImage ? (
                      ""
                    ) : (
                      <p
                        onClick={handleCreateAvatar}
                        className="text-xs text-center text-[#B0B0B0] hover:cursor-pointer hover:underline "
                      >
                        Click to choose <br /> an Avatar
                      </p>
                    )}
                  </div>
                  {avatarImage && (
                    <button className="flex justify-center items-center text-xs mt-2 gap-1 relative">
                      <img
                        src={editAvatar}
                        alt=""
                        className="md:w-[20px] w-[10px]"
                      />
                      <p
                        onClick={handleCreateAvatar}
                        className="text-[#B0B0B0] text-xs md:text-base  hover:underline "
                      >
                        Edit Avatar
                      </p>
                    </button>
                  )}
                </div>
                <div className="w-full h-full rounded-[15px] bg-[#202225] pt-[1.6vh] pb-[2vh] px-[30px] ">
                  <h1 className=" text-sm font-semibold text-[#009FBD] mb-[1.4vh] ">
                    Step 3 - Fill the following Information
                  </h1>
                  <form action="" className="text-[#292C31] text-sm ">
                    <input
                      type="text"
                      className=" w-full h-[5.4vh] rounded-lg bg-[#B0B0B0] pl-[21px] placeholder:text-[#292C31] mb-[10px]"
                      placeholder="Enter Your Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <textarea
                      name=""
                      id=""
                      placeholder="About"
                      className=" w-full h-[15.7vh] pt-[15px]  rounded-lg bg-[#B0B0B0] pl-[21px] placeholder:text-[#292C31] mb-[10px]"
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                    ></textarea>
                  </form>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-center md:gap-[110px] mt-[1.19vh] mb-[1.5vh] md:text-base text-sm ">
                <button
                  onClick={() => {
                    navigate("/info");
                  }}
                  className="border border-[#009FBD] w-[8rem] h-[2.19rem] md:w-[164px] md:h-[6.95vh] rounded-lg flex items-center justify-center gap-2 bg-inherit hover:opacity-75 "
                >
                  <img src={back} alt="" />
                  Back
                </button>
                <button
                  id="register-btn"
                  // onLoad={verifyConnection}
                  className="bg-[#585858] w-[8rem] h-[2.19rem] md:w-[164px] md:h-[6.95vh] rounded-lg flex items-center justify-center gap-2  hover:bg-opacity-75 "
                  onClick={handleMintProfile}
                >
                  Register
                  <img src={next} alt="" />
                </button>
              </div>
            </div>
          </div>
        )}
        {
          //   Create Avatar
          createAvatar && (
            <CreateAvatar
              onBackButtonClick={handleCreateAvatarBackButtonClick}
              _setAvatartImage={setAvatarImage}
              _setLoading={setLoading}
              _setAvatar={setAvatar}
              _avatar={avatar}
              _adr={address}
            />
          )
        }
      </div>
    </CivicPassProvider>
  );
}

export default Registration;
