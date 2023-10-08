import React, { useState, useEffect } from "react";
import hamburger from "../../assets/mobile/ham.svg";
import notification from "../../assets/mobile/notification.svg";
import profile from "../../assets/mobile/profile.svg";
import collapse from "../../assets/mobile/collapse.svg";
import expand from "../../assets/mobile/expand.svg";
import copy from "../../assets/dashboard/copy.svg";
import logo from "../../assets/mobile/logo.svg";
import close from "../../assets/mobile/close.svg";
import home from "../../assets/dashboard/home.svg";
import borrow from "../../assets/dashboard/borrow.svg";
import earn from "../../assets/dashboard/earn.svg";
import exchange from "../../assets/dashboard/exchange.svg";
import history from "../../assets/dashboard/history.svg";
import settings from "../../assets/dashboard/settings.svg";
import { useDashboard } from "../../contexts/dashboardContext";

function MobileNav() {
  const walletAddress = "0x1234567890123456789012345678901234567890";
  const [isExpanded, setIsExpanded] = useState(false);
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);
  const {onHomeClick,activeTab,active,onDashBorrowClick,onEarnClick,onExchangeClick,onHistoryClick,onSettingsClick} = useDashboard()
  const handleNavigation = () => {
    setShowNavigationMenu((prev) => !prev);
  };
  const handleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  const handleCloseNavigation = () => {
    setShowNavigationMenu(false);
  };


  const handleCopy = () => {
    const textToCopy = walletAddress;
    navigator.clipboard.writeText(textToCopy);
    alert("Address copied to clipboard");
  };

  const sidebarObj = [
    {
      id: 1,
      name: "Home",
      icon: home,
      onClick: onHomeClick,
    },
    {
      id: 2,
      name: "Borrow",
      icon: borrow,
      onClick: onDashBorrowClick,
    },
    {
      id: 3,
      name: "Earn",
      icon: earn,
      onClick: onEarnClick,
    },
    {
      id: 4,
      name: "History",
      icon: history,
      onClick: onHistoryClick,
    },
    {
      id: 5,
      name: "Exchange",
      icon: exchange,
      onClick: onExchangeClick,
    },

    {
      id: 6,
      name: "Settings",
      icon: settings,
      onClick: onSettingsClick,
    },
  ];

  const enableScrolling = () => {
    document.body.style.overflow = "auto";
  };

  const disableScrolling = () => {
    document.body.style.overflow = "hidden";
  };

  useEffect(() => {
    if (showNavigationMenu) {
      disableScrolling();
    } else {
      enableScrolling();
    }

    return () => {
      enableScrolling();
    };
  }, [showNavigationMenu]);

  return (
    <div className=" bg-[#202225] px-[4.83vw] pt-[2.23vh] pb-[1.33vh] flex flex-col gap-2">
      <div className="flex items-center justify-between ">
        <img src={hamburger} alt="" onClick={handleNavigation} />
        <div className="flex items-center gap-2">
          <img src={notification} alt="" />
          <img src={profile} alt="" />
          <img
            src={isExpanded ? collapse : expand}
            alt=""
            onClick={handleExpand}
          />
        </div>
      </div>
      {isExpanded && (
        <div className="self-end text-xs text-end">
          <h6 className="font-bold text-[#B0B0B0] ">Mohzcrea8me</h6>
          <div className="flex items-center gap-2">
            <img
              src={copy}
              alt=""
              className="w-[1.25rem] "
              onClick={handleCopy}
            />
            <p>{walletAddress}</p>
          </div>
        </div>
      )}
      {showNavigationMenu && (
        <div className="bg-[#202225] h-screen w-[50vw] absolute top-0 left-0 z-50 px-[5.55vw] pt-[2.79vh] pb-[7.92vh] ">
          <div className="flex items-center justify-between mb-[14.62vh] ">
            <img src={logo} alt="" className="w-[19.32vw] " />
            <button onClick={handleCloseNavigation}>
              <img src={close} alt="" className="w-[5.25vw] " />
            </button>
          </div>
          <div className="flex flex-col items-center justify-between h-[70vh]  w-full">
            <div className="flex flex-col gap-[2.4vh]">
              {sidebarObj.map((item) => (
                <div
                  className={` py-[0.865vh] rounded-lg flex gap-[16px] items-center pl-[9px]  hover:bg-[#009FBD]/10
               ${active === item.id && "bg-[#009FBD]"}
            }
             hover:textsb-[#009FBD] cursor-pointer `}
                  key={item.id}
                  onClick={() => {
                    item.onClick();
                    activeTab(item.id);
                  }}
                >
                  <img src={item.icon} alt="" />
                  <p className="text-[#D9D9D9] text-[14px]">{item.name}</p>
                </div>
              ))}
            </div>
            <div className="w-full ">world</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MobileNav;
