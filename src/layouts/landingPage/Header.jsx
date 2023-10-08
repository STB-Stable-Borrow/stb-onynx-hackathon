import React, { useState, useContext } from "react";
import logoStb from "../../assets/landing/stb-logo.svg";
import { Link, useLocation } from "react-router-dom";
import ham from "../../assets/mobile/ham.svg";
import close from "../../assets/mobile/close.svg";

function Header({ _handleConnectWallet_ }) {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const onHamburgerClick = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  return (
    <div className="flex justify-between items-center ">
      <div>
        <Link to="/">
          <img
            className={`w-[9.18rem] h-[2.31rem] md:w-[13.50vw] md:h-[5.46vh]`}
            src={logoStb}
            alt="Stb Logo"
          />
        </Link>
      </div>
      <div className="hidden lg:flex justify-betweeen items-center gap-[2.14vw] text-[#FFFFFF] font-semibold">
        <ul className="flex gap-[2.14vw]   text-sm cursor-pointer">
          <li className="hover:opacity-75">
            <Link
              to="/about"
              className={`${
                location.pathname === "/about" ? "text-[#009FBD]" : ""
              }  `}
            >
              About
            </Link>
          </li>
          <li className="hover:opacity-75">
            <Link
              to="/exchange"
              className={`   ${
                location.pathname === "/exchange" ? "text-[#009FBD] " : ""
              }`}
            >
              Exchange
            </Link>
          </li>
          {/* {location.pathname !== "/" && (
            <li>
              <Link to="/contact" className={location.pathname === "/contact" ? "text-[#009FBD]" : ""}>Contact</Link>
            </li>
          )} */}
        </ul>

        {location.pathname === "/" && (
          <button
            className="border border-[#009FBD] px-[0.90vw] py-[0.93vh] rounded-lg hover:opacity-75 text-sm "
            onClick={_handleConnectWallet_}
          >
            Connect Wallet
          </button>
        )}
      </div>
      <button onClick={onHamburgerClick} className={`md:hidden w-[1.25rem]  `}>
        <img src={showMenu ? close : ham} alt="" />
      </button>

      {showMenu && (
        <div className="hamburgerMenu w-[50%] h-auto p-[1rem] absolute right-4 top-20 z-50 ">
          <ul className="flex flex-col gap-[1rem] text-white">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/exchange">Exchange</Link>
            </li>
            {location.pathname === "/" && (
              <button
                className="border border-[#009FBD] px-[0.90vw] py-[0.93vh] rounded-lg hover:opacity-75 text-sm "
                onClick={_handleConnectWallet_}
              >
                Connect Wallet
              </button>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Header;
