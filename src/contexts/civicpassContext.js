import React, { createContext, useContext } from "react";
import { GatewayProvider } from "@civic/ethereum-gateway-react";

const CivicPassContext = createContext();

export const CivicPassProvider = ({ children, _wallet }) => {
  const UNIQUENESS_PASS = "ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6";

  return (
    <GatewayProvider wallet={_wallet} gatekeeperNetwork={UNIQUENESS_PASS}>
      {children}
    </GatewayProvider>
  );
};

export function useCivicPass() {
  return useContext(CivicPassContext);
}
