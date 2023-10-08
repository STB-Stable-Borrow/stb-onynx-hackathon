import React, { useState, useEffect } from "react";
import xdc from "../../../assets/dashboard/xdc.svg";
import swapImg from "../../../assets/dashboard/swap.svg";
import stc from "../../../assets/dashboard/stc.svg";
import question from "../../../assets/dashboard/question.svg";
import swapBtn from "../../../assets/dashboard/swapBtn.svg";
import {
  getAmountOut,
  getPriceFromPool,
  swap,
} from "../../../lib/stbSwapContract";
import { approveAccount } from "../../../lib/stcContract";

function SwapIndex({
  _setConfirmationRes,
  _account,
  _handleLoading,
  _web3,
  _stbSwap,
  _stc,
  _stb,
  _xdcBlnc,
  _stcBlnc,
  _xdcPrc,
  expandedComponent,
}) {
  const [slippage, setSlippage] = useState([
    {
      id: 1,
      value: 0.1,
      isActive: false,
    },
    {
      id: 2,
      value: 0.5,
      isActive: false,
    },
    {
      id: 3,
      value: 1,
      isActive: false,
    },
  ]);

  const [isSwapped, setIsSwapped] = useState(false);
  const [token, setToken] = useState("XDC");
  const [amtInXDC, setAmtInXDC] = useState(0);
  const [amtInSTC, setAmtInSTC] = useState(0);
  const [amtOutXDC, setAmtOutXDC] = useState(null);
  const [amtOutSTC, setAmtOutSTC] = useState(null);
  const [minRcv, setMinRcv] = useState(0);
  const [_disable, setDisable] = useState(true);
  const [poolFee, setPoolFee] = useState(0.3);
  const [poolId, setPoolId] = useState(1);
  const [rate, setRate] = useState(0);

  useEffect(() => {
    (async () => {
      if (_stbSwap) {
        await getPriceFromPool(_stbSwap, poolId, _stb.options.address).then(
          (res) => {
            setRate(res);
          }
        );
      }
    })();
  },[]);

  const handleSwap = () => {
    if (
      document.getElementById("swap-input1") ||
      document.getElementById("swap-input2") ||
      document.getElementById("swap-input2a") ||
      document.getElementById("swap-btn")
    ) {
      setAmtOutSTC(null);
      setAmtOutXDC(null);
      if (token == "XDC") {
        setToken("STC");
        if (document.getElementById("swap-input2")) {
          document.getElementById("swap-input2").disabled = false;
          document.getElementById("swap-input2").value = null;
        }
        if (document.getElementById("swap-input2a")) {
          setDisable(false);
        }
        if (document.getElementById("swap-input1")) {
          document.getElementById("swap-input1").disabled = true;
          document.getElementById("swap-input1").value = null;
        }
      } else {
        setToken("XDC");
        if (document.getElementById("swap-input2")) {
          document.getElementById("swap-input2").disabled = true;
          document.getElementById("swap-input2").value = null;
        }
        if (document.getElementById("swap-input1")) {
          document.getElementById("swap-input1").disabled = false;
          document.getElementById("swap-input1").value = null;
        }
      }
      setIsSwapped((prev) => !prev);
      if (document.getElementById("swap-btn")) {
        document.getElementById("swap-btn").style.backgroundColor = "#585858";
      }
    }
  };

  const [inputValue, setInputValue] = useState("");
  const [actSlippage, setActSlippage] = useState(0.1);

  const handleInputChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value > 0.0) {
      setInputValue(value);
      setSlippage([
        {
          id: 1,
          value: 0.1,
          isActive: false,
        },
        {
          id: 2,
          value: 0.5,
          isActive: false,
        },
        {
          id: 3,
          value: value,
          isActive: true,
        },
      ]);
      setActSlippage(value);
      if (amtOutSTC) {
        const perOut = amtOutSTC * (value / 100);
        setMinRcv(amtOutSTC - perOut);
      }
      if (amtOutXDC) {
        const perOut = amtOutXDC * (value / 100);
        setMinRcv(amtOutXDC - perOut);
      }
    }
  };

  const handleSlippageClick = (id) => {
    let newSlipList = [
      {
        id: 1,
        value: 0.1,
        isActive: false,
      },
      {
        id: 2,
        value: 0.5,
        isActive: false,
      },
      {
        id: 3,
        value: 1,
        isActive: false,
      },
    ];
    newSlipList[id - 1].isActive = true;
    setSlippage(newSlipList);
    setActSlippage(newSlipList[id - 1].value);
    if (amtOutSTC) {
      const perOut = amtOutSTC * (newSlipList[id - 1].value / 100);
      setMinRcv(amtOutSTC - perOut);
    }
    if (amtOutXDC) {
      const perOut = amtOutXDC * (newSlipList[id - 1].value / 100);
      setMinRcv(amtOutXDC - perOut);
    }
    if (document.getElementById("slip-input")) {
      document.getElementById("slip-input").value = null;
    }
  };

  const calculateAmtOutXDC = async (stbSwap, poolId, xdcAddr, amount) => {
    const res = await getAmountOut(stbSwap, poolId, xdcAddr, amount).then(
      (res) => {
        return res;
      }
    );
    return res;
  };

  const calculateAmtOutSTC = async (stbSwap, poolId, stcAddr, amount) => {
    const res = await getAmountOut(stbSwap, poolId, stcAddr, amount).then(
      (res) => {
        return res;
      }
    );
    return res;
  };

  const calculateMinRcv = (amount) => {
    const perOut = amount * (actSlippage / 100);
    return amount - perOut;
  };

  const handleSwapInputXDC = async (e) => {
    const value = parseFloat(e.target.value);
    if (value > 0.0 && value <= _xdcBlnc) {
      const amt = _web3.utils.toWei(String(value), "ether");
      setAmtInXDC(value);
      calculateAmtOutXDC(_stbSwap, poolId, _stb.options.address, amt).then(
        async (res) => {
          setAmtOutXDC(res);
          if (document.getElementById("swap-btn")) {
            if (res > 0) {
              document.getElementById("swap-btn").style.backgroundColor =
                "#009FBD";
            } else {
              document.getElementById("swap-btn").style.backgroundColor =
                "#585858";
            }
          }
          const minRcv = calculateMinRcv(res);
          setMinRcv(minRcv);
        }
      );
    } else {
      setAmtOutXDC(0);
      setMinRcv(0);
      if (document.getElementById("swap-btn")) {
        document.getElementById("swap-btn").style.backgroundColor = "#585858";
      }
    }
  };

  const handleSwapInputSTC = async (e) => {
    const value = parseFloat(e.target.value);
    if (value > 0.0 && value <= _stcBlnc) {
      const amt = _web3.utils.toWei(String(value), "ether");
      setAmtInSTC(value);
      calculateAmtOutSTC(_stbSwap, poolId, _stc.options.address, amt).then(
        async (res) => {
          setAmtOutSTC(res);
          if (document.getElementById("swap-btn")) {
            if (res > 0) {
              document.getElementById("swap-btn").style.backgroundColor =
                "#009FBD";
            } else {
              document.getElementById("swap-btn").style.backgroundColor =
                "#585858";
            }
          }
          const minRcv = calculateMinRcv(res);
          setMinRcv(minRcv);
        }
      );
    } else {
      setAmtOutSTC(0);
      setMinRcv(0);
      if (document.getElementById("swap-btn")) {
        document.getElementById("swap-btn").style.backgroundColor = "#585858";
      }
    }
  };

  const handleSwapToken = async () => {
    if (
      document.getElementById("swap-btn").style.backgroundColor ===
      "rgb(0, 159, 189)"
    ) {
      if (token === "XDC") {
        if (amtInXDC > 0.0) {
          const amt = _web3.utils.toWei(String(amtInXDC), "ether");
          const minTol = _web3.utils.toWei(String(minRcv), "ether");
          console.log("amt: ", amt, "min: ", minTol);
          _handleLoading();
          await swap(
            _stbSwap,
            poolId,
            _stb.options.address,
            _stc.options.address,
            amt,
            minTol,
            _account,
            amt
          ).then((res) => {
            _handleLoading();
            _setConfirmationRes(res);
          });
        }
      } else {
        if (token === "STC") {
          if (amtInSTC > 0.0) {
            const maxU256 =
              115792089237316195423570985008687907853269984665640564039457584007913129639935n;
            const amt = _web3.utils.toWei(String(amtInSTC), "ether");
            const minTol = _web3.utils.toWei(String(minRcv), "ether");
            console.log("amt: ", amt, "min: ", minTol);
            await _stc.methods
              .allowance(_account, _stbSwap.options.address)
              .call()
              .then(async (res) => {
                if (res == maxU256) {
                  _handleLoading();
                  await swap(
                    _stbSwap,
                    poolId,
                    _stc.options.address,
                    _stb.options.address,
                    amt,
                    minTol,
                    _account,
                    0
                  ).then((res) => {
                    _handleLoading();
                    _setConfirmationRes(res);
                  });
                } else {
                  _handleLoading();
                  await approveAccount(
                    _stc,
                    _account,
                    _stbSwap.options.address
                  ).then(async (res) => {
                    if (res) {
                      await swap(
                        _stbSwap,
                        poolId,
                        _stc.options.address,
                        _stb.options.address,
                        amt,
                        minTol,
                        _account,
                        0
                      ).then((res) => {
                        _handleLoading();
                        _setConfirmationRes(res);
                      });
                    } else {
                      _handleLoading();
                      _setConfirmationRes(res);
                    }
                  });
                }
              });
          }
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p
        className={`text-center  text-[#585858]  mb-[0.5vh]  ${
          expandedComponent === "swap" ? "text-[.75rem]" : "text-[0.63rem] "
        }`}
      >
        Select Token Pair, input the desired amount, and select Token Tolerance
      </p>
      {token === "XDC" ? (
        <p
          className={`text-[#B0B0B0] ${
            expandedComponent === "swap" ? "text-[0.85rem]" : "text-[0.63rem] "
          } text-center mt-[1.5vh`}
        >
          Balance: {_xdcBlnc} XDC
        </p>
      ) : (
        <p
          className={`text-[#B0B0B0] ${
            expandedComponent === "swap" ? "text-[0.85rem]" : "text-[0.63rem] "
          } text-center mt-[1.5vh]`}
        >
          Balance: {_stcBlnc} STC
        </p>
      )}
      <div
        className={`flex  items-center pb-[1.5vh] ${
          isSwapped ? "flex-col-reverse" : "flex-col"
        }`}
      >
        <div
          className={`flex flex-col ${
            isSwapped ? "flex-col-reverse" : "flex-col"
          }`}
        >
          <div
            className={`bg-[#B0B0B0] h-[4.63vh] rounded-[10px] w-[75.6vw] ${
              expandedComponent === "swap" ? "md:w-[30vw]" : "md:w-[22vw]"
            } px-[.83vw] py-[.56vh] flex items-center`}
          >
            <img src={xdc} alt="" className="w-[3.2vh] h-[3.2vh] mr-[0.52vw]" />
            <select
              name=""
              id=""
              className="bg-inherit font-semibold text-[.85rem]"
            >
              <option value="">XDC</option>
              <option value="">STC</option>
            </select>
            <div className="h-[3.43vh] w-[2px] bg-[#292C31] mx-[.73vw]"></div>
            <div className="relative">
              {!amtOutSTC && (
                <input
                  type="number"
                  name=""
                  id="swap-input1"
                  className={`bg-inherit ${
                    expandedComponent === "swap"
                      ? "md:w-[15.25vw]"
                      : "md:w-[10.25vw]"
                  } pl-[.73vw] placeholder:text-[#292c31] placeholder:font-semibold  font-semibold text-xs outline-none`}
                  placeholder="0"
                  onInput={(e) => {
                    handleSwapInputXDC(e);
                  }}
                />
              )}
              {amtOutSTC && (
                <input
                  value={amtOutSTC}
                  disabled
                  type="number"
                  name=""
                  className={`bg-inherit ${
                    expandedComponent === "swap"
                      ? "md:w-[15.25vw]"
                      : "md:w-[10.25vw]"
                  } pl-[.73vw] placeholder:text-[#292c31] placeholder:font-semibold  font-semibold text-xs outline-none`}
                  placeholder="0"
                />
              )}
              <button
                onClick={() => {
                  if (token === "XDC") {
                    document.getElementById("swap-input1").value = _xdcBlnc;
                  }
                }}
                className={`absolute right-[-1.375rem] ${
                  expandedComponent === "swap"
                    ? "md:right-[-4rem]"
                    : "md:right-[-2.26vw]"
                } top-[0.58vh] text-[.75rem]`}
              >
                Max
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center w-full md:w-[17.45vw] justify-between my-[1.48vh] gap-4 md:gap-0 ">
          <div className="md:w-[7.29vw] w-full h-[.19vh] bg-[#B0B0B0]"></div>
          <button onClick={handleSwap}>
            <img src={swapImg} alt="" className="md:w-auto w-20" />
          </button>
          <div className="md:w-[7.29vw] w-full h-[.19vh] bg-[#B0B0B0]"></div>
        </div>
        <div className="bg-[#B0B0B0] h-[4.63vh] rounded-[10px] w-full px-[.83vw] py-[.56vh] flex items-center">
          <img src={stc} alt="" className="w-[3.2vh] h-[3.2vh] mr-[0.52vw]" />
          <select
            name=""
            id=""
            className="bg-inherit font-semibold text-[.85rem]"
          >
            <option value="">STC</option>
            <option value="">XDC</option>
          </select>
          <div className="h-[3.43vh] w-[2px] bg-[#292C31] mx-[.73vw]"></div>
          <div className="relative">
            {!amtOutXDC && (
              <input
                disabled={_disable}
                type="number"
                name=""
                id="swap-input2"
                className={`bg-inherit ${
                  expandedComponent === "swap"
                    ? "md:w-[15.25vw]"
                    : "md:w-[10.25vw]"
                } pl-[.73vw] placeholder:text-[#292c31] placeholder:font-semibold  font-semibold text-xs outline-none`}
                placeholder="0"
                onInput={(e) => {
                  handleSwapInputSTC(e);
                }}
              />
            )}
            {amtOutXDC && (
              <input
                id="swap-input2a"
                disabled
                value={amtOutXDC}
                type="number"
                name=""
                className={`bg-inherit ${
                  expandedComponent === "swap"
                    ? "md:w-[15.25vw]"
                    : "md:w-[10.25vw]"
                } pl-[.73vw] placeholder:text-[#292c31] placeholder:font-semibold  font-semibold text-xs outline-none`}
                placeholder=""
                onInput={(e) => {
                  handleSwapInputSTC(e);
                }}
              />
            )}
            <button
              onClick={() => {
                if (token === "STC") {
                  document.getElementById("swap-input2").value = _stcBlnc;
                }
              }}
              className={`absolute right-[-1.375rem] ${
                expandedComponent === "swap"
                  ? "md:right-[-4rem]"
                  : "md:right-[-2.26vw]"
              } top-[0.58vh] text-[.75rem]`}
            >
              Max
            </button>
          </div>
        </div>
      </div>
      <div className="mb-[0.95vh] flex items-center gap-4">
        <h4 className="text-[#B0B0B0] text-[0.75rem] flex items-center justify-center gap-1">
          Exchange Rate: <img src={question} alt="" />
        </h4>
        <h6
          className={`font-semibold text-[#865DFF] ${
            expandedComponent === "swap" ? "text-[0.75rem]" : "text-[0.625rem] "
          }`}
        >
          1 STC $(1.0000) ~ {rate} XDC
        </h6>
      </div>
      <div
        className={` w-[75.60vw] ${
          expandedComponent === "swap" ? "md:w-[30vw]" : "md:w-[22vw]"
        } py-2 md:py-[0.5rem] px-4 md:px-[1.04vw] rounded-[15px] bg-[#292C31] mb-[1.5vh] flex flex-col justify-center items-center  `}
      >
        <h4 className="text-[#B0B0B0] text-[0.75rem] flex items-center justify-center gap-1 font-semibold mb-[0.5vh]">
          Slippage Tolerance:
          <img src={question} alt="" className=" " />
        </h4>
        <div className="flex items-center justify-between w-full">
          <div
            className={`bg-[#202225] w-[50%] ${
              expandedComponent === "swap" ? "md:w-[15.25vw]" : "md:w-[9.53vw] "
            } h-[3.89vh] px-[1.15vw] justify-between flex items-center text-[0.65rem] rounded-[10px] text-[#B0B0B0]`}
          >
            {slippage.map((slip) => (
              <p
                key={slip.id}
                className={`cursor-pointer ${
                  slip.isActive ? "text-[#009FBD]" : "text-gray-500"
                }`}
                onClick={() => handleSlippageClick(slip.id)}
              >
                {slip.value + "%"}
              </p>
            ))}
          </div>
          <div className="bg-[#B0B0B0] rounded-[10px] h-[3.89vh] pl-4 md:pl-[.5vw] w-[40%] md:w-[8.74vw] flex items-center relative text-[0.65rem]">
            <input
              id="slip-input"
              type="number"
              className="bg-inherit w-[75%] md:w-[6.74vw] placeholder:text-black text-xs"
              placeholder="Input slip"
              onInput={handleInputChange}
            />
            <p className="absolute right-1">%</p>
          </div>
        </div>
      </div>
      <div
        className={`px-[1.8vw] py-[1.13vh] w-[75.60vw] md:w-[21.04vw]  bg-[#292C31] text-[#b0b0b0] mb-[1.22vh] border-[1.5px] border-[#585858] border-dashed ${
          expandedComponent === "swap"
            ? "text-[0.75rem] rounded-[20px]"
            : "text-[0.425rem] rounded-[8px] "
        }`}
      >
        <div className="flex items-center gap-[1.09vw] justify-between mb-1">
          <div className="flex items-center gap-[1px]">
            <img src={question} alt="" />
            <h4>Minimum Received:</h4>
          </div>
          <p className="">{minRcv}</p>
        </div>
        <div className="flex items-center gap-[1.09vw] justify-between">
          <div className="flex items-center gap-[1px]">
            <img src={question} alt="" />
            <h4>Pool Fee:</h4>
          </div>
          <p>
            {poolFee}% / {token}{" "}
          </p>
        </div>
      </div>
      <button
        onClick={(e) => {
          handleSwapToken(e);
        }}
        id="swap-btn"
        className={`${
          expandedComponent === "swap"
            ? "py-[.75vh] text-[.75rem] w-[75.60vw] rounded-[7px]"
            : "py-[.25vh] text-[.425rem] w-[55.60vw] rounded-[4px] "
        }   md:w-auto px-[2.29vw] bg-[#585858]   text-[#B0B0B0] hover:bg-opacity-75 flex items-center justify-center gap-2 md:mt-0 mt-[5.58vh] md:mb-0 mb-[3.87rem] `}
      >
        <img
          src={swapBtn}
          alt=""
          className={`${
            expandedComponent === "swap"
              ? "md:w-[1.25vw] md:h-[1.25vw]"
              : "md:w-[.95vw] md:h-[.95vw]"
          } h-[1.125rem] w-[1.125rem] `}
        />
        Swap
      </button>
    </div>
  );
}

export default SwapIndex;
