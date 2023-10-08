import React from "react";
import HomeIndex from "./HomeIndex";
import { useEffect } from "react";
import { useDashboard } from "../../../contexts/dashboardContext";

function Home({
  _isReg,
  _totalLck,
  _totalDebt,
  _xdcPrc,
  _hauntedVlts,
  _liquidatedVlts,
  _colRatio,
  _allVaults,
}) {
  const { active, activeTab } = useDashboard();

  useEffect(() => {
    if (active === 1) {
      activeTab(1);
    }
  }, [active]);

  return (
    <div>
      <HomeIndex
        isReg={_isReg}
        totalLck={_totalLck}
        totalDebt={_totalDebt}
        xdcPrc={_xdcPrc}
        hauntedVlts={_hauntedVlts}
        liquidatedVlts={_liquidatedVlts}
        colRatio={_colRatio}
        allVaults={_allVaults}
      />
    </div>
  );
}

export default Home;
