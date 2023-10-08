import React, { useState } from "react";
import expandLogo from "../../assets/dashboard/expandLogo.svg";
import collapseLogo from "../../assets/dashboard/collapseLogo.svg";
import home from "../../assets/dashboard/home.svg";
import borrow from "../../assets/dashboard/borrow.svg";
import earn from "../../assets/dashboard/earn.svg";
import exchange from "../../assets/dashboard/exchange.svg";
import history from "../../assets/dashboard/history.svg";
import settings from "../../assets/dashboard/settings.svg";
import logout from "../../assets/dashboard/logout.svg";
import collapse from "../../assets/dashboard/collapse.svg";
import expand from "../../assets/dashboard/expand.svg";
import { useNavigate } from "react-router-dom";

function Sidebar({
  onDashBorrowClick,
  onEarnClick,
  onExchangeClick,
  onHistoryClick,
  onSettingsClick,
  onHomeClick,
  onTokenizationClick,
  activeTab,
  _verifyConnection,
  _disconnect,
  active,
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  const handleExpand = () => {
    setIsExpanded((prev) => !prev);
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
      id: 7,
      name: "Tokenization",
      icon: "",
      onClick: onTokenizationClick,
    },
    {
      id: 6,
      name: "Settings",
      icon: settings,
      onClick: onSettingsClick,
    },
  ];

  const handleLogout = async () => {
    await _disconnect().then(() => {
      navigate("/");
    });
  };

  return (
    <div className="relative cursor-pointer">
      {isExpanded ? (
        <img
          onClick={() => navigate("/")}
          src={expandLogo}
          alt=""
          className="mb-[8.75vh]"
        />
      ) : (
        <img
          onClick={() => navigate("/")}
          src={collapseLogo}
          alt=""
          className="mb-[8.75vh]"
        />
      )}

      <div className="flex flex-col gap-[2.4vh]">
        {sidebarObj.map((item) => (
          <div
            className={`${
              isExpanded ? "w-[182px]" : "w-[42px]"
            } py-[0.865vh] rounded-lg flex gap-[16px] items-center pl-[9px]   hover:bg-[#009FBD]/10
               ${active === item.id && "bg-[#009FBD]"}
            }
             hover:text-[#009FBD] cursor-pointer `}
            key={item.id}
            onClick={() => {
              item.onClick(item.id);
              activeTab(item.id);
            }}
          >
            <img src={item.icon} alt="" />
            {isExpanded && (
              <p className="text-[#D9D9D9] text-[14px]">{item.name}</p>
            )}
          </div>
        ))}
      </div>
      <div
        // onLoad={_verifyConnection}
        onClick={handleLogout}
        className={`${
          isExpanded ? "w-[182px]" : "w-[42px]"
        } py-[0.865vh] rounded-lg flex gap-[16px] items-center pl-[9px] mt-[10vh] hover:text-[#009FBD] cursor-pointer `}
      >
        <img src={logout} alt="" />
        {isExpanded && <p className="text-[#D9D9D9] text-[14px]  ">Logout</p>}
      </div>
      <img
        src={isExpanded ? collapse : expand}
        alt=""
        className="absolute right-[-22px] top-[10vh] "
        onClick={handleExpand}
      />
    </div>
  );
}

export default Sidebar;
