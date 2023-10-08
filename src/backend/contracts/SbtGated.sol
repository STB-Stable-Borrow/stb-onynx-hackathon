//official contract of sbtGated a similar contract to Gated from civiv docs: 
//https://docs.civic.com/integration-guides/civic-idv-services/integration-overview/on-chain-integration

// SPDX-License-Identifier: MIT
pragma solidity >=0.5.11 < 0.9.0;

import {IGatewayTokenVerifier} from "@identity.com/gateway-protocol-eth/contracts/interfaces/IGatewayTokenVerifier.sol";

contract SbtGated {
    address private _gatewayTokenContract;
    uint256 private _gatekeeperNetwork;

    /// The gateway token is not valid.
    error IsGated__InvalidGateway(address gatewayToken);

    constructor(address gatewayTokenContract, uint256 gatekeeperNetwork) {
        _gatewayTokenContract = gatewayTokenContract;
        _gatekeeperNetwork = gatekeeperNetwork;
    }

    modifier isGated(address account) {
        IGatewayTokenVerifier verifier = IGatewayTokenVerifier(_gatewayTokenContract);
        if (!verifier.verifyToken(account, _gatekeeperNetwork)) {
            revert IsGated__InvalidGateway(_gatewayTokenContract);
        }
        _;
    }
}