import { createContext, useContext, useState } from "react";

const BorrowContext = createContext();

export const BorrowProvider = ({ children }) => {
  const [vault, setVault] = useState(true);
  const [generateSTC, setGenerateSTC] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [colRatio, setColRatio] = useState(null);
  const [colRt, setColRt] = useState(null);
  const [totalXdcIn, setTotalXdcIn] = useState(null);
  const [totalStcOut, setTotalStcOut] = useState(null);
  const [generateRes, setGenerateRes] = useState(false);
  const [fromDashborrow, setFromDashborrow] = useState(false);
  const [fromDashearn, setFromDashearn] = useState(false);

  const handleVaultNext = () => {
    setVault(false);
    setGenerateSTC(true);
    setConfirm(false);
  };

  const handleGenerateSTCNext = (genRes) => {
    setGenerateSTC(false);
    setGenerateRes(genRes);
    setConfirm(true);
  };

  const handleGenerateSTCBack = () => {
    setConfirm(false);
    setGenerateSTC(false);
    setVault(true);
  };

  //gets totalxdcin,and sets both xdcin and stcout
  const calculateAmounts = (xdcIn, stcOut, hntFee) => {
    setTotalStcOut(stcOut);
    setTotalXdcIn(xdcIn + hntFee);
  };

  //resets vault setup to initial value; important to ensure vault management are in order(users don't need to refresh)
  const resetVaultBorrowSetup = () => {
    setConfirm(false);
    setVault(true);
    setGenerateSTC(false);
    setGenerateRes(false);
  };

  return (
    <BorrowContext.Provider
      value={{
        vault,
        confirm,
        colRatio,
        colRt,
        generateSTC,
        totalStcOut,
        totalXdcIn,
        generateRes,
        fromDashborrow,
        fromDashearn,
        setVault,
        setGenerateSTC,
        setConfirm,
        setColRatio,
        setColRt,
        handleVaultNext,
        handleGenerateSTCNext,
        handleGenerateSTCBack,
        calculateAmounts,
        resetVaultBorrowSetup,
        setFromDashborrow,
        setFromDashearn,
      }}
    >
      {children}
    </BorrowContext.Provider>
  );
};

export function useBorrow() {
  return useContext(BorrowContext);
}
