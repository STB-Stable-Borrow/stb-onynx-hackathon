import React from "react";
import DepositXDCIndex from "./DepositXDCIndex";
import SuccessfulModal from "./SuccessfulModal";
import FailedModal from "./FailedModal";

function DepositXDC({
  _onVaultClick,
  _vaultId,
  xdcBalance,
  xdcPrc,
  stb,
  account,
  _depositRes,
  web3,
}) {
  return (
    <div className="px-[4.83vw] md:px-0 md:pb-0 ">
      <h1 className="w-full bg-[#202225] text-center text-[#B0B0B0] font-bold text-[1.125rem] border-[#585858] border-dashed border rounded-[7px] h-[4.5989vh] mb-[1.53vh] flex justify-center items-center gap-[31px] ">
        Deposit XDC
      </h1>
      {_depositRes === null && (
        <DepositXDCIndex
          _web3={web3}
          _xdcBalance={xdcBalance}
          _xdcPrc={xdcPrc}
          _stb={stb}
          _account={account}
        />
      )}
      {_depositRes === true && (
        <SuccessfulModal
          vaultId={_vaultId}
          onVaultClick={_onVaultClick}
          depositRes={_depositRes}
        />
      )}
      {_depositRes === false && (
        <FailedModal
          vaultId={_vaultId}
          onVaultClick={_onVaultClick}
          depositRes={_depositRes}
        />
      )}
    </div>
  );
}

export default DepositXDC;
