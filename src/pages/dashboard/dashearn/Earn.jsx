import React, { useEffect, useState } from "react";
import EarnIndex from "./EarnIndex";
import EarnPageTwo from "./EarnPageTwo";
import { useDashboard } from "../../../contexts/dashboardContext";

import EarnSuccess from "./EarnSuccess";
import EarnFailed from "./EarnFailed";

function Earn({
  _web3,
  _stb,
  _account,
  _colRatio,
  _hauntedVlts,
  _liquidatedVlts,
  _xdcPrc,
}) {
  const [pageTwo, setPageTwo] = useState(false);
  const [pageOne, setPageOne] = useState(true);
  const [status, setStatus] = useState(null);

  const onHauntClick = () => {
    setPageTwo(true);
    setPageOne(false);
  };

  const onBackClick = () => {
    setPageTwo(false);
    setPageOne(true);
  };

  const { active, activeTab, handleLoading } = useDashboard();

  useEffect(() => {
    if (active === 1) {
      activeTab(3);
    }
    if (!pageOne && !pageTwo) {
      setPageOne(true);
    }
  }, [active]);

  const handleStatus = (value) => {
    setStatus(value);
    setPageTwo(false);
  };

  useEffect(() => {
    if (status !== null) {
      const timer = setTimeout(() => {
        setPageTwo(true);
        setStatus(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="px-[4.83vw] md:px-0 md:pb-0 pb-[15.62vh]">
      {pageOne && (
        <EarnIndex
          web3={_web3}
          stb={_stb}
          account={_account}
          colRatio={_colRatio}
          hauntedVlts={_hauntedVlts}
          liquidatedVlts={_liquidatedVlts}
          _onHauntClick={onHauntClick}
        />
      )}

      {pageTwo && (
        <EarnPageTwo
          xdcPrc={_xdcPrc}
          stb={_stb}
          _onBackClick={onBackClick}
          account={_account}
          handleStatus={handleStatus}
          handleLoading={handleLoading}
        />
      )}
      {status !== null && (status ? <EarnSuccess /> : <EarnFailed />)}
    </div>
  );
}

export default Earn;
