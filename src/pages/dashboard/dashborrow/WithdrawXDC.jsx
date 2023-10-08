import React from "react";
import WithdrawXDCIndex from "./WithdrawXDCIndex";
import SuccessfulModal from "./SuccessfulModal";

import FailedModal from "./FailedModal";

function WithdrawXDC({
  web3,
  _onVaultClick,
  _vaultId,
  xdcBalance,
  xdcPrc,
  stb,
  account,
  _withdrawRes,
}) {
  return (
    <div className="px-[4.83vw] md:px-0 ">
      <h1 className="w-full bg-[#202225] text-center text-[#B0B0B0] font-bold text-[1.125rem] border-[#585858] border-dashed border rounded-[7px] h-[4.5989vh] mb-[1.53vh] flex justify-center items-center gap-[31px] ">
        Withdraw XDC
      </h1>
      {_withdrawRes === null && (
        <WithdrawXDCIndex
          _web3={web3}
          _xdcPrc={xdcPrc}
          _xdcBalance={xdcBalance}
          _stb={stb}
          _account={account}
        />
      )}
      {_withdrawRes === true && (
        <SuccessfulModal
          vaultId={_vaultId}
          onVaultClick={_onVaultClick}
          withdrawRes={_withdrawRes}
        />
      )}
      {_withdrawRes === false && (
        <FailedModal
          vaultId={_vaultId}
          onVaultClick={_onVaultClick}
          withdrawRes={_withdrawRes}
        />
      )}
    </div>
  );
}

export default WithdrawXDC;
