import React, { useEffect } from "react";

import Vault from "./Vault";
import Borrow from "./Borrow";
import PaybackSTC from "./PaybackSTC";
import DepositXDC from "./DepositXDC";
import WithdrawXDC from "./WithdrawXDC";
import { useDashboard } from "../../../contexts/dashboardContext";

function DashBorrow({
  _onVaultBackClick,
  _totalLck,
  _totalDebt,
  _xdcPrc,
  _colRatio,
  _allVaults,
  _stb,
  _xdcBalance,
  _stc,
  _account,
  _resetVaultSetup,
  _web3,
  _stcBlnc,
}) {
  const {
    vault,
    vaultId,
    borrow,
    deposit,
    withdraw,
    payback,
    onDepositClick,
    onWithdrawClick,
    onPaybackClick,
    onVaultClick,
    depositRes,
    withdrawRes,
    paybackRes,
  } = useDashboard();

  const { active, activeTab } = useDashboard();

  useEffect(() => {
    if (active === 1) {
      activeTab(2);
    }
  }, [active]);

  return (
    <>
      {borrow && (
        <Borrow
          totalLck={_totalLck}
          totalDebt={_totalDebt}
          xdcPrc={_xdcPrc}
          colRatio={_colRatio}
          allVaults={_allVaults}
          stb={_stb}
          _onVaultClick={onVaultClick}
          xdcBalance={_xdcBalance}
        />
      )}
      {vault && (
        <Vault
          onVaultBackClick={_onVaultBackClick}
          resetVaultSetup={_resetVaultSetup}
          _vaultId={vaultId}
          colRatio={_colRatio}
          stb={_stb}
          xdcPrc={_xdcPrc}
          _onDepositClick={onDepositClick}
          _onWithdrawClick={onWithdrawClick}
          _onPaybackClick={onPaybackClick}
          _onVaultClick={onVaultClick}
        />
      )}
      {payback && (
        <PaybackSTC
          web3={_web3}
          _onVaultClick={onVaultClick}
          _vaultId={vaultId}
          stcBalance={_stcBlnc}
          stb={_stb}
          account={_account}
          _paybackRes={paybackRes}
          stc={_stc}
        />
      )}
      {deposit && (
        <DepositXDC
          web3={_web3}
          _onVaultClick={onVaultClick}
          _vaultId={vaultId}
          xdcBalance={_xdcBalance}
          xdcPrc={_xdcPrc}
          stb={_stb}
          account={_account}
          _depositRes={depositRes}
        />
      )}
      {withdraw && (
        <WithdrawXDC
          web3={_web3}
          _onVaultClick={onVaultClick}
          _vaultId={vaultId}
          xdcBalance={_xdcBalance}
          xdcPrc={_xdcPrc}
          stb={_stb}
          account={_account}
          _withdrawRes={withdrawRes}
        />
      )}
    </>
  );
}

export default DashBorrow;
