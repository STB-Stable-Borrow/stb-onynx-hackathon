import React, { useEffect, useState } from "react";
import edit from "../../../assets/dashboard/edit.svg";
import deposit from "../../../assets/dashboard/deposit.svg";
import withdraw from "../../../assets/dashboard/withdraw.svg";
import filter from "../../../assets/dashboard/filter.svg";
import search from "../../../assets/dashboard/search.svg";
import vaultsData from "../../../data/vaultsData";
import { getVault } from "../../../lib/stbContract";
import { Big } from "big.js";
import arrowLeft from "../../../assets/dashboard/arrowLeft.svg";

function Vault({
  _vaultId,
  stb,
  colRatio,
  xdcPrc,
  _onDepositClick,
  _onWithdrawClick,
  _onPaybackClick,
  resetVaultSetup,
  onVaultBackClick,
}) {
  const [vaultInfo, setVaultInfo] = useState(null);

  //reset borrow setup
  useEffect(() => {
    resetVaultSetup();
  }, []);

  //get vault details
  useEffect(() => {
    (async () => {
      await getVault(stb, parseInt(_vaultId)).then((res) => {
        setVaultInfo(res);
      });
    })();
  }, [_vaultId]);

  return (
    <div className=" px-[4.83vw] md:px-0 md:pb-0 pb-[15.62vh]">
      <h1 className="md:hidden mt-[3.34vh] mb-[6.13vh] text-[#B0B0B0] font-bold ">
        Welcome!
      </h1>
      <button
        onClick={onVaultBackClick}
        className="md:hidden items-center gap-2 text-[#009FBD] text-sm flex mb-[3.45vh] "
      >
        <img src={arrowLeft} alt="" />
        Back
      </button>
      <div className="w-full bg-[#202225]  text-[#B0B0B0] font-bold text-[1.125rem] border-[#585858] border-dashed border rounded-[7px] h-[4.5989vh] mb-[1.53vh] flex md:justify-between justify-center items-center md:gap-[31px] md:pl-[2.86vw] md:pr-[33.93vw] ">
        <button
          onClick={onVaultBackClick}
          className="md:flex items-center gap-2 text-[#009FBD] text-sm hidden "
        >
          <img src={arrowLeft} alt="" />
          Back
        </button>
        <h1 className="flex items-center gap-2 ">
          Vault-0{_vaultId}{" "}
          <button>
            <img src={edit} alt="" className="w-[24px] h-[2.34vh]" />
          </button>
        </h1>
      </div>
      <div className="flex justify-center md:gap-[57px] text-[#D9D9D9] mb-[2.21vh] flex-col md:flex-row">
        <div className="md:w-[418px] w-full h-auto rounded-[20px] bg-[#12A92A] py-[1vh]  px-[23px] mb-[0.73vh] md:mb-0">
          <div className="flex justify-between mb-[2.215vh] ">
            <div className="flex flex-col items-center justify-between ">
              <h1 className="md:text-[1rem] text-xs  font-bold ">
                Total Locked XDC
              </h1>
              {vaultInfo && (
                <p className="md:text-[1.5rem] text-xl mt-[-0.74vh] font-medium ">
                  {new Big(vaultInfo.totalLockedCol).div("10e17").toFixed(4)}
                </p>
              )}
              {!vaultInfo && (
                <p className="md:text-[1.5rem] text-xl mt-[-0.74vh] font-medium ">
                  0.000
                </p>
              )}
              {vaultInfo && (
                <small className="font-medium text-xs md:text-[0.875rem] mt-[-0.74vh] ">
                  ~ $
                  {(
                    xdcPrc *
                    new Big(vaultInfo.totalLockedCol).div("10e17").toFixed(4)
                  ).toFixed(4)}
                </small>
              )}
              {!vaultInfo && (
                <small className="font-medium text-xs md:text-[0.875rem] mt-[-0.74vh] ">
                  ~ $0.0000
                </small>
              )}
              <button
                onClick={_onDepositClick}
                className="py-[0.5769vh] w-[36.23vw] md:w-auto  md:px-[44px] bg-[#B0B0B0] flex justify-center items-end rounded-lg  gap-[9px] hover:bg-opacity-75 text-xs md:text-[.85rem] mt-2 md:mt-6  text-[#292C31] font-medium text-[0.875rem] "
              >
                <img src={deposit} alt="" className="md:w-[1.25vw]" />
                Deposit
              </button>
            </div>
            <div className="flex flex-col justify-between  items-center ">
              <h1 className="md:text-[1rem] text-xs text-center font-bold ">
                Available
              </h1>
              {vaultInfo && (
                <p className="md:text-[1.5rem] text-xl font-medium mt-[-0.74vh] ">
                  {new Big(vaultInfo.availCollateral).div("10e17").toFixed(4)}
                </p>
              )}
              {!vaultInfo && (
                <p className="md:text-[1.5rem] text-xl font-medium mt-[-0.74vh] ">
                  0.0000
                </p>
              )}
              {vaultInfo && (
                <small className="font-medium text-xs md:text-[0.875rem] mt-[-0.74vh]  ">
                  ~ $
                  {(
                    xdcPrc *
                    new Big(vaultInfo.availCollateral).div("10e17").toFixed(4)
                  ).toFixed(4)}
                </small>
              )}
              {!vaultInfo && (
                <small className="font-medium text-xs md:text-[0.875rem] mt-[-0.74vh]  ">
                  ~ $0.0000
                </small>
              )}
              <button
                onClick={_onWithdrawClick}
                className="py-[0.5769vh] w-[36.23vw] md:w-auto md:px-[44px] bg-[#B0B0B0] flex justify-center items-end rounded-lg  gap-[9px] hover:bg-opacity-75 text-xs md:text-[0.85rem] mt-2 md:mt-6  text-[#292C31] font-medium text-[0.875rem] "
              >
                <img src={withdraw} alt="" className="md:w-[1.25vw]" />
                Withdraw
              </button>
            </div>
          </div>
        </div>

        <div className="md:w-[418px] w-full rounded-[20px] py-[1vh] px-[23px] bg-[#FF1F1F] flex flex-col items-center mb-[0.73vh] md:mb-0 ">
          <div className="flex justify-between mb-[2.215vh] ">
            <div className="flex flex-col items-center">
              <h1 className="text-[1rem]  font-bold ">Total STC Debt</h1>
              {vaultInfo && (
                <p className="text-[1.5rem] font-medium mt-[-0.74vh]  ">
                  {new Big(vaultInfo.totalDebt).div("10e17").toFixed(4)}
                </p>
              )}
              {!vaultInfo && (
                <p className="text-[1.5rem] font-medium mt-[-0.74vh]  ">
                  0.0000
                </p>
              )}
              {vaultInfo && (
                <small className="font-medium text-[0.875rem] mt-[-0.74vh] ">
                  ~ ${new Big(vaultInfo.totalDebt).div("10e17").toFixed(4)}
                </small>
              )}
              {!vaultInfo && (
                <small className="font-medium text-[0.875rem] mt-[-0.74vh] ">
                  ~ $0.0000
                </small>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center text-[#292C31] font-medium text-[0.875rem] ">
            <button
              onClick={_onPaybackClick}
              className="py-[0.5769vh] px-[44px] bg-[#B0B0B0] flex justify-center items-end rounded-lg  gap-[9px] hover:bg-opacity-75 text-[0.85rem] "
            >
              <img src={withdraw} alt="" className="w-[1.25vw]" />
              Pay Back
            </button>
          </div>
        </div>
      </div>
      <div className="flex justify-center md:gap-[57px] items-center mb-[3.15vh] flex-col md:flex-row">
        <div className="flex flex-col items-center text-[#D9D9D9] font-bold text-[1rem] w-full  md:w-[418px] bg-[#865DFF] rounded-[20px] py-[1vh] px-[63px] mb-[0.73vh] md:mb-0 text-center">
          {vaultInfo && (
            <h1>
              Collateralization Ratio:{" "}
              {new Big(vaultInfo.colRatio).div("10e17").toFixed(4)}
            </h1>
          )}
          {!vaultInfo && <h1>Collateralization Ratio: 0.0000</h1>}
          <p>Stability Fee: 10%</p>
        </div>
        <div className="flex flex-col items-center w-full md:w-[418px] text-[#D9D9D9] font-bold text-[1rem] bg-[#C16E08] rounded-[20px] py-[1vh] px-[63px] text-center ">
          <h1>Liquidation Ratio: {colRatio}</h1>
          <p>Liquidation Penalty: 0.5%</p>
        </div>
      </div>
      <h1 className="w-full bg-[#202225] flex items-center justify-center text-[#B0B0B0] font-bold text-[1.125rem] border-[#585858] border-dashed border rounded-[7px] h-[4.5989vh] mb-[2.73vh] mt-[10.04vh] md:mt-0 ">
        Vaults History
      </h1>
      <div className="flex w-full justify-between mb-[3.22vh] h-[4.1vh] ">
        <div className="h-full flex gap-4">
          <div className="relative h-full">
            <input
              type="search"
              name=""
              id=""
              className="h-full md:w-[426px] w-[36.95vw]  rounded-lg bg-[#B0B0B0] pl-[30px] md:pl-[50px] placeholder:text-[#292C31] text-[#292C31] "
              placeholder="Search..."
            />
            <img
              src={search}
              alt=""
              className="md:w-[24px] w-[3.25vw] md:h-[2.3vh] absolute md:top-1.5 top-2 left-3  "
            />
          </div>
          <button className="md:w-[2.9vw] h-full rounded-sm border border-[#B0B0B0] flex items-center justify-center ">
            <img src={filter} alt="" className="w-[24px] h-[2.34vh]" />
          </button>
        </div>
        <h2 className="text-[#B0B0B0] font-bold bg-[#202225] rounded-lg md:w-[191px] w-[32.36vw] flex items-center justify-center text-xs md:text-base ">
          Total Vaults: {vaultsData.length}
        </h2>
      </div>
      <div className="md:table w-full text-[#B0B0B0] text-[1rem] hidden    ">
        <div className="bg-[#202225] py-[1vh] flex justify-between items-center pl-[22px] border-b border-[#B0B0B0]  ">
          <h1 className="w-[300px]">Activity</h1>
          <h1 className="w-[300px]">Date and Time</h1>
          <h1 className="w-[300px]">Tx Hash</h1>
        </div>
        <div className="max-h-[10.85vh] bg-[#292C31] overflow-auto  ">
          {vaultsData.map((vault, index) => (
            <div
              className="flex justify-between items-center pl-[22px] py-[1vh] border-b border-[#B0B0B0]  "
              key={index}
            >
              <h1 className="w-[300px]">{vault.activity}</h1>
              <h1 className="w-[300px] ">
                {vault.date} | {vault.time}
              </h1>
              <h1 className="w-[300px]">{vault.txHash}</h1>
            </div>
          ))}
        </div>
      </div>
      <div className="md:hidden w-full flex flex-col gap-[1.56vh]">
        {vaultsData.map((vault, index) => (
          <div className="">
            <div className="bg-[#B0B0B0] w-full  rounded-t-[0.93rem] py-[1vh] px-[3.89vw] text-[#292C31] font-semibold flex items-center gap-2 text-xs  ">
              {vault.date} | {vault.time}
            </div>
            <div className=" bg-[#202225] rounded-b-[0.93rem] p-[3.86vw] text-[#B0B0B0] flex flex-col gap-1 ">
              <h6 className="font-semibold text-sm">{vault.activity}</h6>
              <p className="text-xs">{vault.txHash}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Vault;
