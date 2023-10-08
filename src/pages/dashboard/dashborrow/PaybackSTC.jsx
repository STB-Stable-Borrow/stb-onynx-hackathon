import React from "react";

import SuccessfulModal from "./SuccessfulModal";
import PaybackSTCIndex from "./PaybackSTCIndex";
import FailedModal from "./FailedModal";

function PaybackSTC({
  _onVaultClick,
  _vaultId,
  stcBalance,
  stb,
  account,
  _paybackRes,
  web3,
  stc,
}) {
  return (
    <>
      <div className="px-[4.83vw] md:px-0">
        <h1 className="w-full bg-[#202225] text-center text-[#B0B0B0] font-bold text-[1.125rem] border-[#585858] border-dashed border rounded-[7px] h-[4.5989vh] mb-[1.53vh] flex justify-center items-center gap-[31px] ">
          Payback STC
        </h1>
        {_paybackRes === null && (
          <PaybackSTCIndex
            _stcBalance={stcBalance}
            _stb={stb}
            _account={account}
            _web3={web3}
            vaultId={_vaultId}
            _stc={stc}
          />
        )}
        {_paybackRes === true && (
          <SuccessfulModal
            onVaultClick={_onVaultClick}
            vaultId={_vaultId}
            paybackRes={_paybackRes}
          />
        )}
        {_paybackRes === false && (
          <FailedModal
            onVaultClick={_onVaultClick}
            vaultId={_vaultId}
            paybackRes={_paybackRes}
          />
        )}
      </div>
    </>
  );
}

export default PaybackSTC;
