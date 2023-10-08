// SPDX-License-Identifier: MIT
pragma solidity >=0.5.11 < 0.9.0;

interface IInvokeOracle{
    function requestData(address _caller, string memory _fsyms,string memory _tsyms) external returns (bytes32 requestId);
    function showPrice(bytes32 _reqid) external view returns(uint256);
}

interface IStbOracle{
    function getPriceInfo(string memory fsyms,string memory tsyms) external returns(bytes32);
    function show(bytes32 reqid) external view returns(uint256);
}

contract StbOracle{
    address CONTRACTADDR = 0x1acd9eb739C191689Be282C2C804665c8ffd0E4e;
    bytes32 public requestId; 

    //Fund this contract with sufficient PLI, before you trigger below function. 
    //Note, below function will not trigger if you do not put PLI in above contract address
    function getPriceInfo(string memory fsyms,string memory tsyms) external returns(bytes32){
        (requestId) = IInvokeOracle(CONTRACTADDR).requestData({_caller:msg.sender,_fsyms:fsyms,_tsyms:tsyms}); 
        return requestId;
    }
    //TODO - you can customize below function as you want, but below function will give you the pricing value for the input requestId
    //This function will give you last stored value in the contract
    function show(bytes32 reqid) external view returns(uint256){
        return IInvokeOracle(CONTRACTADDR).showPrice({_reqid:reqid});
    }
}